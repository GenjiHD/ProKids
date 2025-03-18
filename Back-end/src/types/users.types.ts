export interface NewUser {
  nombre: string;
  correo: string;
  apodo: string;
  edad: number;
  password: string;
}

export interface User {
  nombre?: string;
  correo?: string;
  apodo?: string;
  edad?: number;
  password?: string;
}
