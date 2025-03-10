import express from 'express';
import { getActivity, createActivity, updateActivity, deleteActivity, getActivityByID } from '../services/activities.services';
import { Activity, NewActivity } from '../types/activities.types';

const router = express.Router();

router.get('/activities', async (req, res) => {
  try {
    const activities = await getActivity();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
});

router.get('/activities/:id', async (req, res) => {
  const activityID = req.params.id;

  try {
    const activities = await getActivityByID(activityID);

    if (!activities) {
      res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error al obtener la actividad');
    res.status(500).json({ error: 'Error al obtener la actividad' });
  }
});

router.post('/activities', async (req, res) => {
  const activityData: NewActivity = req.body;

  const result = await createActivity(activityData);

  if (result.success) {
    res.status(201).json({ id: result.id, message: 'Actividad creada correctamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

router.put('/activities/:id', async (req, res) => {
  const activityID = req.params.id;
  const activityData: Partial<Activity> = req.body;

  const result = await updateActivity(activityID, activityData);

  if (result.success) {
    res.status(201).json({ message: 'Actividad actualizada correctamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

router.delete('/activities/:id', async (req, res) => {
  const activityID = req.params.id;

  const result = await deleteActivity(activityID);

  if (result.success) {
    res.status(201).json({ message: 'Actividad eliminada correctamente' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

export default router;
