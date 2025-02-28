import { db } from "../config/firebase";
import { NewUser, User } from "../types/users.types";
import { userSchema } from "../schemas/user.schemeas";

export const getUsers = async () => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return usuarios;
  } catch (err) {
    console.error("Error al obtener los usuarios", err);
    return { error: "No se pudieron obtener los usuarios" };
  }
};

export const createUser = async (newUser: NewUser) => {
  try {
    const validation = userSchema.safeParse(newUser);
    if (!validation.success) {
      return { error: validation.error };
    }
    const docRef = await db.collection("usuarios").add(newUser);
    return { id: docRef.id, ...newUser };
  } catch (err) {
    console.error("Error al crear el usuario", err);
    return { error: "No se pudo crear el nuevo usuario" };
  }
};

export const updateUser = async (id: string, updatedData: Partial<User>) => {
  try {
    const validation = userSchema.partial().safeParse(updatedData);
    if (!validation.success) {
      return { error: validation.error };
    }
    await db.collection("usuarios").doc(id).update(updatedData);
    return { id, ...updatedData };
  } catch (err) {
    console.error("Error al actualizar los datos", err);
    return { error: "No se puedieron actualizar los datos " };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await db.collection("usuarios").doc(id).delete();
    return { success: `Usuario con ID ${id} eliminado correctamente` };
  } catch (err) {
    console.error("Error al eliminar el usuario", err);
    return { error: "No se puedo eliminar el usuario" };
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const snapshot = await db.collection("usuarios").where("correo", "==", email).limit(1).get();

    if (snapshot.empty) {
      throw new Error("No se encontró ningún usuario con este correo");
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (err) {
    console.error("Error al buscar el correo del usuario:", err);
    throw new Error("No se pudo encontrar este usuario");
  }
};

