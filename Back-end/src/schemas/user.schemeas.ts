import { z } from "zod";

const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const emailComercialRegEx = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com|aol\.com|zoho\.com|protonmail\.com)$/;


export const userSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener mas de 50 caracteres")
    .regex(descriptionRegex, "El nombre solo puede contener letras y espacios"),

  correo: z.string()
    .regex(emailComercialRegEx, "Debe ser un correo valido como Gmail, Outlook, Hotmail, Yahoo, iCloud, AOL,Zoho o ProtonMail")
    .max(200, "El correo no debe superar os 200 caracterse"),

  apodo: z.string()
    .min(3, "El apodo debe tener al menos 3 caracteres")
    .max(50, "El apodo no puede tener mas de 50 caracteres"),

  edad: z.number()
    .int("La edad debe ser un numero entero")
    .min(6, "La edad deber ser igual o mayor a 6")
    .max(13, "La edad no puede ser mayor a 13"),
});

export const userSchemaPartial = userSchema.partial();
