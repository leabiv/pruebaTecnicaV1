CREATE DATABASE prueba;

CREATE TABLE persona(
  nombre VARCHAR(20),
  correo VARCHAR(20),
  contrasena VARCHAR(20),
  rol VARCHAR(20)
);

CREATE TABLE clientes(
  id SERIAL PRIMARY KEY
)INHERITS(persona);

CREATE TABLE socios(
  id SERIAL PRIMARY KEY
)INHERITS(persona);

CREATE TABLE administradores(
  id SERIAL PRIMARY KEY
)INHERITS(persona);

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

select * from administradores
select * from socios
select * from clientes
select * from historial
select * from socio_cliente
select * from parqueadero


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

