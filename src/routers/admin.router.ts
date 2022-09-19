import { Router } from 'express'
import { pool } from '../conexion';
import { QueryResult } from 'pg';
import { AdminService } from '../services/admin.service';

const router = Router();
const service = new AdminService()

//---------------------Metodos async de Usuarios------------------//
router.get('/usuarios', async (req, res, next) => {
  try {
    const usuarios = await service.findUsers()
    res.json(usuarios)
  } catch (error) {
    next(error)
  }
});

router.post('/usuarios', async (req, res, next) => {
  try {
    const body = req.body;
    const newUser = await service.createUser(body);
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
});

router.put('/usuarios/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const newUser = await service.asociarCliente(Number(id), body);
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
});

//---------------------Metodos async de Vwhiculos------------------//
router.get('/vehiculos', async (req, res, next) => {
  try {
    const vehiculos = await service.listarVehiculos()
    res.json(vehiculos)
  } catch (error) {
    next(error)
  }
});

router.get('/vehiculos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehiculos = await service.findOneVehiculos(Number(id))
    res.json(vehiculos)
  } catch (error) {
    next(error)
  }
});

//---------------------Metodos async de Parqueaderos------------------//
router.get('/parqueadero', async (req, res, next) => {
  try {
    const parking = await service.listarParking()
    res.json(parking)
  } catch (error) {
    next(error)
  }
});

router.post('/parqueadero', async (req, res, next) => {
  try {
    const body = req.body;
    const parking = await service.crearParking(body)
    res.json(parking)
  } catch (error) {
    next(error)
  }
});

router.put('/parqueadero/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const body = req.body;
    const parking = await service.ActualizarParking(Number(id),body)
    res.json(parking)
  } catch (error) {
    next(error)
  }
});

router.get('/parqueadero/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const parking = await service.findOneParking(Number(id))
    res.json(parking)
  } catch (error) {
    next(error)
  }
});

router.delete('/parqueadero/:id', async (req, res, next) =>{
  try {
    const { id } = req.params;
    const parking = await service.eliminarParking(Number(id))
    res.json(parking)
  } catch (error) {
    next(error)
  }
})


router.put('/usuarios/socio/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const asocParking = await service.asociarParking(Number(id), body);
    res.status(201).json(asocParking)
  } catch (error) {
    next(error)
  }
});

export default router;
