import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, getUserByID, } from '../services/user.services';
import { NewUser, User } from '../types/users.types';

const router = express.Router();

// GET /users - Obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

router.get('/users/:id', async (req, res) => {
  const userID = req.params.id;

  try {
    const user = await getUserByID(userID);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el usuario: ', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
})

// POST /users - Crear un nuevo usuario
router.post('/users', async (req, res) => {
  const userData: NewUser = req.body;

  // Crear el usuario
  const result = await createUser(userData);

  if (result.success) {
    res.status(201).json({ id: result.id, message: 'Usuario creado correctamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// PUT /users/:id - Actualizar un usuario existente
router.put('/users/:id', async (req, res) => {
  const userId = req.params.id; // Obtener el ID de los parámetros de la ruta
  const userData: Partial<User> = req.body;

  // Actualizar el usuario
  const result = await updateUser(userId, userData);

  if (result.success) {
    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// DELETE /users/:id - Eliminar un usuario
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id; // Obtener el ID de los parámetros de la ruta

  // Eliminar el usuario
  const result = await deleteUser(userId);

  if (result.success) {
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

export default router;
