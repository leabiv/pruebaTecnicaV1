import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import adminRoutes from './routers/admin.router'
import socioRoutes from './routers/socios.router'
import clientRoutes from './routers/socios.router'
import auth from './routers/auth.router';

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (_req, res) => {
  res.send('Hola mi sevidor');
})

//app.use('/app/', auth);
app.use('/app/admin',adminRoutes);
app.use('/app/socio',socioRoutes);
app.use('/app/client',clientRoutes);

app.listen(port, () => {
    console.log(`Mi port ${port}`)
});
