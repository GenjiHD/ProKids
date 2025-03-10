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
}

// Interfaz para una actividad existente (todos los campos son opcionales)
export interface Activity {
  id?: string; // El ID es opcional porque lo genera Firebase
  nombre?: string;
  descripcion?: string;
  nivelDificultad?: DifficultyLevel;
  tipoActividad?: ActivityType;
}
