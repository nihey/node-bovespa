const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mkdirp = require("mkdirp");
const AdmZip = require("adm-zip");
const readline = require("readline");
const moment = require("moment");

const download = async function(year) {
  const url = `http://bvmf.bmfbovespa.com.br/InstDados/SerHist/COTAHIST_A${year}.ZIP`;
  mkdirp.sync(path.join(__dirname, "_downloaded", "raw"))
  const filepath = path.resolve(__dirname, "_downloaded", "raw", `A${year}.zip`);

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
  const extractedPath = path.resolve(__dirname, "_downloaded", "extracted");
  mkdirp.sync(extractedPath);
  const sourcePath = path.resolve(__dirname, "_downloaded", "raw", `A${year}.zip`);
  const destinationPath = path.resolve(__dirname, "_downloaded", "extracted", `A${year}.txt`);

  // Use cached file, if it exists
  if (fs.existsSync(destinationPath)) {
    console.log("Using cached", year);
    return;
  }

  const zip = new AdmZip(sourcePath);

  console.log("Extracting", year)
  zip.extractEntryTo(`COTAHIST_A${year}.TXT`, extractedPath, false, true);
  fs.renameSync(path.join(extractedPath, `COTAHIST_A${year}.TXT`), destinationPath);
}

const parse = async function(year) {
  const source = path.resolve(__dirname, "_downloaded", "extracted", `A${year}.txt`);
  const reader = readline.createInterface({
    input: require("fs").createReadStream(source),
  });

  reader.on("line", function(line) {
    // Ignore header and footer
    if (line.slice(0, 2) !== "01") {
      return;
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

    // Add an alias for the code
    data.code = data.codneg;

    Object.entries(data).forEach(([k, v]) => {
      if (typeof v === "string") {
        data[k] = v.trim();
      }
    });

  });

  return new Promise((resolve, reject) => {
    reader.on("close", () => resolve(history));
  });
};

async function main() {
  const years = [];
  for (let i = 2018; i < 2019; i++) {
    years.push(i);
  }

  console.log("Downloading files...");
  await Promise.all(years.map(year => download(year)));
  console.log("Done\n");

  console.log("Extracting files...");
  await Promise.all(years.map(year => extract(year)));
  console.log("Done\n");

  console.log("Parsing files");
  await Promise.all(years.map(year => parse(year)));
  console.log("Done\n");
}
main();
