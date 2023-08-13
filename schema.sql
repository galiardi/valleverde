CREATE SCHEMA valle_verde;

USE valle_verde;

CREATE TABLE roles(
  id_rol INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50)
);

CREATE TABLE usuarios(
  id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  rut VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(256) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_rol INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);


CREATE TABLE donaciones(
  id_donacion INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  monto INT,
  fecha_donacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE eventos(
  id_evento INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  fecha_hora DATE,
  ubicacion VARCHAR(50)
);

CREATE TABLE imagenes(
  id_imagen INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  url_imagen VARCHAR(256),
  fecha_subida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descripcion VARCHAR(100) NOT NULL,
  id_evento INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_evento) REFERENCES eventos(id_evento)
);

CREATE TABLE registro_evento(
  id_registro_evento INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_evento INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  arboles_cantidad INT NOT NULL,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_evento) REFERENCES eventos(id_evento),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

INSERT INTO roles (nombre) VALUES ('administrador'), ('usuario');