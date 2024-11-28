import * as Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "El email debe ser un correo electrónico válido.",
    "string.email": "El email debe ser un correo electrónico válido.",
    "any.required": "El email es un campo obligatorio.",
    "string.empty": "El email es un campo obligatorio.",
  }),
  name: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .required()
    .messages({
      "string.base": "El nombre debe ser un texto con caracteres válidos.",
      "string.pattern.base":
        "El nombre debe ser un texto con caracteres válidos.",
      "string.empty": "El nombre es un campo obligatorio.",
      "any.required": "El nombre es un campo obligatorio.",
    }),
  paternalSurname: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .required()
    .messages({
      "string.base": "El apellido paterno debe ser un texto válido.",
      "string.pattern.base":
        "El apellido paterno debe ser un texto con caracteres válidos.",
      "string.empty": "El apellido paterno es un campo obligatorio.",
      "any.required": "El apellido paterno es un campo obligatorio.",
    }),
  maternalSurname: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .optional()
    .allow("")
    .messages({
      "string.base": "El apellido materno debe ser un texto válido.",
      "string.pattern.base":
        "El apellido materno debe ser un texto con caracteres válidos.",
    }),
  dateBirth: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return helpers.error("any.invalid", {
          message:
            "La fecha de nacimiento debe ser válida y estar en el formato YYYY-MM-DD.",
        });
      }
      return value;
    })
    .messages({
      "string.pattern.base":
        "La fecha de nacimiento debe ser válida y estar en el formato YYYY-MM-DD.",
      "string.empty": "La fecha de nacimiento es un campo obligatorio.",
      "any.required": "La fecha de nacimiento es un campo obligatorio.",
    }),
});
