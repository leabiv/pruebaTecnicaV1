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

  //debe poder crear usuarios con ROL CLIENTE
  /**
   *
   * @param dataCliente
   * @returns
   */
  async crearCliente(dataCliente: Clientes) {
    const queryCliente = await this.pool.query("SELECT id FROM clientes where correo=$1", [dataCliente.correo])
    if (queryCliente.rowCount == 0 && dataCliente.rol == "cliente") {
      const query = "INSERT INTO clientes (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4)";
      const result = await this.pool.query(query, [dataCliente.nombre, dataCliente.correo, dataCliente.contrasena, dataCliente.rol]);
      return result.rows;
    }
    return queryCliente.rows;
  }

  //debe poder ASOCIAR los clientes a el mismo
  /**
   *
   * @param idSocio
   * @param dataCliente
   * @returns
   */
  async asociarClienteS(idSocio: number, dataCliente: Clientes) {
    const queryCliente = await this.pool.query("SELECT id FROM clientes where id=$1", [dataCliente.id]);
    if (queryCliente.rowCount > 0) {
      const result1 = await this.pool.query("INSERT INTO socio_cliente (id_socio, id_cliente) VALUES ($1, $2)", [idSocio, dataCliente.id])
      return result1.rows;
    }
    return queryCliente.rows;
  }

  //puede revisar listado/detalle de vehículos en su parqueadero
  async listarParqueadero(idSocio: number) {
    const result1 = await this.pool.query("SELECT v.nombre, p.nombre FROM parqueadero as p join socios as s on p.id_socio = s.id join vehiculo as v on p.id = v.id_parqueadero where s.id = $1", [idSocio]);
    return result1.rows;
  }

  async destalleParqueadero(idSocio: number, idVehiculo: number) {
    const result1 = await this.pool.query("SELECT v.nombre, v.placa, v.fechaingreso FROM parqueadero as p join socios as s on p.id_socio = s.id join vehiculo as v on p.id = v.id_parqueadero where v.id = $1 and s.id=$2",[idVehiculo, idSocio]);
    return result1.rows;
  }

  //puede enviar emails a los clientes
  async enviarEmail() {

  }
}
