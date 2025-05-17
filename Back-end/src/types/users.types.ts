export interface NewUser {
  nombre: string;
  correo: string;
  apodo: string;
  edad: number;
  password: string;
  ejerciciosResueltos: number; // Número total de ejercicios resueltos
  puntuacion: number;          // Puntuación total acumulada
}

export interface User {
  nombre?: string;
  correo?: string;
  apodo?: string;
  edad?: number;
  password?: string;
  ejerciciosResueltos?: number; // Opcional para actualización o lectura
  puntuacion?: number;          // Opcional para actualización o lectura
}

