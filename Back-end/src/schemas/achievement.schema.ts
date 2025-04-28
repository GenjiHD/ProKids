import { z } from 'zod';

export const achievementSchema = z.object({
  Nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),

  Descripcion: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede tener más de 500 caracteres"),

  Requisito: z.number()
    .int("El requisito debe ser un número entero")
    .min(1, "El requisito debe ser al menos 1"),

  UsuariosConLogro: z.array(z.string()).optional(), // Puede venir o no en la creación
});

export const achievementSchemaPartial = achievementSchema.partial();

