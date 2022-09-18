import express from 'express'
import indexRoutes from './routers/admin.router'

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (_req, res) => {
  res.send('Hola mi sevidor');
})

app.use('/app/admin',indexRoutes);

app.listen(port, () => {
    console.log(`Mi port ${port}`)
});
