export interface NewActivityUser {
  ActividadID: string;
  UsuarioID: string;
  Tiempo: number;
  Respuesta: string | boolean;
  Fecha: string;
}

export interface ActivityUser {
  id?: string;
  ActividadID?: string;
  UsuarioID?: string;
  Tiempo?: number;
  Respuesta?: string | boolean;
  Fecha?: string;
}

