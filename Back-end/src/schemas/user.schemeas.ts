import { z } from "zod";

const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const emailComercialRegEx = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com|aol\.com|zoho\.com|protonmail\.com)$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userSchema = z.object({
  Nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(descriptionRegex, "El nombre solo puede contener letras y espacios"),

  Correo: z.string()
    .regex(emailComercialRegEx, "Debe ser un correo válido como Gmail, Outlook, Hotmail, Yahoo, iCloud, AOL, Zoho o ProtonMail")
    .max(200, "El correo no debe superar los 200 caracteres"),

  Apodo: z.string()
    .min(3, "El apodo debe tener al menos 3 caracteres")
    .max(50, "El apodo no puede tener más de 50 caracteres"),

  Edad: z.number()
    .int("La edad debe ser un número entero")
    .min(6, "La edad debe ser igual o mayor a 6")
    .max(13, "La edad no puede ser mayor a 13"),

  Password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(passwordRegex, "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial")
});

export const userSchemaPartial = userSchema.partial();
