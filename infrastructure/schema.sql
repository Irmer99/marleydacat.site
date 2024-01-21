DROP DATABASE IF EXISTS `marley_db`;
CREATE DATABASE marley_db;
USE marley_db;

DROP TABLE IF EXISTS `users`;
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);