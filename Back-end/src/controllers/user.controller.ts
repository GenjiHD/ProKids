import { Request, Response } from "express";
import { getUsers, createUser, updateUser, deleteUser, findUserByEmail } from "../services/users.service";

export const GetUsers = async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
};

export const PostUser = async (req: Request, res: Response) => {
  const newUser = req.body;
  const user = await createUser(newUser);
  res.json(newUser);
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
  const email = req.query.email as string | undefined;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Debes proporcionar un correo" });
  }
  const user = await findUserByEmail(email);
  res.json(user);
};
