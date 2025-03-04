import { Request, Response } from "express";
import { userSchema } from "../schemas/user.schemeas";
import { getUsers, createUser, updateUser, deleteUser, findUserByEmail } from "../services/users.service";

export const GetUsers = async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
};

export const PostUser = async (req: Request, res: Response) => {
  const newUser = req.body;
  try {
    const result = await createUser(newUser);
    if ("error" in result) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error en el controlador PostUser:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const PutUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const user = await updateUser(id, updatedData);
  res.json(user);
};

export const DeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const results = await deleteUser(id);
  res.json(results);
};

export const GetUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.query;

  // Validar el correo electrónico usando la expresión regular del esquema
  if (!email || typeof email !== "string" || !userSchema.shape.Correo.safeParse(email).success) {
    return res.status(400).json({
      error: "Debes proporcionar un correo válido como Gmail, Outlook, Hotmail, Yahoo, iCloud, AOL, Zoho o ProtonMail"
    });
  }

  try {
    // Buscar el usuario por correo electrónico
    const user = await findUserByEmail(email);

    // Si no se encuentra el usuario, devolver un error 404
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Devolver el usuario encontrado
    res.json(user);
  } catch (error) {
    // Manejar errores inesperados
    console.error("Error al buscar el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
