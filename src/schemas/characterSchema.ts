import * as Joi from "joi";

export const paramCharacterSchema = Joi.object({
    characterName : Joi.string().required().messages(
    { 'string.base': 'El nombre del personaje debe ser un texto.',
      'string.empty': 'El nombre del personaje no puede estar vacío.',
      'string.null': 'El parametro characterName es requerido.',    
    }
    )
});