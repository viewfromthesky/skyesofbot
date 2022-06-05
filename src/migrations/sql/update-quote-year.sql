BEGIN TRANSACTION;
ALTER TABLE quotes ADD COLUMN quote_year INT NULL;
UPDATE quotes SET quote_year = CAST(SUBSTR(quote_date, 1, 4) AS INT);
CREATE TABLE quotes_backup (
  quote_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  creator_user_id varchar(255) NOT NULL,
  quote_year INT NULL DEFAULT NULL,
  quoted_person_name varchar(1024),
  quote_name varchar(1024),
  data varchar(2048)
);
INSERT INTO quotes_backup SELECT quote_id, creator_user_id, quote_year, quoted_person_name, quote_name, data FROM quotes;
DROP TABLE quotes;
ALTER TABLE quotes_backup RENAME TO quotes;
COMMIT;
