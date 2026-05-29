CREATE DATABASE IF NOT EXISTS futbol_stats;
USE futbol_stats;

DROP TABLE IF EXISTS partidos;
DROP TABLE IF EXISTS jugadores;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jugadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  apellido VARCHAR(80) NOT NULL,
  equipo ENUM('Dictadores', 'Tramposos') NOT NULL,
  goles INT NOT NULL DEFAULT 0,
  presencias INT NOT NULL DEFAULT 0,
  sanciones INT NOT NULL DEFAULT 0,
  pecheras_llevadas INT NOT NULL DEFAULT 0,
  pecheras_sin_lavar INT NOT NULL DEFAULT 0,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_jugadores_usuario FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE partidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  equipo_local ENUM('Dictadores', 'Tramposos') NOT NULL,
  equipo_visitante ENUM('Dictadores', 'Tramposos') NOT NULL,
  goles_local INT NOT NULL DEFAULT 0,
  goles_visitante INT NOT NULL DEFAULT 0,
  ganador ENUM('Dictadores', 'Tramposos', 'Empate') NOT NULL,
  observaciones TEXT,
  goles_detalle JSON NULL,
  mvp_jugador_id INT NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_partidos_usuario FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_partidos_mvp FOREIGN KEY (mvp_jugador_id) REFERENCES jugadores(id) ON DELETE SET NULL
);

INSERT INTO jugadores (nombre, apellido, equipo, goles, presencias, sanciones, pecheras_llevadas, pecheras_sin_lavar, created_by) VALUES
('Juan', 'Perez', 'Dictadores', 18, 20, 2, 14, 3, NULL),
('Matias', 'Lopez', 'Dictadores', 11, 19, 1, 16, 2, NULL),
('Lucas', 'Gomez', 'Tramposos', 9, 18, 4, 10, 5, NULL),
('Nicolas', 'Ruiz', 'Tramposos', 14, 21, 3, 12, 4, NULL),
('Santiago', 'Fernandez', 'Dictadores', 6, 17, 0, 9, 1, NULL),
('Franco', 'Diaz', 'Tramposos', 8, 16, 2, 8, 2, NULL);

INSERT INTO partidos (fecha, equipo_local, equipo_visitante, goles_local, goles_visitante, ganador, observaciones, mvp_jugador_id, created_by) VALUES
('2026-04-30', 'Dictadores', 'Tramposos', 3, 2, 'Dictadores', 'Partido intenso con definición sobre el final', 1, NULL),
('2026-05-07', 'Tramposos', 'Dictadores', 1, 1, 'Empate', 'Encuentro parejo y muy físico', 2, NULL),
('2026-05-14', 'Dictadores', 'Tramposos', 2, 4, 'Tramposos', 'Remontada histórica', 4, NULL),
('2026-05-21', 'Tramposos', 'Dictadores', 0, 2, 'Dictadores', 'Defensa sólida y presión alta', 1, NULL);
