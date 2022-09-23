import { Router } from 'express'
import { pool } from '../conexion';
import { QueryResult } from 'pg';
import { SocioService } from '../services/socio.service';

const router = Router();
const service = new SocioService()

router.post('/client', async (req, res) => {
  try {
    const body = req.body;
    const newCliente = await service.crearCliente(body);
    res.json(newCliente)
  } catch (error) {

  }
})

router.post('/:id/client', async (req, res, next) => {
  try {
    const { id } = req.params;
    const bodyC = req.body
    const asociCliente = await service.asociarClienteS(Number(id), bodyC);
    res.json(asociCliente);
  } catch (error) {
    next(error)
  }
})

router.get('/:id/vehicles', async (req, res, next) => {
  try {
    const { id } = req.params;
    const listparking = await service.listarParqueadero(Number(id));
    res.json(listparking)
  } catch (error) {
    next(error)
  }
})

router.get('/:id/vehicles/:idV', async (req, res, next) => {
  try {
    const { id, idV } = req.params;
    const listparking = await service.destalleParqueadero(Number(id), Number(idV));
    res.json(listparking)
  } catch (error) {
    next(error)
  }
})

router.get('/parking/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const listparking = await service.listRegis(Number(id));
    res.json(listparking)
  } catch (error) {
    next(error)
  }
})

router.get('/t-parking/old', async (req, res, next) => {
  try {
    console.log('-------Algo')
    const listparking = await service.verificarVehiculosPar();

    res.json(listparking)
  } catch (error) {
    next(error)
  }
})

router.get('/t-parking/new', async (req, res, next) => {
  try {
    const listparking = await service.verifiVehiParNuevo();
    res.json(listparking)
  } catch (error) {
    next(error)
  }
})

router.get('/t-parking/usandoPa/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await service.listadoVehiculoCliente(Number(id));
    res.json(list)
  } catch (error) {
    next(error)
  }
})

router.get('/t-parking/usandoPa/:idC/vehicle/:placa', async (req, res, next) => {
  try {
    const { idC, placa } = req.params;
    const list = await service.listadoVehiculoDetalle(Number(idC), placa);
    res.json(list)
  } catch (error) {
    next(error)
  }
})

export default router;
