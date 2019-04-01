const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mkdirp = require("mkdirp");
const AdmZip = require("adm-zip");
const readline = require("readline");
const moment = require("moment");
const sequelize = require("../lib/db");
const { Quote } = sequelize;

const download = async function(year) {
  const url = `http://bvmf.bmfbovespa.com.br/InstDados/SerHist/COTAHIST_A${year}.ZIP`;
  mkdirp.sync(path.join(__dirname, '..', "_downloaded", "raw"))
  const filepath = path.resolve(__dirname, '..', "_downloaded", "raw", `A${year}.zip`);

  // Use cached file, if it exists
  if (fs.existsSync(filepath)) {
    console.log("Using cached", year);
    return;
  }

  const writer = fs.createWriteStream(filepath);

  console.log("Downloading ", year)
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

const extract = async function(year) {
  const extractedPath = path.resolve(__dirname, '..', "_downloaded", "extracted");
  mkdirp.sync(extractedPath);
  const sourcePath = path.resolve(__dirname, '..', "_downloaded", "raw", `A${year}.zip`);
  const destinationPath = path.resolve(__dirname, '..', "_downloaded", "extracted", `A${year}.txt`);

  // Use cached file, if it exists
  if (fs.existsSync(destinationPath)) {
    console.log("Using cached", year);
    return;
  }

  const zip = new AdmZip(sourcePath);

  console.log("Extracting", year)
  const entries = zip.getEntries().map(e => e.entryName);
  [`COTAHIST_A${year}.TXT`, `COTAHIST_A${year}`, `COTAHIST.A${year}`].forEach(filename => {
    if (!entries.find(f => filename === f)) {
      return;
    }

    console.log(filename, extractedPath, entries)
    zip.extractEntryTo(filename, extractedPath, false, true);
    fs.renameSync(path.join(extractedPath, filename), destinationPath);
  })
}

const parse = async function(year, transaction) {
  const source = path.resolve(__dirname, '..', "_downloaded", "extracted", `A${year}.txt`);
  const lines = fs.readFileSync(source, "utf-8").split(/\r?\n/);
  let query = "INSERT INTO quote "
  let columns;
  let rows = [];
  let set = new Set();

  for (const line of lines) {
    // Ignore header and footer
    if (line.slice(0, 2) !== "01") {
      continue
    }

    let data = {
      day: line.slice(2, 10),
      codbdi: line.slice(10, 12),
      codneg: line.slice(12, 24),
      tpmerc: line.slice(24, 27),
      nomres: line.slice(27, 39),
      especi: line.slice(39, 49),
      prazot: line.slice(49, 52),
      modref: line.slice(52, 56),
      preabe: line.slice(56, 69),
      premax: line.slice(69, 82),
      premin: line.slice(82, 95),
      premed: line.slice(96, 108),
      preult: line.slice(109, 121),
      preofc: line.slice(121, 134),
      preofv: line.slice(134, 147),
      totneg: line.slice(147, 152),
      quatot: line.slice(152, 170),
      voltot: line.slice(170, 188),
      preexe: line.slice(188, 201),
      indopc: line.slice(201, 202),
      datven: line.slice(202, 210),
      fatcot: line.slice(210, 217),
      ptoexe: line.slice(217, 230),
      codisi: line.slice(230, 242),
      dismes: line.slice(242, 245),
    };

    if (!columns) {
      columns = Object.keys(data);
    }

    // Convert dates
    ["day", "datven"].forEach(attr => {
      data[attr] = moment(data[attr], "YYYYMMDD");
    });

    // Convert float values
    ["preabe", "premin", "premax", "premed", "preult", "preofc", "preofv", "preexe"].forEach(attr => {
      let v = data[attr]
      data[attr] = parseFloat(v.slice(0, v.length - 2) + "." + v.slice(v.length - 2, v.length));
    });

    // Conver int values
    ["totneg", "quatot", "voltot"].forEach(attr => {
      data[attr] = parseInt(data[attr]);
    });

    Object.entries(data).forEach(([k, v]) => {
      if (typeof v === "string") {
        data[k] = v.trim();
      }
    });

    const key = data.day.format("YYYY-MM-DD") + "-" + data.codneg;
    if (set.has(key)) {
      console.log("Found Duplicate:", key);
      continue
    }
    set.add(key);

    rows.push(columns.map(column => {
      const value = data[column];
      if (typeof value === "string") {
        return `'${value}'`;
      }
      if (value.format) {
        return value.format("'YYYY-MM-DD'");
      }

      return value;
    }));
  }

  console.log("Inserting:", year);
  query += " (" + columns.join(", ") + ") VALUES ";
  query += rows.map(x => `(${x})`).join(",\n") + ";";
  await sequelize.query(query);
};

async function main() {
  const years = [];
  for (let i = 1999; i < 2020; i++) {
    years.push(i);
  }

  for (const year of years) {
    console.log("Downloading files...");
    await download(year);
    console.log("Done\n");

    console.log("Extracting files...");
    await extract(year);
    console.log("Done\n");

    console.log("Parsing files");
    await parse(year);
    console.log("Done\n");
  }

  console.log("Finished");
  sequelize.close();
  process.exit(0);
}
main();
