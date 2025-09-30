// Centralise les réglages de site activés au build/runtime (sans UI)
export const SITE_SETTINGS = {
  // Active/désactive la surbar globale en haut du site
  surbarEnabled: false,
  // Configuration envoi formulaire de contact (statique)
  contact: {
    // Provider backend perso (Express + Nodemailer)
    provider: 'custom' as 'formspree' | 'custom',
    // Endpoint PHP (SMTP via PHPMailer) en prod
    endpoint: '/api/contact-smtp.php',
  },
};

