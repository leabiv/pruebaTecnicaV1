import { Clientes } from "./clientes.models";
import { User } from "./users.models";

export interface Socios extends User{
  id: number,
  cliente: Clientes[];
}
