import { snapshot } from "node:test";
import { db } from "../config/firebase";
import { NewActivity, Activity } from "../types/activities.types";
import { activitySchema } from "../schemas/activities.schemas";

export const getAcivities = async () => {
  try {
    const snapshot = await db.collection("Actividades").get();
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return activities;
  } catch (err) {
    console.error("Error al obtener las actividades", err);
    return { error: "No se puedieron obtener las actividades" };
  }
}

export const createActivity = async (newActivity: NewActivity) => {
  try {
    const validation = activitySchema.safeParse(newActivity);
    if (!validation.success) {
      return { error: validation.error };
    }
    const docRef = await db.collection("Actividades").add(newActivity);
    return { id: docRef.id, ...newActivity };
  } catch (err) {
    console.error("Error al crear la actividad", err);
    return { error: "No se pudo crear la actividad" };
  }
}

export const updateActivity = async (id: string, updatedData: Partial<Activity>) => {
  try {
    const activityRef = db.collection("actividades").doc(id);

    const doc = await activityRef.get();
    if (!doc.exists) {
      console.error("La actividad que intentas modificar no existe");
    }
    await activityRef.update(updatedData);
    return { id, ...updatedData };
  } catch (err) {
    console.error("Error al actualizar los datos de la actividad", err);
    return { error: "No se pudo moificar la actividad" };
  }
}

export const deleteActivity = async (id: string) => {
  try {
    const activityRef = db.collection("Actividades").doc(id);

    const doc = await activityRef.get();
    if (!doc.exists) {
      console.error("La actividad no existe");
    }
    await activityRef.delete();
    console.log("Actividad eliminada perfectamente");
  } catch (err) {
    console.error("Error al eliminar la actividad", err);
    return { error: "No se pudo eliminar la actividad" };
  }
}

export const findByDifficulty = async (difficulty: "Basico" | "Intermedio" | "Avanzado") => {
  try {
    const snapshot = await db.collection("Actividades")
      .where("Dificultad", "==", difficulty)
      .get();

    if (snapshot.empty) {
      console.log(`No se encontraron ejercicios con dificultad "${difficulty}"`);
      return [];
    }
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`Ejercicios con dificultad "${difficulty}":`, activities);
    return activities;
  } catch (err) {
    console.error("Error buscando ejercicios por dificultad:", err);
    return [];
  }
}

