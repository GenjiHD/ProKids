export interface NewUser {
  nombre: string;
  correo: string;
  apodo: string;
  edad: number;
  password: string;
  ejerciciosResueltos: number; // Nuevo campo
  puntuacion: number; // Nuevo campo

}

export interface User {
  nombre?: string;
  correo?: string;
  apodo?: string;
  edad?: number;
  password?: string,
  ejerciciosResueltos?: number; // Nuevo campo
  puntuacion?: number; // Nuevo campo

}
