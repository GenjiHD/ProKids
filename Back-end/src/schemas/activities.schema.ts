import { z } from 'zod';

// Enums
export const DifficultyLevel = z.enum(['Basico', 'Intermedio', 'Avanzado']);
export const ActivityType = z.enum(['Escritura', 'Opcion multiple']);

// Lógica para calcular puntos por dificultad
const puntosPorDificultad = {
  Basico: 10,
  Intermedio: 20,
  Avanzado: 30,
} as const;

// Esquema base
export const baseActivitySchema = z.object({
  Nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  Descripcion: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede tener más de 500 caracteres"),
  Dificultad: DifficultyLevel,
  TipoActividad: ActivityType,
  RespuestaEsperada: z.string().min(1, "Se requiere una respuesta esperada"),
  Opciones: z.array(z.string()).min(2, "Debe haber al menos dos opciones").optional(),
});

// Versión con lógica adicional (validación condicional)
export const activitySchema = baseActivitySchema
  .refine((data) => {
    if (data.TipoActividad === "Opcion multiple") {
      return data.Opciones && data.Opciones.length >= 2 && data.Opciones.includes(data.RespuestaEsperada);
    }
    return true;
  }, {
    message: "Para opción múltiple, 'RespuestaEsperada' debe estar en 'Opciones'",
    path: ["RespuestaEsperada"],
  })
  .transform((data) => {
    return {
      ...data,
      Puntos: puntosPorDificultad[data.Dificultad], // Asigna puntos según dificultad
    };
  });

// Schema parcial para updates
export const activitySchemaPartial = baseActivitySchema.partial();

