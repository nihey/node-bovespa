CREATE TABLE event (
    id serial PRIMARY KEY,
    what TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE quote (
    id serial PRIMARY KEY,

    day DATE NOT NULL,
    codbdi TEXT,
    codneg TEXT NOT NULL,

    tpmerc TEXT,
    nomres TEXT,
    especi TEXT,
    prazot TEXT,
    modref TEXT,

    preabe NUMERIC(16, 2),
    premin NUMERIC(16, 2),
    premax NUMERIC(16, 2),
    premed NUMERIC(16, 2),
    preult NUMERIC(16, 2),
    preofc NUMERIC(16, 2),
    preofv NUMERIC(16, 2),
    preexe NUMERIC(16, 2),

    totneg BIGINT,
    quatot BIGINT,
    voltot BIGINT,

    indopc TEXT,
    fatcot TEXT,
    ptoexe TEXT,
    codisi TEXT,
    dismes TEXT,

    datven DATE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT quote_day_code_unique UNIQUE (day, codneg)
);
