import { pool } from '../conexion'
import { Socios } from '../modules/socios.models';
import { Clientes } from '../modules/clientes.models';

export class AuthService{

  private socios: Socios[] = [];
  private clientes: Clientes[] = [];

  private pool: typeof pool;

  constructor() {
    this.socios = [];
    this.clientes = [];
    this.pool = pool
  }

  async findOneSocio(correo: string) {
    const query = await this.pool.query("SELECT * FROM socios WHERE correo = $1", [correo]);
    if (query.rowCount == 0) {
      throw new Error('Invalido email')
    }
    return query.rows;
  }

  async findOneSocio1(id: number) {
    const query = await this.pool.query("SELECT * FROM socios WHERE id = $1", [id]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id socio')
    }
    return query.rows;
  }

}

