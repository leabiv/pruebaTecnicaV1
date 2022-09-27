import { Router } from 'express'
import { ClienteService } from '../services/cliente.service';
import { TokenValidation, validarRolTokenCliente } from '../lib/verifyToken';

const router = Router();
const service = new ClienteService()

router.post('/paking/menber/:idS', TokenValidation, validarRolTokenCliente, async (req, res, next) => {
  try {
    const { idS } = req.params;
    const bodyVehiculo = req.body;
    const regEntrada = await service.registarEntrada(Number(idS), bodyVehiculo);
    res.json({message: "id generado del registro"})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
})

router.delete('/paking/:idP/vehicle', TokenValidation, validarRolTokenCliente, async (req, res, next) => {
  try {
    const { idP } = req.params;
    const body = req.body;
    const salidaEntrada = await service.registrarSalida(Number(idP), body);
    res.json({message: "salida registrada"})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
})

router.get('/c-vehicle', TokenValidation, validarRolTokenCliente, async (req, res, next) => {
  try {
    const listVehi = await service.listadoVehiculo();
    res.json(listVehi)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
})

router.get('/c-vehicle/parking/:idP', TokenValidation, validarRolTokenCliente, async (req, res, next) => {
  try {
    const {idP} = req.params
    const listVehiculos = await service.listadoUnVehiculo(Number(idP));
    res.json(listVehiculos)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
})

export default router;
