import { pool } from '../conexion'
import { Clientes } from '../modules/clientes.models';
import { Parqueadero } from '../modules/parqueadero.models';
import { Socios } from '../modules/socios.models';
import { User } from '../modules/users.models';
import { Vehiculo } from '../modules/vehiculo.models';

export class SocioService {

  private socios: Socios[] = [];
  private clientes: Clientes[] = [];

  private pool: typeof pool;

  constructor() {
    this.socios = [];
    this.clientes = [];
    this.pool = pool
  }

  /**
   *Funcion que permite crear un usuario TIPO ROL CLIENTE
   * @param dataCliente :Objeto Cliente
   * @returns : QueryResult
   */
  async crearCliente(dataCliente: Clientes) {
    const queryCliente = await this.pool.query("SELECT id FROM clientes where correo=$1", [dataCliente.correo])
    if (queryCliente.rowCount == 0 && dataCliente.rol == "cliente") {
      const query = "INSERT INTO clientes (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4)";
      const result = await this.pool.query(query, [dataCliente.nombre, dataCliente.correo, dataCliente.contrasena, dataCliente.rol]);
      return result.rows;
    } else {
      throw new Error('El cliente ya esta registrado')
    }
  }

  /**
   * Funcion que permite asociar un cliente a el mismo
   * @param idSocio : NUMBER, id socio
   * @param dataCliente : Object Cliente
   * @returns
   */
  async asociarClienteS(idSocio: number, dataCliente: Clientes) {
    const queryCliente = await this.pool.query("SELECT id FROM clientes where id=$1", [dataCliente.id]);
    if (queryCliente.rowCount == 0) {
      throw new Error('El cliente no encontrado')
    }
    const result1 = await this.pool.query("INSERT INTO socio_cliente (id_socio, id_cliente) VALUES ($1, $2)", [idSocio, dataCliente.id])
    return result1.rows;
  }

  /**
   * Funcion que permite listar Parqueadero por el socio
   * @param idSocio : number id socio
   * @returns :QueryResult listado de parqueadero
   */
  async listarParqueadero(idSocio: number) {
    const result1 = await this.pool.query("SELECT v.nombre as carro, p.nombre FROM parqueadero as p join socios as s on p.id_socio = s.id join vehiculo as v on p.id = v.id_parqueadero where s.id = $1", [idSocio]);
    if (result1.rowCount == 0) {
      throw new Error('Error con el listado de parqueadero del socio')
    }
    return result1.rows;
  }

  /**
   * Funcion que permite ver el detalle del vehiculo en su parqueadero
   * @param idSocio : number id socio
   * @param idVehiculo : number id vehiculo
   * @returns
   */
  async destalleParqueadero(idSocio: number, idVehiculo: number) {
    const result1 = await this.pool.query("SELECT v.nombre, v.placa, v.fechaingreso FROM parqueadero as p join socios as s on p.id_socio = s.id join vehiculo as v on p.id = v.id_parqueadero where v.id = $1 and s.id=$2", [idVehiculo, idSocio]);
    if (result1.rowCount == 0) {
      throw new Error('Vehiculo no encontrado')
    }
    return result1.rows;
  }

  /**
   * funcion que permite verificar vehiculos no son primera vez
   * @returns : QueryResult
   */
  async verificarVehiculosPar() {
    const query = ("SELECT count(v.placa), v.placa FROM vehiculo as v join historial as h on v.id_parqueadero = h.id_parking where v.placa IN (h.placa) group by v.placa");
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Funcion que permite verificar cuales son nuevos
   * @returns : QueryResult
   */
  async verifiVehiParNuevo() {
    const query = ("SELECT count(h.placa), v.placa FROM vehiculo as v join historial as h on v.id_parqueadero = h.id_parking where v.placa <>h.placa group by v.placa");
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Funcion que permite consultar cuantos clientes han usado el parqueadero
   * @returns : QueryResult
   */
  async usandoParking() {
    const query = ("SELECT count(v.id_cliente) as cantidad FROM vehiculo as v where v.id_cliente IS NOT NULL");
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Funcion que permite consultar cuantos clientes no han usado el parqueadero
   * @returns : QueryResult
   */
  async notUsandoParking() {
    const query = "SELECT COUNT(c.id) as cantidad FROM clientes as c LEFT join vehiculo as v on c.id = v.id_cliente where v.id_cliente is null";
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Funcion que permite listar vehiculos por cliente
   * @param idCliente
   * @returns : QueryResult
   */
  async listadoVehiculoCliente(idCliente: number) {
    const query = "SELECT v.nombre FROM clientes as c JOIN vehiculo as v ON c.id = v.id_cliente WHERE v.id_cliente = $1";
    const result = await this.pool.query(query, [idCliente]);
    if (result.rowCount == 0) {
      throw new Error('El cliente no tiene ningun vehiculo')
    }
    return result.rows;
  }

  /**
   * Funcion que permite ver el detalle del vehiculo por cliente
   * @param idCliente
   * @param idplaca
   * @returns : QueryResult
   */
  async listadoVehiculoDetalle(idCliente: number, idplaca: string) {
    const query = "SELECT v.nombre, v.placa, v.fechaingreso, v.id_cliente, p.nombre as parking FROM vehiculo as v LEFT OUTER JOIN parqueadero as p ON p.id = v.id_parqueadero WHERE v.id_cliente = $1 AND v.placa = $2";
    const result = await this.pool.query(query, [idCliente, idplaca]);
    if (result.rowCount == 0) {
      throw new Error('Cliente o vehiculo no encontrado')
    }
    return result.rows;
  }

  //obtener el promedio de uso de un parqueadero por rango de fecha

  //--------------------regresar los 10 vehículos que mas veces se han registrado en el parqueadero y cuantas veces-------------------------//

  async listRegis(id: number) {
    const query = ("SELECT v.placa, count(v.placa) FROM vehiculo as v JOIN parqueadero as p on v.id_parqueadero = p.id WHERE p.id = $1 group by v.placa");
    const result = await this.pool.query(query, [id]);
    return result.rows;
  }

}
