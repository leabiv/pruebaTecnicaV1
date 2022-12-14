import { pool } from '../conexion'
import { Clientes } from '../modules/clientes.models';
import { Parqueadero } from '../modules/parqueadero.models';
import { Socios } from '../modules/socios.models';
import { User } from '../modules/users.models';
import { Vehiculo } from '../modules/vehiculo.models';
import { encryptPassword } from '../modules/encrypt.models';
import { Historial } from '../modules/historial.models';

export class AdminService {

  private socios: Socios[] = [];
  private clientes: Clientes[] = [];
  private vehiculos: Vehiculo[] = [];
  private parqueaderos: Parqueadero[] = [];
  private pool: typeof pool;

  constructor() {
    this.socios = [];
    this.clientes = [];
    //this.generate(); permite generar un administrador cada vez que se reinicie la maquina
    this.generate();
    this.pool = pool
  }

  async generate() {
    //const correo = "admin@gmail.com";
    //const query = await this.pool.query("select * from administradores where correo = $1",[correo]);
    //if(query.rowCount==0){
    const hash = await encryptPassword('admin');
    const query1 = "INSERT INTO administradores (nombre, correo, contrasena, rol) VALUES ('adminparking','admin@gmail.com',$1,'admin')";
    const result1 = await this.pool.query(query1, [hash]);
    //}

  }

  async buscarAdmin(correo: string) {
    const query = await this.pool.query("SELECT * FROM administradores WHERE correo = $1", [correo]);
    return query.rowCount;
  }
  /**
   * Funcion que permite listar los usuarios tipo socio
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
    const { rol, correo } = data;
    const buscarCorreo = await this.pool.query("SELECT * FROM (SELECT * FROM socios union SELECT * FROM clientes) sociosclientes WHERE correo =$1", [correo]);
    if (buscarCorreo.rowCount == 0) {
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
    throw new Error('Correo ya existe')
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
    if (result.rowCount == 0) {
      throw new Error('No se pudo asociar el cliente')
    }
    const result1 = await this.pool.query("INSERT INTO socio_cliente (id_socio, id_cliente) VALUES ($1, $2)", [idSocio, dataCliente.id]);
    return result1.rowCount;
  }

  /**
   * Funcion que permite listar parqueadero
   * @returns
   */
  async listarParking() {
    const query = "SELECT * FROM parqueadero";
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Funcion que permite crear un parqueadero
   * @param dataParking : object Parqueadero
   * @returns
   */
  async crearParking(dataParking: Parqueadero) {
    const query2 = await this.pool.query("SELECT * FROM parqueadero where nombre = $1", [dataParking.nombre]);
    if (query2.rowCount > 0) {
      throw new Error('No se pudo crear el parqueadero, ya esta creado')
    }
    const result = await this.pool.query("INSERT INTO parqueadero (nombre, capacidad) VALUES ($1, $2)", [dataParking.nombre, dataParking.capacidad]);
    return result.rowCount;
  }

  /**
   * Funcion que permite actualizar el parqueadero
   * @param id : number id_parking
   * @param dataParking : object Parqueadero
   * @returns
   */
  async ActualizarParking(id: number, dataParking: Parqueadero) {
    const queryParking = await this.pool.query("SELECT id FROM parqueadero WHERE id = $1", [id]);
    if (queryParking.rowCount == 0) {
      throw new Error('Parqueadero no encontrado, no se puedo actualizar')
    }
    const query = "UPDATE parqueadero SET nombre = $1 WHERE id = $2";
    const result = await this.pool.query(query, [dataParking.nombre, id]);
    return result.rowCount;
  }

  /**
   * Funcion que permite buscar un parqueadero
   * @param id : number id_parking number
   * @returns QueryResult
   */
  async findOneParking(id: number) {
    const query = "SELECT * FROM parqueadero WHERE id = $1";
    const result = await this.pool.query(query, [id]);
    if (result.rowCount == 0) {
      throw new Error('Parqueadero no encontrado')
    }
    return result.rows;
  }

  /**
   * Funcion que permite eliminar un parqueadero
   * @param idParking : number id_parking
   * @returns : QueryResultBase.rowCount
   */
  async eliminarParking(idParking: number) {
    const queryParking = await this.pool.query("SELECT id FROM parqueadero WHERE id = $1", [idParking]);
    if (queryParking.rowCount == 0) {
      throw new Error('Parqueadero no encontrado')
    }
    const result = await this.pool.query("DELETE FROM parqueadero WHERE id=$1", [idParking]);
    return result.rowCount;
  }

  /**
   * puede asociar parqueaderos a socios. Siempre y cuando el parqueadero no este asociado a ning??n otro socio
   * @param idParking : number
   * @param idSocio : number
   * @returns
   */
  async asociarParking(idSocio: number, idParking: Parqueadero) {
    const query = "UPDATE parqueadero SET id_socio = $1 WHERE nombre = $2 AND id_socio is null";
    const result = await this.pool.query(query, [idSocio, idParking.nombre]);
    return result.rows;
  }

  /**
   * Funcion que permite listar vehiculos en el parqueadero
   * @returns : QueryResult
   */
  async listarVehiculos() {
    const query = "SELECT v.id, v.nombre, v.placa, v.fechaingreso, s.nombre as socio, s.correo FROM parqueadero as p join vehiculo as v on p.id = v.id_parqueadero join socios as s on s.id = p.id_socio";
    const result = await this.pool.query(query);
    if (result.rowCount == 0) {
      throw new Error('No hay vehiculos en la lista')
    }
    return result.rows;
  }

  /**
   * Funcion que permite buscar un vehiculo
   * @param placa : string placaVehiculo
   * @returns : QueryResult
   */
  async findOneVehiculos(placa: string) {
    const query = "SELECT v.nombre as carro, v.fechaingreso, s.nombre, s.correo FROM socios as s join parqueadero as p on s.id = p.id join vehiculo as v on p.id = v.id WHERE v.placa=$1";
    const result = await this.pool.query(query, [placa]);
    if (result.rowCount == 0) {
      throw new Error('Vehiculo no encontrado')
    }
    return result.rows;
  }

  /**
   * Funcion que permite buscar un vehiculos por socio
   * @param idSocio : number id_socio
   * @returns : QueryResult
   */
  async findVehiculosSocio(idSocio: number) {
    const query = "SELECT v.id, v.nombre as carro, v.fechaingreso, s.nombre, s.correo FROM socios as s join parqueadero as p on s.id = p.id join vehiculo as v on p.id = v.id WHERE p.id_socio=$1";
    const result = await this.pool.query(query, [idSocio]);
    if (result.rowCount == 0) {
      throw new Error('El socio no tiene vehiculos')
    }
    return result.rows;
  }

  /**
   * Funcion que permite buscar cuantos clientes existen por socio
   * @param id : number id_socio
   * @returns : QueryResult
   */
  async clienExiSocio(id: number) {
    const query = ("select count(id_cliente)as cantidad from socio_cliente as sc join socios as s on sc.id_socio = s.id where s.id = $1 group by sc.id_socio");
    const result = await this.pool.query(query, [id]);
    if (result.rowCount == 0) {
      throw new Error('El socio no tiene ningun cliente asociado')
    }
    return result.rows;
  }

  /**
   * Funcion que permite listado del historial de veh??culos por un parqueadero
   * @param idParking : number
   * @param hist : Object Historial
   * @returns : QueryResult
   */
  async listHistoriVehiculo(idParking: number, hist: Historial) {
    const query = await this.pool.query("SELECT h.placa FROM parqueadero as p JOIN historial as h ON p.id = h.id_parking where h.id_parking = $1  AND h.placa ILIKE '"+hist.placa+"%' AND h.fechaingreso < $2", [idParking, hist.fechasalida]);
    if (query.rowCount == 0) {
      throw new Error('No hay vehiculos')
    }
    return query.rows;
  }
}

