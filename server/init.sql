CREATE TABLE users (
    u_id BIGSERIAL PRIMARY KEY,
    u_email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255),
    u_ernaehrungsform JSON
);

CREATE TABLE veranstaltung (
    v_id BIGSERIAL PRIMARY KEY,
    v_name VARCHAR(255) NOT NULL,
    teilnehmer_anzahl INTEGER,
    datum TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    beschreibung VARCHAR(255),
    ort VARCHAR(255) NOT NULL,
    u_id INTEGER REFERENCES users(u_id) ON DELETE CASCADE,
    u_email VARCHAR(255) REFERENCES users(u_email) ON DELETE CASCADE
);

CREATE TABLE gaeste (
    g_id BIGSERIAL PRIMARY KEY,
    g_name VARCHAR(255) NOT NULL,
    zusage VARCHAR(255),
    g_ernaehrungsform JSON,
    anmerkung VARCHAR(255),
    v_id INTEGER NOT NULL REFERENCES veranstaltung(v_id) ON DELETE CASCADE
);

CREATE TABLE rezepte (
    r_id BIGSERIAL PRIMARY KEY,
    r_name VARCHAR(255) NOT NULL,
    r_ernaehrungsform JSON,
    u_id INTEGER REFERENCES users(u_id) ON DELETE CASCADE,
    salzig VARCHAR(255)
);

CREATE TABLE aufgabe (
    a_id BIGSERIAL PRIMARY KEY,
    a_name VARCHAR(255) NOT NULL,
    a_beschreibung VARCHAR(255),
    v_id INTEGER REFERENCES veranstaltung(v_id) ON DELETE CASCADE,
    u_id INTEGER REFERENCES users(u_id) ON DELETE CASCADE
);

CREATE TABLE veranstaltung_users (
    v_id INTEGER NOT NULL REFERENCES veranstaltung(v_id) ON DELETE CASCADE,
    u_id INTEGER NOT NULL REFERENCES users(u_id) ON DELETE CASCADE,
    zusage VARCHAR(255),
    PRIMARY KEY (u_id, v_id)
);

CREATE TABLE rezept_veranstaltung (
    r_id INTEGER NOT NULL REFERENCES rezepte(r_id) ON DELETE CASCADE,
    v_id INTEGER NOT NULL REFERENCES veranstaltung(v_id) ON DELETE CASCADE,
    portionen INTEGER,
    PRIMARY KEY (r_id, v_id)
);