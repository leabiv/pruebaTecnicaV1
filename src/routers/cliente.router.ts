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
    res.json({mensaje: 'Registro Generado'})
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

//------------------------Revision de Metodos-------------------------//
router.get('/c-vehicle', async (req, res, next) => {
  try {
    const listVehi = service.listadoVehiculo();
    res.json(listVehi)
  } catch (error) {
    next(error)
  }
})

router.get('/c-vehicle/parking/:idP', async (req, res, next) => {
  try {
    const {idP} = req.params
    const listVehiculos = service.listadoUnVehiculo(Number(idP));
    res.json(listVehiculos)
  } catch (error) {
    next(error)
  }
})

export default router;
