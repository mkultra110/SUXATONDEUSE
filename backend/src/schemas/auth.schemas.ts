// Schemas Zod pour la validation des inputs auth.
// Source de verite des regles metier (longueurs, charset, etc.).

import { z } from 'zod';

const usernameRegex = /^[a-zA-Z0-9_-]+$/;

export const usernameSchema = z
  .string()
  .min(3, 'Le pseudo doit faire au moins 3 caracteres.')
  .max(20, 'Le pseudo doit faire au maximum 20 caracteres.')
  .regex(usernameRegex, 'Le pseudo ne peut contenir que lettres, chiffres, _ et -.');

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit faire au moins 8 caracteres.')
  .max(128, 'Le mot de passe doit faire au maximum 128 caracteres.');

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: z.string().email('Email invalide.').optional(),
});

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
