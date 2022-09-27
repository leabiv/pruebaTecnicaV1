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
   *Funcion que permite registrar entrada del vehiculo
   * @param idSocio : number id_socio
   * @param dataVehiculo : Object vehiculo
   * @returns : QueryResult
   */
  async registarEntrada(idSocio: number, dataVehiculo: Vehiculo) {
    const querySocio = await this.pool.query("SELECT id FROM socios where id = $1", [idSocio]);
    const queryVehiculo = await this.pool.query("SELECT placa FROM vehiculo as v  where v.placa = $1", [dataVehiculo.placa]);
    const cantVehiculo = await this.pool.query("SELECT count(id) FROM vehiculo where id_parqueadero = $1", [dataVehiculo.id_parking]);
    const caparking = await this.pool.query("SELECT capacidad FROM parqueadero where id = $1", [dataVehiculo.id_parking]);

    if (querySocio.rowCount == 0) {
      throw new Error("No se puede Registrar Ingreso, Socio no encontrado");
    } else if (queryVehiculo.rowCount > 0) {
      throw new Error("No se puede Registrar Ingreso, ya existe la placa");
    } else if (Number(cantVehiculo.rows[0].count) > caparking.rows[0].capacidad) {
      throw new Error("No se puede Registrar Ingreso, Capacidad Maxima");
    }
    const query = "INSERT INTO vehiculo (nombre, placa, fechaingreso, id_parqueadero, id_cliente) VALUES ($1, $2, $3, $4, $5)";
    const result1 = await this.pool.query(query, [dataVehiculo.nombre, dataVehiculo.placa, dataVehiculo.fechaingreso, dataVehiculo.id_parking, dataVehiculo.id_cliente]);
    return result1.rowCount;
  }

  /**
   * Funcion que permite registrar la salida del vehiculo
   * @param idParking : number id_Parquedero
   * @param dataVehiculo : object Vehiculo enviar placa
   * @returns : QueryResult
   */
  async registrarSalida(idParking: number, dataVehiculo: Vehiculo) {
    const querySocio = await this.pool.query("select s.nombre from parqueadero as p join socios as s on p.id_socio = s.id where p.id = $1", [idParking]);
    const queryVehiculo = await this.pool.query("SELECT placa FROM vehiculo as v  where v.placa = $1", [dataVehiculo.placa]);

    if (querySocio.rowCount == 0) {
      throw new Error("Socio no encontrado");
    } else if (queryVehiculo.rowCount > 0) {
      throw new Error("No se puede Registrar Salida, no existe la placa");
    }
    const guardarSalida = await this.pool.query("INSERT INTO historial (id_parking, placa, fechaingreso) VALUES ($1,$2,$3,$4)",[dataVehiculo.id_parking, dataVehiculo.placa, dataVehiculo.fechaingreso]);
    const salidaVehiculo = await this.pool.query("DELETE FROM vehiculo WHERE placa = $1",[dataVehiculo.placa]);
    return guardarSalida.rows;
    //const query2 = await this.pool.query("SELECT fechaingreso from vehiculo WHERE id = $1 AND fechaingreso IS NOT NULL", [dataVehiculo.id]);
  }

  /**
   * Funcion que permite listar los vehiculos
   * @returns : QueryResult
   */
  async listadoVehiculo() {
    const query2 = await this.pool.query("SELECT * from vehiculo");
    if (query2.rowCount == 0) {
      throw new Error("No hay vehiculos");
    }
    return query2.rows;
  }

  /**
   *  Funcion que permite listar vehiculos por parqueadero
   * @param idParking
   * @returns : QueryResult
   */
  async listadoUnVehiculo(idParking: number) {
    const query2 = ("select v.nombre, v.placa, v.fechaingreso, s.nombre as socio from socios as s join parqueadero as p on s.id = p.id_socio join vehiculo as v on v.id_parqueadero = p.id where p.id = $1");
    const resul = await this.pool.query(query2, [idParking])
    if (resul.rowCount == 0) {
      throw new Error("No hay ningun vehiculo en el parqueadero por socio")
    }
    return resul.rows;
  }

}
