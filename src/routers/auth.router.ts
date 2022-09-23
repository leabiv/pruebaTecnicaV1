import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { SocioService } from '../services/socio.service';
import bcrypt from 'bcryptjs';
import { encryptPassword } from '../modules/encrypt.models'
import { TokenValidation } from '../lib/verifyToken';

const router = Router();
const service = new SocioService();

router.post('/signup', async (req, res) => {
  /*const { id } = req.body;
  const finSocio = await service.findOneSocio(Number(id))
  const token: string = jwt.sign({ id: id }, process.env.TOKEN_SECRET || 'tokentest')
  res.header('auth-token', token).json(finSocio)
  */
})

router.post('/signin', async (req, res) => {
  try {
    const { id, correo } = req.body;
    const finSocio = await service.findOneSocio(correo);
    const token: string = jwt.sign({ _id: id }, process.env.TOKEN_SECRET || 'tokentest', { expiresIn: 300 })
    res.header('auth-token', token).json(finSocio)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.get('/profile', TokenValidation, (req, res) => {
  res.send('estoy en la cuenta')
})

export default router;
