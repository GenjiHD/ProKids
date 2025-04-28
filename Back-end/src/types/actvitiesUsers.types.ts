export interface NewActivityUser {
  actividadID: string;
  usuarioID: string;
  tiempo: number;
  respuesta: string;
  fecha: string;
}

export interface ActivityUser {
  id?: string;
  actividadID?: string;
  usuarioID?: string;
  tiempo?: number;
  respuesta?: string;
  fecha?: string;
}
