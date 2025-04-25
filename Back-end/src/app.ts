import express from 'express';
import cors from 'cors';
import userRoutes from '../src/routes/user.routes';
import activitiesRoutes from '../src/routes/activities.routes';


const app = express();

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Montar las rutas de usuarios bajo /api
app.use('/api', userRoutes);
app.use('/api', activitiesRoutes);

export default app;
