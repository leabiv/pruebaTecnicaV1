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

  async findOneSocio(correo: string, contrasena: string) {
    const query = await this.pool.query("SELECT * FROM socios WHERE correo = $1 AND contrasena = $2", [correo, contrasena]);
    if (query.rowCount == 0) {
      throw new Error('Invalido email / contraseña ')
    }
    return query.rows;
  }

}

