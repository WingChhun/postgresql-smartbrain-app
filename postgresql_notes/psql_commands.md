# PostgreSQL notes

### Note:

- These commands are based off the lectures from the Udemy Course: **The Complete Web Developer Zero To Mastery**

### Commands

- **Starter Commands**

  - Start postgreSQL using **brew**
    - `brew services start postgresql`
    - `brew services stop postgresql`
    - `brew services restart postgresql`

- Create a db

  - `createdb db_name`

- Connect to db createdb

  - `psql 'db_name'`
  - How to _describe the database_
    - `\d`
    - `\d table_name`

- Exit and go back to terminal
  - `\q`

**\* SQL COMMANDS**

- **Create Table**

- `CREATE TABLE table_name(column_1 datatype, column_2 datatype)`

  - _ex:_
    - `CREATE TABLE users(name text, age smallint, year, date);

- **INSERT INTO && SELECT**

- `INSERT INTO table_name (column_1, column_2, column_3 ) VALUES (value_1, value_2, value_3);`
  - _ex:_
  - `INSERT INTO users (name, age, birthday)`
  - `VALUES ('james', 31, 'YYYY-MM-DD')`

* Note: use single quotes or else errors
* Also do no t ave to keep re-writing the **(column-1, columN-2, column_3)**

- **SELECT**
  - `SELECT * from <table>`
  - `SELECT name, age, birthday FROM users;`
  -

### Author(s)

- James Chhun [WingChhun](https://github.com/wingchhun)
