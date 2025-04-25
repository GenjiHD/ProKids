import express from 'express';
import { getAchievement, createAchievement, updateAchievement, deleteAchievement } from '../services/achievements.services';
import { Achievement, NewAchievement } from '../types/achievements.types';

const router = express.Router();

router.get('/achievements', async (req, res) => {
  try {
    const achievements = await getAchievement();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los logros' });
  }
});

router.post('/achievements', async (req, res) => {
  const achievementData: NewAchievement = req.body;

  const result = await createAchievement(achievementData);

  if (result.success) {
    res.status(200).json({ id: result.id, message: 'Logro creado exitosamente' });
  }
  else {
    res.status(400).json({ error: result.error });
  }
});

router.put('/achievements/:id', async (req, res) => {
  const achievementID = req.params.id;
  const achievementData: Partial<Achievement> = req.body;

  const result = await updateAchievement(achievementID, achievementData);

  if (result.success) {
    res.status(200).json({ message: 'Los datos del logro se actualizaron exitosamente' });
  }
  else {
    res.status(400).json({ error: result.error });
  }
});

router.delete('/achievements/:id', async (req, res) => {
  const achievementID = req.params.id;

  const result = await deleteAchievement(achievementID)

  if (result.success) {
    res.status(200).json({ message: 'El logro fue eliminado exitosamente' });
  }
  else {
    res.status(400).json({ error: result.error });
  }
});

export default router;
