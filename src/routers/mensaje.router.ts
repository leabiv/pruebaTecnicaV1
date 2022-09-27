import { logger } from "../logger/logger";
import { Router } from 'express';

const router = Router();

router.post('/',(_req, res, _next)=>{
  logger.log("debug","Correo Enviado");
  res.status(200).json({message: "Envio Exitoso"})
})

export default router;
