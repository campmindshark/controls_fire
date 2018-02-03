
DROP TABLE IF EXISTS tblGPIO;
CREATE TABLE tblGPIO (
 gpio_id integer PRIMARY KEY,
 active_low integer,
 direction text,
 edge text,
 power text
);

DROP TABLE IF EXISTS tblParts;
CREATE TABLE tblParts (
  part_id integer PRIMARY KEY,
  gpio_id integer,
  type text,
  FOREIGN KEY (gpio_id) REFERENCES tblGPIO (gpio_id)
  ON DELETE SET NULL
);

DROP TABLE IF EXISTS tblLinkSourceParts;
CREATE TABLE tblLinkSourceParts (
  link_id integer PRIMARY KEY,
  part_id integer NOT NULL,
  source_id integer NOT NULL,
  FOREIGN KEY (source_id) REFERENCES tblParts (part_id)
  ON DELETE CASCADE
  FOREIGN KEY (part_id) REFERENCES tblParts (part_id)
  ON DELETE CASCADE
)

DROP VIEW IF EXISTS vwPartConfig;
CREATE VIEW vwPartConfig AS
SELECT p.part_id
, p.type
, p.gpio_id
, g.active_low
, g.direction
, g.edge
, g.power
FROM tblParts p LEFT OUTER JOIN tblGPIO g
                ON p.gpio_id = g.gpio_id
left outer join ( SELECT part_id
                       , group_concat(source_id)
                  FROM tblLinkSourceParts ) lsp
                  ON p.part_id = lsp.part_id
