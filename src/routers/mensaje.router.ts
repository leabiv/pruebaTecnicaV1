import { logger } from "../logger/logger";
import { Router } from 'express';
import { Correo } from "../modules/enviocorreo.models";

const router = Router();

router.post('/',(_req, res, _next)=>{
  logger.log("debug","Correo Enviado");
  res.status(200).json({message: "Envio Exitoso"})
})

export default router;
