import { db } from "../config/firebase";
import { NewUser, User } from "../types/users.types";

export class UserService {

  static async newUser(usuario: NewUser) {

    try {
      const docRef = await db.collection("Usuarios").add(usuario);
      return { id: docRef.id, ...usuario };
    } catch (err) {
      console.error('Error al crear el nuevo usuario: ', err);
      return { error: "No se pudo agregar el nuevo usuario" };
    }
  }

  static async getUsers() {
    try {
      const snapshot = await db.collection("Usuarios").get();
      const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return usuarios;
    } catch (err) {
      console.error('Error al obtener los usuarios: ', err);
      return { error: "No se pudieron obtener los usuarios" };
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const modificaciones = req.body;
      const usuario = await.UserService.updateUser(id, modificaciones);
      res.json(usuario);
    } catch (err) {
      console.error('Error al actualizar los datos: ', err);
      return { error: "No se pudieron actualizar los datos" };
    }
  }
}

