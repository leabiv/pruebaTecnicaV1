import { pool } from '../conexion'
import { Socios } from '../modules/socios.models';
import { Clientes } from '../modules/clientes.models';

export class AuthService {

  private socios: Socios[] = [];
  private clientes: Clientes[] = [];

  private pool: typeof pool;

  constructor() {
    this.socios = [];
    this.clientes = [];
    this.pool = pool
  }

  async findOneUserCorreo(correo: string) {
    const query = await this.pool.query("select * from (select * from socios union select * from clientes union select * from administradores) sociocliente where correo = $1", [correo]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id corrreo')
    }
    return query.rows;
  }

  async findOneSocio(id: number, rol: string) {
    const query = await this.pool.query("SELECT * FROM socios WHERE id = $1 AND rol = $2", [id, rol]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id socio')
    }
    return query.rows;
  }

  async findOneSocioCorreo(correo: string) {
    const query = await this.pool.query("SELECT * FROM socios WHERE correo = $1", [correo]);
    if (query.rowCount == 0) {
      throw new Error('Invalido email Socio')
    }
    return query.rows;
  }

  async findOneClienteCorreo(correo: string) {
    const query = await this.pool.query("SELECT * FROM clientes WHERE correo = $1", [correo]);
    if (query.rowCount == 0) {
      throw new Error('Invalido email Cliente')
    }
    return query.rows;
  }

  async findOneCliente(id: number, rol: string) {
    const query = await this.pool.query("SELECT * FROM clientes WHERE id = $1 AND rol = $2", [id, rol]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id cliente')
    }
    return query.rows;
  }

  async findOneAdmin(id: number, rol: string) {
    const query = await this.pool.query("SELECT * FROM administradores WHERE id = $1 AND rol = $2", [id, rol]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id admin')
    }
    return query.rows;
  }

}

