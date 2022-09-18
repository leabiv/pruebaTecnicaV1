import { QueryResult } from 'pg';
import { pool } from '../conexion'
import { Clientes } from '../modules/clientes.models';
import { Socios } from '../modules/socios.models';
import { User } from '../modules/users.models';
import { Vehiculo } from '../modules/vehiculo.models';

export class AdminService {

  private socios: Socios[] = [];
  private clientes: Clientes[] = [];
  private vehiculos: Vehiculo[] = [];
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
      const query = "INSERT INTO socios (usuario, correo, contrasena, rol) VALUES ($1, $2, $3, $4)";
      const result1 = await this.pool.query(query, [data.usuario, data.correo, data.contrasena, data.rol]);
      return result1.rows;
    } else {
      const query = "INSERT INTO clientes (usuario, correo, contrasena, rol) VALUES ($1, $2, $3, $4)";
      const result = await this.pool.query(query, [data.usuario, data.correo, data.contrasena, data.rol]);
      return result.rows;
    }
  }

  //puede revisar listado/detalle de vehículos en el parqueadero
  /**
   *
   * @returns
   */
  async findVehiculos() {
    const query = "SELECT * FROM vehiculo";
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   *
   * @param idV
   * @returns
   */
  async findOneVehiculos(idV: number) {
    const query = "SELECT * FROM vehiculo WHERE id=$1";
    const result = await this.pool.query(query, [idV]);
    return result.rows;
  }

}

