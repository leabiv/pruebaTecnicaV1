import { Router } from 'express'
import { encryptPassword } from '../modules/encrypt.models';
import { AdminService } from '../services/admin.service';
import { TokenValidation, validarRolTokenAdmin } from '../lib/verifyToken';

const router = Router();
const service = new AdminService()

//---------------------Metodos async de Usuarios------------------//
router.get('/users', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const usuarios = await service.findUsers()
    res.status(200).json(usuarios)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.post('/users', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    const hash = await encryptPassword(body.contrasena)
    const newUser = await service.createUser({
      ...body,
      contrasena: hash
    });
    res.status(201).json({ mensaje: 'Usuario registrado con exito' })
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.post('/users/:id', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const newUser = await service.asociarCliente(Number(id), body);
    res.status(201).json({ mensaje: 'Cliente asociado con exito' })
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

//---------------------Metodos async de Parqueaderos------------------//
router.get('/parking', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const parking = await service.listarParking()
    res.json(parking)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.post('/parking', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    const parking = await service.crearParking(body)
    res.status(200).json({ mensaje: 'Parqueadero creado con exito' })
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.put('/parking/:id', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const parking = await service.ActualizarParking(Number(id), body)
    res.status(200).json({ mensaje: 'Actualizacion exitosa' })
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.get('/parking/:id', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const parking = await service.findOneParking(Number(id))
    res.json(parking)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.delete('/parking/:id', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const parking = await service.eliminarParking(Number(id))
    res.status(200).json({ mensaje: 'Eliminacion Exitosa' })
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
})

//---------------------Metodos async de Asociar parqueaderos a Socios------------------//
router.put('/member/:id', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const asocParking = await service.asociarParking(Number(id), body);
    res.status(201).json({ mensaje: 'Parqueadero Asociado exitosamente' })
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

//---------------------Metodos async de Vehiculos------------------//
router.get('/vehicle', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const vehiculos = await service.listarVehiculos()
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.get('/vehicle/:nombre', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { nombre } = req.params;
    const vehiculos = await service.findOneVehiculos(nombre)
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.get('/vehicle/member/:id', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehiculos = await service.findVehiculosSocio(Number(id))
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.get('/socio/:id/user', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehiculos = await service.clienExiSocio(Number(id))
    res.json(vehiculos)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
});

router.get('/history/parking/:id', TokenValidation, validarRolTokenAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const historial = await service.listHistoriVehiculo(Number(id), body)
    res.status(200).json(historial)
  } catch (error: any) {
    next(res.status(400).json({ message: error.message }))
  }
})
//TokenValidation, validarRolTokenAdmin,
export default router;
