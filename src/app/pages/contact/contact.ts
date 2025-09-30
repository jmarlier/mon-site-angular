import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { SITE_SETTINGS } from '../../config/site-settings';

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
  constructor(
    private http: HttpClient,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Contact — Jérôme Marlier | Développeur Web Freelance');
    this.meta.updateTag({ name: 'description', content: 'Parlez‑moi de votre projet: site vitrine, application métier, back‑office, API, optimisation SEO.' });
    this.meta.updateTag({ property: 'og:title', content: 'Contact — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Demandez un devis ou un accompagnement pour vos projets web.' });
  }

  sendEmail(form: NgForm): void {
    if (!form.valid) return;
    if (this.botField?.trim()) {
      this.messageSent = true;
      this.messageError = false;
      form.resetForm();
      return;
    }

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
      } catch {}
    }
    if (cfg.provider === 'formspree') {
      this.sending = true;
      this.http.post(url, payload, { headers: { Accept: 'application/json' } }).subscribe({
        next: () => {
          this.messageSent = true;
          this.messageError = false;
          this.sending = false;
          form.resetForm();
        },
        error: () => {
          this.messageError = true;
          this.messageSent = false;
          this.sending = false;
        }
      });
      return;
    }
    this.http.post(url || '/api/contact', payload).subscribe({
      next: () => {
        this.messageSent = true;
        this.messageError = false;
        this.sending = false;
        form.resetForm();
      },
      error: () => {
        this.messageError = true;
        this.messageSent = false;
        this.sending = false;
      }
    });
  }
}
