import { db } from '../config/firebase';
import { User, NewUser } from '../types/users.types';
import { userSchema, userSchemaPartial } from '../schemas/user.schema';

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const docRef = db.collection('Usuarios');
    const snapshot = await docRef.get();

    if (snapshot.empty) {
      return [];
    }

    const users: User[] = [];
    for (const doc of snapshot.docs) {
      const userData = doc.data();
      users.push({
        id: doc.id,
        nombre: userData.Nombre,
        correo: userData.Correo,
        apodo: userData.Apodo,
        edad: userData.Edad,
        password: userData.Password,
        ejerciciosResueltos: userData.EjerciciosResueltos ?? 0,
        puntuacion: userData.Puntuacion ?? 0,
      } as User);
    }

    return users;
  } catch (error) {
    console.error('Error al obtener los usuarios', error);
    throw new Error('Error al obtener los usuarios');
  }
};

// Obtener usuario por ID
export const getUserByID = async (id: string): Promise<User | null> => {
  try {
    const userRef = db.collection('Usuarios').doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return null;
    }

    const userData = doc.data();

    return {
      id: doc.id,
      nombre: userData?.Nombre,
      correo: userData?.Correo,
      apodo: userData?.Apodo,
      edad: userData?.Edad,
      password: userData?.Password,
      ejerciciosResueltos: userData?.EjerciciosResueltos ?? 0,
      puntuacion: userData?.Puntuacion ?? 0,
    } as User;
  } catch (error) {
    console.error('Error al obtener el usuario por ID', error);
    throw new Error('Error al obtener el usuario por ID');
  }
};

// Crear un nuevo usuario
export const createUser = async (userData: NewUser): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    const validation = userSchema.safeParse(userData);
    if (!validation.success) {
      console.error('Error con los datos del usuario', validation.error);
      return { success: false, error: validation.error.errors };
    }

    const docRef = db.collection('Usuarios');
    const result = await docRef.add(userData);

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error al crear el usuario', error);
    return { success: false, error: 'Error al crear el usuario' };
  }
};

// Actualizar usuario (parcial)
export const updateUser = async (id: string, userData: Partial<User>): Promise<{ success: boolean; error?: any }> => {
  try {
    const validation = userSchemaPartial.safeParse(userData);
    if (!validation.success) {
      console.error('Error con los datos del usuario', validation.error);
      return { success: false, error: validation.error.errors };
    }

    const userRef = db.collection('Usuarios').doc(id);
    await userRef.update(userData);

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar el usuario', error);
    return { success: false, error: 'Error al actualizar el usuario' };
  }
};

// Eliminar usuario
export const deleteUser = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const userRef = db.collection('Usuarios').doc(id);
    await userRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el usuario', error);
    return { success: false, error: 'Error al eliminar el usuario' };
  }
};

/**
 * Incrementa el progreso del usuario: ejercicios resueltos y puntuación.
 * Puede usarse para manejar la lógica de avance de dificultad en el frontend o backend.
 */
export const incrementUserProgress = async (
  id: string,
  incrementEjercicios: number,
  incrementPuntuacion: number
): Promise<{ success: boolean; error?: any }> => {
  try {
    const userRef = db.collection('Usuarios').doc(id);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(userRef);

      if (!doc.exists) {
        throw new Error('Usuario no encontrado');
      }

      const currentEjercicios = doc.data()?.EjerciciosResueltos ?? 0;
      const currentPuntuacion = doc.data()?.Puntuacion ?? 0;

      transaction.update(userRef, {
        EjerciciosResueltos: currentEjercicios + incrementEjercicios,
        Puntuacion: currentPuntuacion + incrementPuntuacion,
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error al incrementar progreso del usuario', error);
    return { success: false, error: 'Error al incrementar progreso del usuario' };
  }
};

