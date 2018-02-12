
DROP TABLE IF EXISTS tblLinkSourceParts;

DROP TABLE IF EXISTS tblInstallations;
CREATE TABLE tblInstallations ( installation_id integer UNIQUE
                              , name text
                              , created_by text );

DROP TABLE IF EXISTS tblGpio;
CREATE TABLE tblGpio ( gpio_id integer NOT NULL UNIQUE PRIMARY KEY
                     , active_low integer
                     , direction text
                     , edge text
                     , power text);

DROP TABLE IF EXISTS tblParts;
CREATE TABLE tblParts (part_id integer NOT NULL
                     , installation_id integer NOT NULL
                     , gpio_id integer
                     , part_name text
                     , type text
                     , FOREIGN KEY (installation_id)
                      REFERENCES tblInstallations (installation_id)
                     , FOREIGN KEY (gpio_id)
                      REFERENCES tblGpio (gpio_id)
                      ON DELETE SET NULL
                     , PRIMARY KEY(part_id, installation_id));

CREATE TABLE tblLinkSourceParts
  ( link_id integer NOT NULL
    , installation_id integer NOT NULL
    , part_id integer NOT NULL
    , source_id integer NOT NULL
    , FOREIGN KEY (installation_id)
     REFERENCES tblInstallations (installation_id)
     ON DELETE CASCADE
    , FOREIGN KEY (source_id)
     REFERENCES tblParts (part_id) ON DELETE CASCADE
    , FOREIGN KEY (part_id)
     REFERENCES tblParts (part_id) ON DELETE CASCADE
    , PRIMARY KEY (link_id, installation_id)
  );

DROP VIEW IF EXISTS vwPartConfig;
CREATE VIEW vwPartConfig AS
SELECT p.part_id,
       p.type,
       p.gpio_id,
       g.active_low,
       g.direction,
       g.edge,
       g.power,
       lsp.sources
FROM tblParts p
LEFT OUTER JOIN tblGPIO g ON p.gpio_id = g.gpio_id
LEFT OUTER JOIN
  (SELECT part_id ,
          group_concat(source_id) as sources
   FROM tblLinkSourceParts) lsp ON p.part_id = lsp.part_id;
