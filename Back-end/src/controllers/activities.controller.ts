import { Request, Response } from "express";
import { getAcivities, createActivity, updateActivity, deleteActivity, findByDifficulty } from "../services/activities.service";

export const GetActivities = async (req: Request, res: Response) => {
  const activities = await getAcivities();
  res.json(activities);
};

export const PostActivities = async (req: Request, res: Response) => {
  const newActivity = req.body;
  const activity = await createActivity(newActivity);
  res.json(newActivity);
};

export const PutActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const activity = await updateActivity(id, updatedData);
  res.json(activity);
};

export const DeleteActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const results = await deleteActivity(id);
  res.json(results);
};

export const FindByDifficulty = async (req: Request, res: Response) => {
  const difficulty = req.query.difficulty as string | undefined;

  // Asegurarse de que difficulty es válido
  const validDifficulties = ["Basico", "Intermedio", "Avanzado"];

  if (!difficulty || !validDifficulties.includes(difficulty)) {
    res.status(400).json({
      error: "Error: debes proporcionar un nivel de dificultad válido ('Basico', 'Intermedio' o 'Avanzado')"
    });
  }

  // Aquí normalizamos el valor (por ejemplo, podrías hacer .toLowerCase() o lo que necesites)
  const normalizedDifficulty = difficulty as "Basico" | "Intermedio" | "Avanzado";

  try {
    // Llamada a la función findByDifficulty pasándole el valor normalizado
    const activities = await findByDifficulty(normalizedDifficulty);
    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las actividades por dificultad" });
  }
};
