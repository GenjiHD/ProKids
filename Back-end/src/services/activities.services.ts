import { db } from '../config/firebase';
import { Activity, NewActivity } from '../types/activities.types';
import { activitySchema, activitySchemaPartial } from '../schemas/activities.schema';

export const getActivity = async (): Promise<Activity[]> => {
  try {
    const activitiesRef = db.collection('Actividades');
    const snapshot = await activitiesRef.get();

    if (snapshot.empty) return [];

    const activities: Activity[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        Nombre: data.Nombre,
        Descripcion: data.Descripcion,
        Dificultad: data.Dificultad,
        TipoActividad: data.TipoActividad,
        RespuestaEsperada: data.RespuestaEsperada,
        Opciones: data.Opciones,
        Puntos: data.Puntos, // incluir puntos si está guardado
      } as Activity);
    });

    return activities;
  } catch (error) {
    console.error('Error al obtener las actividades: ', error);
    throw new Error('Error al obtener las actividades');
  }
};

export const getActivityByID = async (id: string): Promise<Activity | null> => {
  try {
    const doc = await db.collection('Actividades').doc(id).get();

    if (!doc.exists) return null;

    const data = doc.data();

    return {
      id: doc.id,
      Nombre: data?.Nombre,
      Descripcion: data?.Descripcion,
      Dificultad: data?.Dificultad,
      TipoActividad: data?.TipoActividad,
      RespuestaEsperada: data?.RespuestaEsperada,
      Opciones: data?.Opciones,
      Puntos: data?.Puntos,
    } as Activity;
  } catch (error) {
    console.error('Error al obtener el ID de la actividad', error);
    throw new Error('Error al obtener la actividad por ID');
  }
};

export const createActivity = async (activityData: NewActivity) => {
  try {
    const validation = activitySchema.safeParse(activityData);

    if (!validation.success) {
      return { success: false, error: validation.error.errors };
    }

    // validation.data contiene la data transformada (con puntos)
    const activitiesRef = db.collection('Actividades');
    const result = await activitiesRef.add(validation.data);

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error al crear la actividad: ', error);
    return { success: false, error: 'Error al crear la actividad' };
  }
};

export const updateActivity = async (id: string, activityData: Partial<Activity>) => {
  try {
    const validation = activitySchemaPartial.safeParse(activityData);

    if (!validation.success) {
      return { success: false, error: validation.error.errors };
    }

    const activityRef = db.collection('Actividades').doc(id);
    await activityRef.update(validation.data);

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar la actividad:', error);
    return { success: false, error: 'Error al actualizar la actividad' };
  }
};

export const deleteActivity = async (id: string) => {
  try {
    const activityRef = db.collection('Actividades').doc(id);

    const doc = await activityRef.get();
    if (!doc.exists) {
      return { success: false, error: 'Actividad no encontrada' };
    }

    await activityRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la actividad:', error);
    return { success: false, error: 'Error al eliminar la actividad' };
  }
};

