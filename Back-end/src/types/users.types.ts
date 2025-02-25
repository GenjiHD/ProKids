export interface NewUser {
  nombre: string;
  correo: string;
  apodo: string;
  edad: number;
}

export interface User {
  nombre?: string;
  correo?: string;
  apodo?: string;
  edad?: number;
}
