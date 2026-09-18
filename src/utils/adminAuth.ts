/**
 * Admin Credentials and Authentication Helpers
 */

const ADMIN_PASSWORD_KEY = 'ftp_admin_password_v1';
export const DEFAULT_ADMIN_USERNAMES = [
  'admin',
  'admin_ftp_master',
  'superadmin',
  'ftp_admin',
  'admin@ftp.io',
  'admin_master',
  'administrator',
];
export const DEFAULT_ADMIN_PASSWORD = 'admin123';

export function getAdminPassword(): string {
  try {
    const saved = localStorage.getItem(ADMIN_PASSWORD_KEY) || localStorage.getItem('s7g_admin_password_v1');
    return saved && saved.trim().length > 0 ? saved : DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
}

export function setAdminPassword(newPassword: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
  } catch (e) {
    console.error('Error saving admin password:', e);
  }
}

export function verifyAdminCredentials(username: string, password: string): { success: boolean; message?: string } {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const isValidUser = DEFAULT_ADMIN_USERNAMES.includes(cleanUser);

  if (!isValidUser) {
    return {
      success: false,
      message: 'Usuario o contraseña incorrectos.',
    };
  }

  const currentPass = getAdminPassword();
  if (cleanPass !== currentPass) {
    return {
      success: false,
      message: 'Contraseña incorrecta. Verifica tus datos de acceso.',
    };
  }

  return { success: true };
}
