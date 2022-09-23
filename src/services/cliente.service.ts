import { pool } from '../conexion';
import { User } from '../modules/users.models';
import { Vehiculo } from '../modules/vehiculo.models';

export class ClienteService {

  private vehiculos: Vehiculo[] = [];
  private pool: typeof pool;

  constructor() {
    this.pool = pool
  }

  /**
   *
   * @param idSocio
   * @param dataVehiculo
   * @returns
   */
  async registarEntrada(idSocio: number, dataVehiculo: Vehiculo) {
    const query2 = await this.pool.query("SELECT id FROM socios where id = $1", [idSocio]);
    const query3 = await this.pool.query("SELECT placa FROM vehiculo as v  where v.placa = $1",[dataVehiculo.placa])
    if (query2.rowCount > 0 && query3.rowCount == 0) {
      const query = "INSERT INTO vehiculo (nombre, placa, fechaingreso, id_parqueadero, id_cliente) VALUES ($1, $2, $3, $4, $5)";
      const result1 = await this.pool.query(query, [dataVehiculo.nombre, dataVehiculo.placa, dataVehiculo.fechaingreso, dataVehiculo.id_parking, dataVehiculo.id_cliente]);
      return result1.rows;
    }
    return query2.rowCount;
  }

  /**
   *
   * @param idParking
   * @param idVehiculo
   * @returns
   */
  async registrarSalida(idParking: number, idVehiculo: number) {
    const query1 = await this.pool.query("SELECT id from parqueadero WHERE id = $1", [idParking]);
    const query2 = await this.pool.query("SELECT fechaingreso from vehiculo WHERE id = $1 AND fechaingreso IS NOT NULL", [idVehiculo]);
    if (query1.rowCount > 0 && query2 != null) {
      const query = await this.pool.query("DELETE FROM vehiculo WHERE id=$1", [idVehiculo]);
      return query.rows;
    }
    return query1.rowCount
  }

  /**
   *
   * @returns
   */
  async listadoVehiculo() {
    const query2 = await this.pool.query("SELECT * from vehiculo");
    return query2.rows;
  }

  async listadoUnVehiculo(idSocio: number, idParking: number) {
    const query2 = ("select v.nombre, v.placa, v.fechaingreso, v.id_parqueadero from socios as s inner vehiculo as v where s.id_parking = $1");
    const resul = await this.pool.query(query2, [idSocio, idParking])
    return resul.rows;
  }

}
