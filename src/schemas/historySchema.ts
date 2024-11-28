import * as Joi from "joi";

export const paramHistorySchema = Joi.object({
    orderQuery: Joi.alternatives().try(
        Joi.string().required().messages({
            'string.base': 'El valor del orden debe ser un número 0-> ascendente, 1-> descendente',
        }),
        Joi.number().valid(0, 1).required().messages({
            'number.base': 'El valor del orden debe ser un número 0-> ascendente, 1-> descendente',
            'any.only': 'El valor del orden debe ser 0 o 1.'
        })
    )
});


export const paginationSchema = Joi.object({
    limit: Joi.number().integer().min(1).default(10).messages({
      "number.base": "El límite debe ser un número.",
      "number.integer": "El límite debe ser un número entero.",
      "number.min": "El límite debe ser al menos 1.",
    }),
    lastEvaluatedKey: Joi.string().optional().messages({
      "string.base": "La clave de última evaluación debe ser una cadena.",
    }),
  });