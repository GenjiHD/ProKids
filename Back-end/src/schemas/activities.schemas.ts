import { z } from "zod";

// Expresión regular para validar nombres y descripciones (solo letras, espacios y algunos caracteres básicos)
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.,;:!?()\-]+$/;

export const activitySchema = z.object({
  Nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(nameRegex, "El nombre solo puede contener letras, espacios y caracteres básicos como .,;:!?()"),

  Descripcion: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .regex(nameRegex, "La descripción solo puede contener letras, espacios y caracteres básicos como .,;:!?()"),

  Dificultad: z.enum(["Basico", "Intermedio", "Avanzado"], {
    errorMap: () => ({ message: "La dificultad debe ser 'Básico', 'Intermedio' o 'Avanzado'" })
  }),

  TipoActividad: z.enum(["Escritura", "Lectura", "Práctica", "Examen"], {
    errorMap: () => ({ message: "El tipo de actividad debe ser 'Escritura', 'Lectura', 'Práctica' o 'Examen'" })
  })
});

export const activitySchemaPartial = activitySchema.partial();
