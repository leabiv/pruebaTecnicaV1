import { Router } from 'express'
import { AdminService } from '../services/admin.service';

const router = Router();
const service = new AdminService()

//---------------------Metodos async de Usuarios------------------//
router.get('/users', async (req, res, next) => {
  try {
    const usuarios = await service.findUsers()
    res.status(200).json(usuarios)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const body = req.body;
    const newUser = await service.createUser(body);
    res.status(201).json({mensaje:'Usuario registrado con exito'})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.post('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const newUser = await service.asociarCliente(Number(id), body);
    res.status(201).json({mensaje: 'Cliente asociado con exito'})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

//---------------------Metodos async de Parqueaderos------------------//parqueaderousuarios
router.get('/parking', async (req, res, next) => {
  try {
    const parking = await service.listarParking()
    res.json(parking)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.post('/parking', async (req, res, next) => {
  try {
    const body = req.body;
    const parking = await service.crearParking(body)
    res.status(200).json({mensaje:'Parqueadero creado con exito'})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.put('/parking/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const parking = await service.ActualizarParking(Number(id), body)
    res.status(200).json({mensaje:'Actualizacion exitosa'})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.get('/parking/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const parking = await service.findOneParking(Number(id))
    res.json(parking)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.delete('/parking/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const parking = await service.eliminarParking(Number(id))
    res.status(200).json({mensaje: 'Eliminacion Exitosa'})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
})

//---------------------Metodos async de Asociar parqueaderos a Socios------------------//
router.put('/users/:id/parking', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const asocParking = await service.asociarParking(Number(id), body);
    res.status(201).json({mensaje: 'Parqueadero Asociado exitosamente'})
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

//---------------------Metodos async de Vehiculos------------------//
router.get('/vehicle', async (req, res, next) => {
  try {
    const vehiculos = await service.listarVehiculos()
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.get('/vehicle/:nombre', async (req, res, next) => {
  try {
    const { nombre } = req.params;
    const vehiculos = await service.findOneVehiculos(nombre)
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.get('/vehicle/:id/socio', async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehiculos = await service.findVehiculosSocio(Number(id))
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

router.get('/socio/:id/user', async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehiculos = await service.clienExiSocio(Number(id))
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({message: error.message}))
  }
});

export default router;
