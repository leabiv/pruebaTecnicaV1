import { Vehiculo } from "./vehiculo.models"

export interface Parqueadero{
  id: number
  nombre: string,
  vehiculo: Vehiculo[]
}
