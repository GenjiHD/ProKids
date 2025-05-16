import { db } from '../config/firebase';
import { NewActivityUser, ActivityUser } from '../types/actvitiesUsers.types';
import { activityUserSchema, activityUserSchemaPartial } from '../schemas/activitiesUsers.schema';
import { setUncaughtExceptionCaptureCallback } from 'node:process';

// Metodo para obtener el progreso de todos los usuarios
export const getActivitiesUsers = async () => {
  try {
    const snapshot = await db.collection('ActividadesUsuarios').get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener el progreso de los usuarios', error);
    return { success: false, error: 'Error al obtener el progreso de los usuarios' };
  }
};

//Metodo para obtener el progreso de un usuario especifico
export const getActivitiesUsersById = async (usuarioID: string) => {
  try {
    const snapshot = await db.collection('ActividadesUsuarios')
      .where('UsuarioId', '==', usuarioID)
      .get();

    if (snapshot.empty) {
      return { success: false, error: 'No se encontro ningun progreso guardado de este usuario' };
    }

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener el progreso del usuario', error);
    return { success: false, error: 'Error la obtener el progreso del usuario' };
  }
}

// Metodo para guardar el progreso de un usuario
export const createActivitiesUsers = async (data: NewActivityUser) => {
  try {
    const validation = activityUserSchema.safeParse({
      UsuarioId: data.usuarioID,
      ActividadId: data.actividadID,
      Tiempo: data.tiempo,
      Feha: data.fecha,
      Respuesta: data.respuesta
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors
      };
    }

    await db.collection('ActividadesUsuarios').add({
      UsuarioId: data.usuarioID,
      ActividadId: data.actividadID,
      Tiempo: data.tiempo,
      Feha: data.fecha,
      Respuesta: data.respuesta
    });

    return { success: true };
  } catch (error) {
    console.error('Error al guardar el progreso', error);
    return { success: false, error: 'Error interno al intentar guardar el progreso' };
  }
}

// Metodo para eliminar el progreso de un usuario
export const deleteActivitiesUsers = async (usuarioID: string) => {
  try {
    const snapshot = await db.collection('ActividadesUsuarios')
      .where('UsuarioId', '==', usuarioID)
      .get();

    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar los datos del usuario', error);
    return { success: false, error: 'Error al eliminar los datos del usuario' };
  }
};
