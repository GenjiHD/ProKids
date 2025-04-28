import { db } from '../config/firebase';
import { Achievement, NewAchievement } from '../types/achievements.types';
import { achievementSchema, achievementSchemaPartial } from '../schemas/achievement.schema';

export const getAchievement = async (): Promise<Achievement[]> => {
  try {
    const achievementsRef = db.collection("Logros");

    const snapshot = await achievementsRef.get();

    if (snapshot.empty) {
      return [];
    }

    const achievements: Achievement[] = [];

    snapshot.forEach((doc) => {
      const achievementData = doc.data();
      achievements.push({
        id: doc.id,
        nombre: achievementData.Nombre,
        descripcion: achievementData.Descripcion,
        requisito: achievementData.Requisito,
        usuariosLogro: achievementData.UsuariosConLogro ?? [] // CORREGIDO
      } as Achievement);
    });

    return achievements;
  } catch (error) {
    console.error('Error al obtener los logros: ', error);
    throw new Error('Error al obtener los logros');
  }
}

export const createAchievement = async (achievementData: NewAchievement): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    const validation = achievementSchema.safeParse(achievementData);

    if (!validation.success) {
      return { success: false, error: validation.error.errors };
    }

    const achievementRef = db.collection("Logros");
    const result = await achievementRef.add(achievementData);

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error al crear el logro: ', error);
    return { success: false, error: 'Error al crear el logro' };
  }
}

export const updateAchievement = async (id: string, achievementData: Partial<Achievement>): Promise<{ success: boolean; error?: any }> => {
  try {
    const validation = achievementSchemaPartial.safeParse(achievementData); // CORREGIDO

    if (!validation.success) {
      return { success: false, error: validation.error.errors };
    }

    const achievementRef = db.collection("Logros").doc(id);
    await achievementRef.update(achievementData);

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar el logro:', error);
    return { success: false, error: 'Error al actualizar el logro' };
  }
}

export const deleteAchievement = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const achievementRef = db.collection("Logros").doc(id);

    const doc = await achievementRef.get();

    if (!doc.exists) {
      return { success: false, error: "Logro no encontrado" };
    }

    await achievementRef.delete();
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el logro:', error);
    return { success: false, error: 'Error al eliminar el logro' };
  }
}

