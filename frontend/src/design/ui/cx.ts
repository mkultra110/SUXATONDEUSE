// Petit utilitaire de composition de classes (clsx minimal, sans dépendance).
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
