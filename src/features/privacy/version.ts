// ============================================
// ITSEIA Academy - Privacy Policy Version
// Actualizar POLICY_VERSION cada vez que se
// publique una nueva version de la politica.
// ============================================

export const POLICY_VERSION = "1.0";

/**
 * Verifica si un usuario tiene consentimiento registrado
 * para la version actual de la politica.
 */
export function hasCurrentConsent(
  consentVersion: string | null | undefined
): boolean {
  return consentVersion === POLICY_VERSION;
}
