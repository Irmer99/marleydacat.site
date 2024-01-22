DROP DATABASE IF EXISTS `marley_db`;
CREATE DATABASE marley_db;
USE marley_db;

DROP TABLE IF EXISTS `users`;
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS `posts`;
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    poster_username VARCHAR(255),
    title VARCHAR(255),
    description VARCHAR(1024),
    image_name VARCHAR(255)
);