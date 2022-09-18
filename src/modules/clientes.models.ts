import { User } from "./users.models";
import { Vehiculo } from "./vehiculo.models";

export interface Clientes extends User{
  id: number,
  vehiculo: Vehiculo[];
}
