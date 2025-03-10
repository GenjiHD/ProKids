import { z } from 'zod';

// Definir los valores permitidos para el nivel de dificultad
const DifficultyLevel = z.enum(['Basico', 'Intermedio', 'Avanzado']);

// Definir los valores permitidos para el tipo de actividad
const ActivityType = z.enum(['Escritura', 'Opcion multiple']);

// Esquema para una actividad
export const activitySchema = z.object({
  Nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  Descripcion: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede tener más de 500 caracteres"),
  Dificultad: DifficultyLevel, // Usa el enum de niveles de dificultad
  TipoActividad: ActivityType, // Usa el enum de tipos de actividad
});

// Esquema parcial para actualizar una actividad (todos los campos son opcionales)
export const activitySchemaPartial = activitySchema.partial();
