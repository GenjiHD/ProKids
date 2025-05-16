export interface NewActivityUser {
  actividadID: string;
  usuarioID: string;
  tiempo: number;             // Tiempo en segundos
  respuesta: string | boolean; // Puede ser texto o true/false
  fecha: string;              // Formato: dd-mm-aa
}

export interface ActivityUser {
  id?: string;
  actividadID?: string;
  usuarioID?: string;
  tiempo?: number;
  respuesta?: string | boolean;
  fecha?: string;
}
