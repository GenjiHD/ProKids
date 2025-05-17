// Tipo para el nivel de dificultad
// Tipo para el nivel de dificultad
export type DifficultyLevel = 'Básico' | 'Intermedio' | 'Avanzado';

// Tipo para el tipo de actividad
export type ActivityType = 'Escritura' | 'Opción múltiple';

// Interfaz para una nueva actividad
export interface NewActivity {
  nombre: string;
  descripcion: string;
  nivelDificultad: DifficultyLevel;
  tipoActividad: ActivityType;

  // Para ambos tipos
  respuestaEsperada: string;

  // Solo para "Opción múltiple"
  opciones?: string[];
}

export interface Activity {
  id?: string;
  nombre?: string;
  descripcion?: string;
  nivelDificultad?: DifficultyLevel;
  tipoActividad?: ActivityType;

  respuestaEsperada?: string;
  opciones?: string[];

  // Si decides guardar la puntuación directamente
  puntos?: number;
}

