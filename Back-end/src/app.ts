import express from 'express';
import cors from 'cors';

const app = express();

// Configuracion del servidor
app.use(cors());
app.use(express.json());

// Aqui hiran las rutas cuando las tenga


export default app;
