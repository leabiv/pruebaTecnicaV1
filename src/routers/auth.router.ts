import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { AuthService } from '../services/auth.service';
import { TokenValidation, validarRolTokenSocio, validarRolTokenCliente } from '../lib/verifyToken';
import { validatePassword } from '../modules/encrypt.models';

const router = Router();
const service = new AuthService();

router.post('/signin', async (req, res) => {
  try {

    const { correo, contrasena } = req.body;
    const findUser = await service.findOneUserCorreo(correo);
    const uth = await validatePassword(contrasena, findUser[0]?.contrasena);

    if(!uth){
      res.status(400).json({message: "contraseña incorrecta"})
    }

    const token: string = jwt.sign({ findUser }, process.env.TOKEN_SECRET || 'tokentest', { expiresIn: '5h' })
    res.header('auth-token', token).json(findUser)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.get('/profile', TokenValidation, validarRolTokenSocio, async (req, res) => {
    try {
      res.status(200).json({message: "estoy en la cuenta"});
    } catch (error: any) {
      res.status(400).send(error.message)
    }

})

export default router;
