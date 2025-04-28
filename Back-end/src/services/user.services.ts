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
        ejerciciosResueltos: userData.EjerciciosResueltos ?? 0, // <- aquí lo agregamos
        puntuacion: userData.Putuacion ?? 0,
      } as User);
    }

    return users;
  } catch (error) {
    console.error('Error al obtener los usuarios', error);
    throw new Error('Error al obtener los usuarios');
  }
};

// Crear un nuevo usuario
export const createUser = async (userData: NewUser): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    // Validar los datos con el esquema
    const validation = userSchema.safeParse(userData);
    if (!validation.success) {
      console.error('Error con los datos del usuario', validation.error);
      return { success: false, error: validation.error.errors };
    }

    // Guardar el usuario en Firestore
    const docRef = db.collection('Usuarios');
    const result = await docRef.add(userData);

    // Devolver el ID del documento creado
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error al crear el usuario', error);
    return { success: false, error: 'Error al crear el usuario' };
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<{ success: boolean; error?: any }> => {
  try {
    // Validar los datos con el esquema parcial
    const validation = userSchemaPartial.safeParse(userData);
    if (!validation.success) {
      console.error('Error con los datos del usuario', validation.error);
      return { success: false, error: validation.error.errors };
    }

    // Actualizar el usuario en Firestore
    const userRef = db.collection('Usuarios').doc(id);
    await userRef.update(userData);

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar el usuario', error);
    return { success: false, error: 'Error al actualizar el usuario' };
  }
};

export const deleteUser = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // Eliminar el usuario de Firestore
    const userRef = db.collection('Usuarios').doc(id);
    await userRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el usuario', error);
    return { success: false, error: 'Error al eliminar el usuario' };
  }
};

export const getusersByID = async (id: string): Promise<User | null> => {
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
