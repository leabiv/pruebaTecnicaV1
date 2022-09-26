import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { AuthService } from '../services/auth.service';
import bcrypt from 'bcryptjs';
import { encryptPassword } from '../modules/encrypt.models'
import { TokenValidation } from '../lib/verifyToken';

const router = Router();
const service = new AuthService();

router.post('/signin', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const finSocio = await service.findOneSocio(correo,contrasena);
    const token: string = jwt.sign({ finSocio }, process.env.TOKEN_SECRET || 'tokentest', { expiresIn: 300 })
    res.header('auth-token', token).json(finSocio)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.get('/profile', TokenValidation, async (req, res) => {
  //const user = await service.findOneSocio(req.userId)
  res.send('estoy en la cuenta')
})

export default router;
