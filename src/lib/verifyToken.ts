import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayload {
  finSocio: [{
    id: number,
    rol: string,
  }];
  iat: number;
  exp: number;
}

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json('Acceso Denegado');
  }
  const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest') as IPayload;
  console.log(payload.finSocio[0]?.id);
  console.log(payload.finSocio[0]?.rol);

  req.body.userId = payload.finSocio[0]?.id;
  req.body.userRol = payload.finSocio[0]?.rol;
  next();
}

