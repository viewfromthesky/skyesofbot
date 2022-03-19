CREATE TABLE bookmarks (bookmark_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id varchar(255) NOT NULL, bookmark_name varchar(1024), data varchar(2048));
CREATE INDEX idx_user ON bookmarks (user_id);
