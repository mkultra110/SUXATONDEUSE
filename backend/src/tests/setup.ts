// Setup global Vitest pour les tests backend.
// Injecte les variables d'env minimales pour que la validation Zod passe.

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test_jwt_secret_at_least_32_chars_long_padding_value_xx';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'test_refresh_secret_at_least_32_chars_long_padding_xxxx';
process.env.SAVE_HMAC_SECRET =
  process.env.SAVE_HMAC_SECRET ??
  'test_hmac_secret_minimum_64_chars_for_anti_cheat_signature_xxxxxxxxxxxxxxx';
process.env.LOG_LEVEL = 'error';
