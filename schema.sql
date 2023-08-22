CREATE SCHEMA green;

USE green;

CREATE TABLE rols(
  id_rol INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE users(
  id_user INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  rut VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_rol INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_rol) REFERENCES rols(id_rol)
);


CREATE TABLE donations(
  id_donation INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantity INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_user INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE events(
  id_event INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  description VARCHAR(100) NOT NULL,
  date_time DATETIME,
  location VARCHAR(50)
);

CREATE TABLE images(
  id_image INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(256),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  description VARCHAR(100) NOT NULL,
  id_event INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_event) REFERENCES events(id_event)
);

CREATE TABLE record_event(
  id_record_event INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_event INT UNSIGNED NOT NULL,
  id_user INT UNSIGNED NOT NULL,
  trees INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_event) REFERENCES events(id_event),
  FOREIGN KEY (id_user) REFERENCES users(id_user)
);
-- Para evitar que un usuario se registre 2 veces en el mismo evento
ALTER TABLE record_event ADD CONSTRAINT event_user UNIQUE(id_event, id_user);

-- crea los roles
INSERT INTO rols (name) VALUES ('admin'), ('user');



