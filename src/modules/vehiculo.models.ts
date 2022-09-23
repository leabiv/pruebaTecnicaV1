import { Parqueadero } from "./parqueadero.models"

export interface Vehiculo{
  id: number,
  nombre: string,
  placa: string,
  fechaingreso: Date,
  id_parking: number,
  id_cliente: number
}
