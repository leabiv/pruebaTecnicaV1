import { Router } from 'express'
import { pool } from '../conexion';
import { QueryResult } from 'pg';
import { AdminService } from '../services/admin.service';

const router = Router();
const service = new AdminService()

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

router.get('/vehiculos', async (req, res, next) => {
  try {
    const vehiculos = await service.findVehiculos()
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


export default router;
