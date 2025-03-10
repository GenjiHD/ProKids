import { db } from '../config/firebase';
import { Activity, NewActivity } from '../types/activities.types';
import { activitySchema, activitySchemaPartial } from '../schemas/ativities.schema';

export const getActivity = async (): Promise<Activity[]> => {
  try {
    // Obtener la referencia a la colección de actividades
    const activitiesRef = db.collection('Actividades');

    // Obtener todos los documentos de la colección
    const snapshot = await activitiesRef.get();

    // Si no hay documentos, retornar un array vacío
    if (snapshot.empty) {
      return [];
    }

    // Mapear los documentos a un array de actividades
    const activities: Activity[] = [];
    snapshot.forEach((doc) => {
      const activityData = doc.data();
      activities.push({
        id: doc.id,
        Nombre: activityData.Nombre,
        Descripcion: activityData.Descripcion,
        Dificultad: activityData.Dificultad,
        TipoActividad: activityData.TipoActividad,
      } as Activity);
    });

    return activities;
  } catch (error) {
    console.error('Error al obtener las actividades: ', error);
    throw new Error('Error al obtener las actividades');
  }
}

export const getActivityByID = async (id: string): Promise<Activity | null> => {
  try {
    const activityRef = db.collection('Actividades').doc(id);

    const doc = await activityRef.get();

    if (!doc.exists) {
      return null;
    }

    const activityData = doc.data();

    return {
      id: doc.id,
      nombre: activityData?.Nombre,
      descripcion: activityData?.Descripcion,
      dificultad: activityData?.Dificultad,
      tipoActividad: activityData?.TipoActividad,
    } as Activity;
  } catch (error) {
    console.error('Error al obtener el ID de la actividad', error);
    throw new Error('Error al obtener la actividad por ID');
  }
}

export const createActivity = async (activityData: NewActivity) => {
  try {
    const validation = activitySchema.safeParse(activityData);

    if (!validation.success) {
      return { success: false, error: validation.error.errors };
    }

    const activitiesRef = db.collection('Actividades');
    const result = await activitiesRef.add(activityData);

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error al crear la actividad: ', error);
    return { success: false, error: 'Error al crear la actividad' };
  }
}

export const updateActivity = async (id: string, activityData: Partial<Activity>) => {
  try {
    const validation = activitySchemaPartial.safeParse(activityData);

    if (!validation.success) {
      return { success: false, error: validation.error.errors };
    }

    const activityRef = db.collection('Actividades').doc(id);
    await activityRef.update(activityData);

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar la actividad:', error);
    return { success: false, error: 'Error al actualizar la actividad' };
  }
};

export const deleteActivity = async (id: string) => {
  try {
    const activityRef = db.collection('Actividades').doc(id);

    // Verificar si la actividad existe antes de intentar eliminarla
    const doc = await activityRef.get();
    if (!doc.exists) {
      return { success: false, error: 'Actividad no encontrada' };
    }

    // Eliminar la actividad
    await activityRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la actividad:', error);
    return { success: false, error: 'Error al eliminar la actividad' };
  }
};

