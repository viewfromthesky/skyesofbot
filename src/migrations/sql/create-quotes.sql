CREATE TABLE quotes (quote_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, creator_user_id varchar(255) NOT NULL, quote_date datetime DEFAULT CURRENT_TIMESTAMP, quoted_person_name varchar(1024), quote_name varchar(1024), data varchar(2048));
CREATE INDEX idx_quote_creator ON quotes (creator_user_id);
