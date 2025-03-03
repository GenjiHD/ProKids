import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.routes";
import activitiesRoutes from "./routes/activities.routes";

const app = express();

// Configuracion del servidor
app.use(cors());
app.use(express.json());

// Aqui hiran las rutas cuando las tenga
app.use("/users", userRoutes);
app.use("/activities", activitiesRoutes);

export default app;
