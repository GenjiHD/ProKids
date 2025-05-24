import express from "express";
import { getActivitiesUsers, getActivitiesUsersById, createActivitiesUsers, deleteActivitiesUsers } from "../services/activitiesUsers.services";

const router = express.Router();

// GET: para obtener todos los avances de todos los usuarios
router.get('/progreso', async (req, res) => {
  const result = await getActivitiesUsers();

  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// GET: obtener el progreso de un usuario especifico
router.get('/progreso-usuario/:usuarioID', async (req, res) => {
  console.log("Progreso viendo");
  const { usuarioID } = req.params;
  const result = await getActivitiesUsersById(usuarioID);

  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// POST: guardar el progreso (lo principal vaya)
router.post('/progreso', async (req, res) => {
  const data = req.body;
  const result = await createActivitiesUsers(data);

  if (result.success) {
    res.status(201).json({ message: 'Progreso guardado exitosamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// DELETE: para borrar el progreso cuando un usuario elimine su cuenta
router.delete('/progreso/:usuarioID', async (req, res) => {
  const { usuarioID } = req.params;
  const result = await deleteActivitiesUsers(usuarioID);

  if (result.success) {
    res.status(200).json({ message: 'Progerso eliminado correctamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

export default router;
