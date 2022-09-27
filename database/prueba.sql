CREATE DATABASE prueba;

CREATE TABLE persona(
  nombre VARCHAR(20),
  correo VARCHAR(20),
  contrasena VARCHAR(20),
  rol VARCHAR(20)
);

CREATE TABLE clientes(
  id SERIAL PRIMARY KEY
);

CREATE TABLE socios(
  id SERIAL PRIMARY KEY
);

CREATE TABLE administradores(
  id SERIAL PRIMARY KEY
);

CREATE TABLE vehiculo(
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(10),
  placa VARCHAR(6),
  fechaingreso Date,
  id_parqueadero INTEGER,
  id_cliente INTEGER
);

CREATE TABLE parqueadero(
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(20),
  id_socio INTEGER,
  capacidad INTEGER
);

CREATE TABLE socio_cliente(
  id_socio INTEGER,
  id_cliente INTEGER
)

CREATE TABLE historial(
  id SERIAL PRIMARY KEY,
  id_parking INTEGER,
  placa VARCHAR(6),
  fechasalida DATE,
  fechaingreso DATE
)

INSERT INTO administradores (usuario,correo,contrasena,rol) values ('admin','admin@gmail.com','12345','admin');
select * from administradores

INSERT INTO socios (usuario,correo,contrasena,rol,id_ciente) values ('pepito','pepito@gmail.com','12345','socio',1);
INSERT INTO socios (usuario,correo,contrasena,rol,id_ciente) values ('luis','luis@gmail.com','12345','socio',2);
INSERT INTO socios (usuario,correo,contrasena,rol,id_ciente) values ('carlos','carlos@gmail.com','12345','socio',3);
select * from socios

INSERT INTO clientes (usuario,correo,contrasena,rol,id_vehiculo) values ('sara','sara@gmail.com','12345','cliente',1);
INSERT INTO clientes (usuario,correo,contrasena,rol,id_vehiculo) values ('mateo','mateo@gmail.com','12345','cliente',2);
INSERT INTO clientes (usuario,correo,contrasena,rol,id_vehiculo) values ('juan','juan@gmail.com','12345','cliente',3);
select * from clientes


ALTER TABLE socios
  ADD CONSTRAINT cliente_fk
  FOREIGN KEY(id_ciente)
  REFERENCES vehiculo(id);


ALTER TABLE clientes
  ADD CONSTRAINT vehiculo_fk
  FOREIGN KEY(id_Vehiculo)
  REFERENCES vehiculo(id);

ALTER TABLE parqueadero
  ADD CONSTRAINT vehiculoparking_fk
  FOREIGN KEY(id_vehiculo)
  REFERENCES vehiculo(id);

