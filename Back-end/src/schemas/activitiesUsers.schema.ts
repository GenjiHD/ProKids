import { z } from "zod";

// Expresión regular para formato: dd-mm-aa
const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{2}$/;

export const activityUserSchema = z.object({
  UsuarioID: z.string()
    .min(1, "El ID del usuario es requerido"),

  ActividadID: z.string()
    .min(1, "El ID de la actividad es requerido"),

  Tiempo: z.number()
    .int("El tiempo debe ser un número entero")
    .nonnegative("El tiempo no puede ser negativo"),

  Fecha: z.string()
    .regex(fechaRegex, "La fecha debe tener el formato dd-mm-aa"),

  Respuesta: z.union([
    z.string().min(1, "La respuesta no puede estar vacía"),
    z.boolean()
  ]),
});

export const activityUserSchemaPartial = activityUserSchema.partial();

