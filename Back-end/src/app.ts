import express from 'express';
import cors from 'cors';
import userRoutes from '../src/routes/user.routes';

const app = express();

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Montar las rutas de usuarios bajo /api
app.use('/api', userRoutes);

export default app;
