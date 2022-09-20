import { Router } from 'express'
import { pool } from '../conexion';
import { QueryResult } from 'pg';
import { ClienteService } from '../services/cliente.service';

const router = Router();
const service = new ClienteService()

router.post('/paking/:idS/', async (req, res, next) => {
  try {
    const { idS } = req.params;
    const bodyVehiculo = req.body;
    const regEntrada = service.registarEntrada(Number(idS), bodyVehiculo);
    res.json(regEntrada)
  } catch (error) {
    next(error)
  }
})

router.delete('/paking/:idP/vehicle/:idV', async (req, res, next) => {
  try {
    const { idP, idV } = req.params;
    const bodyVehiculo = req.body;
    const salidaEntrada = service.registrarSalida(Number(idP), Number(idV));
    res.json(salidaEntrada)
  } catch (error) {
    next(error)
  }
})

router.get('/vehicle', async (req, res, next) => {
  try {
    const listVehiculos = service.listadoVehiculo();
    res.json(listVehiculos)
  } catch (error) {
    next(error)
  }
})

router.get('/vehicle/:idS/parking/:idP', async (req, res, next) => {
  try {
    const {idS, idP} = req.params
    const listVehiculos = service.listadoUnVehiculo(Number(idS),Number(idP));
    res.json(listVehiculos)
  } catch (error) {
    next(error)
  }
})
