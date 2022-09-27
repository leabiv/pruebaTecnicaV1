import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { AuthService } from '../services/auth.service';
import { TokenValidation } from '../lib/verifyToken';
import { validatePassword } from '../modules/encrypt.models';

const router = Router();
const service = new AuthService();

router.post('/signin', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const finSocio = await service.findOneSocio(correo);
    const uth = await validatePassword(contrasena, finSocio[0]?.contrasena);

    if(!uth){
      res.status(400).json({message: "contraseña incorrecta"})
    }

    const token: string = jwt.sign({ finSocio }, process.env.TOKEN_SECRET || 'tokentest', { expiresIn: '5h' })
    res.header('auth-token', token).json(finSocio)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.get('/profile', TokenValidation, async (req, res) => {
    try {
      const finSocio = await service.findOneSocio1(req.body.userId);
      res.status(200).json({message: "estoy en la cuenta"});
    } catch (error: any) {
      res.status(400).send(error.message)
    }

})

export default router;
