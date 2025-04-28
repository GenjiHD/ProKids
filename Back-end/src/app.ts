import express from 'express';
import cors from 'cors';
import userRoutes from '../src/routes/user.routes';
import activitiesRoutes from '../src/routes/activities.routes';
import achievementsRoutes from '../src/routes/achievements.routes';


const app = express();

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Montar las rutas de usuarios bajo /api
app.use('/api', userRoutes);
app.use('/api', activitiesRoutes);
app.use('/api', achievementsRoutes);

export default app;
