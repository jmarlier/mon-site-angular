import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { SITE_SETTINGS } from '../../config/site-settings';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgIf,
    HttpClientModule,
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact implements OnInit {
  messageSent = false;
  messageError = false;
  sending = false;
  botField = '';
  errorMessage = '';
  diagnosticResult: any = null;
  showDiagnostic = false;
  constructor(
    private http: HttpClient,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
    private googleAnalytics: GoogleAnalyticsService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Contact | Devis Création Site Internet Freelance');
    this.meta.updateTag({ name: 'description', content: 'Demandez un devis pour la création de votre site internet. Développeur freelance disponible pour sites vitrines, applications métier et solutions web sur mesure.' });
    this.meta.updateTag({ property: 'og:title', content: 'Contact | Devis Création Site Internet Freelance' });
    this.meta.updateTag({ property: 'og:description', content: 'Obtenez un devis gratuit pour la création de votre site internet. Développeur freelance réactif.' });
  }

  sendEmail(form: NgForm): void {
    if (!form.valid) return;
    if (this.botField?.trim()) {
      this.messageSent = true;
      this.messageError = false;
      this.errorMessage = '';
      form.resetForm();
      return;
    }

    // Reset states
    this.messageSent = false;
    this.messageError = false;
    this.errorMessage = '';
    this.sending = true;

    const payload = {
      name: form.value.name,
      user_email: form.value.user_email,
      email: form.value.user_email,
      subject: form.value.subject,
      message: form.value.message,
      company: this.botField || '',
    };

    // SSR-safety: only attempt network on browser
    if (!isPlatformBrowser(this.platformId)) return;
    const cfg = SITE_SETTINGS.contact;
    let url = cfg.endpoint;
    // In local dev with Angular dev server (port 4300), prefer Node API (/api/contact) via proxy
    if (isPlatformBrowser(this.platformId)) {
      try {
        const p = window.location && window.location.port;
        if (p === '4300') {
          url = '/api/contact';
        }
      } catch { }
    }
    if (cfg.provider === 'formspree') {
      this.http.post(url, payload, { headers: { Accept: 'application/json' } }).subscribe({
        next: () => {
          this.messageSent = true;
          this.messageError = false;
          this.errorMessage = '';
          this.sending = false;
          // Tracking GA4 - Formulaire envoyé avec succès
          this.googleAnalytics.trackContactForm(form.value.subject || 'Sujet non spécifié');
          form.resetForm();
        },
        error: (error) => {
          this.messageError = true;
          this.messageSent = false;
          this.errorMessage = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
          this.sending = false;
          console.error('Contact form error:', error);
        }
      });
      return;
    }
    this.http.post(url || '/api/contact', payload, { timeout: 30000 }).subscribe({
      next: () => {
        this.messageSent = true;
        this.messageError = false;
        this.errorMessage = '';
        this.sending = false;
        // Tracking GA4 - Formulaire envoyé avec succès
        this.googleAnalytics.trackContactForm(form.value.subject || 'Sujet non spécifié');
        form.resetForm();
      },
      error: (error) => {
        this.messageError = true;
        this.messageSent = false;
        this.sending = false;

        // Gestion des erreurs spécifiques
        if (error.status === 500) {
          const errorText = error.error?.error || '';
          if (errorText.includes('SMTP not configured')) {
            this.errorMessage = 'Configuration email manquante. Contactez l\'administrateur.';
          } else if (errorText.includes('Mailer error')) {
            this.errorMessage = 'Erreur serveur email. Réessayez dans quelques minutes.';
          } else if (errorText.includes('Mail not configured')) {
            this.errorMessage = 'Service email non configuré. Contactez l\'administrateur.';
          } else {
            this.errorMessage = 'Erreur serveur. Veuillez réessayer dans quelques minutes.';
          }
        } else if (error.status === 400) {
          const errorText = error.error?.error || '';
          if (errorText.includes('Invalid email format')) {
            this.errorMessage = 'Format d\'email invalide. Vérifiez votre adresse email.';
          } else if (errorText.includes('Invalid payload')) {
            this.errorMessage = 'Données manquantes. Remplissez tous les champs requis.';
          } else {
            this.errorMessage = 'Données invalides. Vérifiez vos informations.';
          }
        } else if (error.status === 0 || error.status === undefined) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
        } else if (error.status === 524) {
          this.errorMessage = 'Le serveur met trop de temps à répondre. Réessayez dans quelques minutes.';
        } else if (error.status >= 400 && error.status < 500) {
          this.errorMessage = 'Erreur de requête. Vérifiez vos informations.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Erreur serveur temporaire. Réessayez dans quelques minutes.';
        } else {
          this.errorMessage = 'Erreur inconnue. Réessayez ou contactez-moi directement.';
        }

        console.error('Contact form error:', error);
      }
    });
  }

  runDiagnostic(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.http.get('/api/contact-diag.php').subscribe({
      next: (result) => {
        this.diagnosticResult = result;
        this.showDiagnostic = true;
      },
      error: (error) => {
        this.diagnosticResult = { error: 'Impossible de récupérer le diagnostic' };
        this.showDiagnostic = true;
        console.error('Diagnostic error:', error);
      }
    });
  }
}
