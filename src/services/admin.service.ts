import { pool } from '../conexion'
import { Clientes } from '../modules/clientes.models';
import { Parqueadero } from '../modules/parqueadero.models';
import { Socios } from '../modules/socios.models';
import { User } from '../modules/users.models';
import { Vehiculo } from '../modules/vehiculo.models';

export class AdminService {

  private socios: Socios[] = [];
  private clientes: Clientes[] = [];
  private vehiculos: Vehiculo[] = [];
  private parqueaderos: Parqueadero[] = [];
  private pool: typeof pool;

  constructor() {
    this.socios = [];
    this.clientes = [];
    this.pool = pool
  }

  /**
   *
   * @returns
   */
  async findUsers() {
    const query = "SELECT * FROM socios";
    const result = await this.pool.query(query);
    return result.rows;
  }

  //debe poder crear usuarios con ROL SOCIO Y debe poder crear usuarios con ROL CLIENTE
  /**
   *
   * @param data
   * @returns
   */
  async createUser(data: User) {
    const { rol } = data;
    if (rol == 'socio') {
      const query = "INSERT INTO socios (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4)";
      const result1 = await this.pool.query(query, [data.nombre, data.correo, data.contrasena, data.rol]);
      return result1.rows;
    } else {
      const query = "INSERT INTO clientes (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4)";
      const result = await this.pool.query(query, [data.nombre, data.correo, data.contrasena, data.rol]);
      return result.rows;
    }
  }

  //debe poder ASOCIAR client a socios
  /**
   *
   * @param idSocio
   * @param dataCliente
   * @returns
   */
  async asociarCliente(idSocio: number, dataCliente: Clientes) {
    const result = await this.pool.query("SELECT id FROM socios WHERE id=$1", [idSocio]);
    if (result.rowCount > 0) {
      const result1 = await this.pool.query("INSERT INTO socio_cliente (id_socio, id_cliente) VALUES ($1, $2)", [idSocio, dataCliente.id]);
      return result1.rowCount;
    }
    return result.rowCount;
  }

  //debe poder hacer un CRUD de parqueaderos.
  /**
   *
   * @returns
   */
   async listarParking() {
    const query = "SELECT * FROM parqueadero";
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   *
   * @param dataParking
   * @returns
   */
  async crearParking(dataParking: Parqueadero) {
    const query = "INSERT INTO parqueadero (nombre) VALUES ($1)";
    const result = await this.pool.query(query, [dataParking.nombre]);
    return result.rowCount;
  }

  /**
   *
   * @param id
   * @param dataParking
   * @returns
   */
  async ActualizarParking(id: number, dataParking: Parqueadero) {
    const queryParking = await this.pool.query("SELECT id FROM parqueadero WHERE id = $1", [id]);
    if (queryParking.rowCount > 0) {
      const query = "UPDATE parqueadero SET nombre = $1 WHERE id = $2";
      const result = await this.pool.query(query, [dataParking.nombre, id]);
      return result.rowCount;
    }
    return queryParking.rowCount;
  }

  /**
   *
   * @param id
   * @returns
   */
  async findOneParking(id: number) {
    const query = "SELECT * FROM parqueadero WHERE id = $1";
    const result = await this.pool.query(query, [id]);
    return result.rows;
  }

  /**
   *
   * @param idParking
   * @returns
   */
  async eliminarParking(idParking: number) {
    const queryParking = await this.pool.query("SELECT id FROM parqueadero WHERE id = $1", [idParking]);
    if (queryParking.rowCount > 0) {
      const result = await this.pool.query("DELETE FROM parqueadero WHERE id=$1", [idParking]);
      return result.rowCount;
    }
    return queryParking.rowCount;
  }

  //puede asociar parqueaderos a socios. Siempre y cuando el parqueadero no este asociado a ningún otro socio
  /**
   *
   * @param idParking
   * @param idSocio
   * @returns
   */
  async asociarParking(idSocio: number, idParking: Parqueadero) {
      const query = "UPDATE parqueadero SET id_socio = $1 WHERE id = $2";
      const result = await this.pool.query(query, [idParking.id, idSocio]);
      return result.rows;
  }

  //puede revisar listado/detalle de vehículos en el parqueadero
  /**
   *
   * @returns
   */
  async listarVehiculos() {
    const query = "SELECT v.id, v.nombre, v.placa, v.fechaingreso, s.nombre as socio, s.correo FROM parqueadero as p join vehiculo as v on p.id = v.id_parqueadero join socios as s on s.id = p.id_socio";
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   *
   * @param idVehiculo
   * @returns
   */
  async findOneVehiculos(idVehiculo: number) {
    const query = "SELECT v.id, v.nombre, v.fechaingreso, s.usuario, s.correo FROM socios as s join parqueadero as p on s.id = p.id join vehiculo as v on p.id_vehiculo = v.id WHERE v.id=$1";
    const result = await this.pool.query(query, [idVehiculo]);
    return result.rows;
  }

  /**
   *
   * @param idSocio
   * @returns
   */
  async findOneVehiculosSocio(idSocio: number) {
    const query = "SELECT v.id, v.nombre, v.fechaingreso, s.usuario, s.correo FROM socios as s join parqueadero as p on s.id = p.id join vehiculo as v on p.id_vehiculo = v.id WHERE s.id=$1";
    const result = await this.pool.query(query, [idSocio]);
    return result.rows;
  }
}

