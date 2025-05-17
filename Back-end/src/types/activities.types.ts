// Tipo para el nivel de dificultad
export type DifficultyLevel = 'Basico' | 'Intermedio' | 'Avanzado';

// Tipo para el tipo de actividad
export type ActivityType = 'Escritura' | 'Opcion multiple';

// Interfaz para una nueva actividad
export interface NewActivity {
  Nombre: string;
  Descripcion: string;
  Dificultad: DifficultyLevel;
  TipoActividad: ActivityType;

  // Para ambos tipos
  RespuestaEsperada: string;

  // Solo para "Opción múltiple"
  Opciones?: string[];
}

export interface Activity extends NewActivity {
  id?: string;
  Puntos?: number;
}

