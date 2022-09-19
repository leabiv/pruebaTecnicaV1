import { pool } from '../conexion'
import { Clientes } from '../modules/clientes.models';
import { Parqueadero } from '../modules/parqueadero.models';
import { Socios } from '../modules/socios.models';
import { User } from '../modules/users.models';
import { Vehiculo } from '../modules/vehiculo.models';

export class SocioService {

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

  //debe poder crear usuarios con ROL CLIENTE
  async crearCliente(dataCliente: Clientes) {
    const queryCliente = await this.pool.query("SELECT id FROM clientes ", [dataCliente.id])
    if (queryCliente.rowCount == 0 && dataCliente.rol == "cliente") {
      const query = "INSERT INTO clientes (usuario, correo, contrasena, rol) VALUES ($1, $2, $3, $4)";
      const result = await this.pool.query(query, [dataCliente.usuario, dataCliente.correo, dataCliente.contrasena, dataCliente.rol]);
      return result.rows;
    }
    return queryCliente.rows;
  }

  //debe poder ASOCIAR los clientes a el mismo
  async asociarClienteS(idSocio: number, dataCliente: Clientes) {
    const queryCliente = await this.pool.query("SELECT id FROM clientes ", [dataCliente.id]);
    if (queryCliente.rowCount > 0) {
      const result1 = await this.pool.query("UPDATE socios SET id_ciente = $1 WHERE id = $2", [dataCliente.id, idSocio])
      return result1.rows;
    }
    return queryCliente.rows;
  }

  //puede revisar listado/detalle de vehículos en su parqueadero
  async listarParqueadero() {
    const result1 = await this.pool.query("SELECT v.nombre FROM socios as s inner join parqueadero as p on s.id_parking = p.id inner join vehiculo as v on p.id_vehiculo = v.id where s.id = $1");
    return result1.rows;
  }

  async destalleParqueadero(idSocio: number, idVehiculo: number) {
    const result1 = await this.pool.query("SELECT v.nombre, v.placa, v.fechaingreso FROM socios as s inner join parqueadero as p on s.id_parking = p.id inner join vehiculo as v on p.id_vehiculo = v.id where v.id = $1 and s.id=$2");
    return result1.rows;
  }

  async enviarEmail(){

  }
}
