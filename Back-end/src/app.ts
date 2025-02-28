import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.routes";

const app = express();

// Configuracion del servidor
app.use(cors());
app.use(express.json());

// Aqui hiran las rutas cuando las tenga
app.use("/users", userRoutes);

export default app;
