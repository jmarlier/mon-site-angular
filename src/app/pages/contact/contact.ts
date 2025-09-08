import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    HttpClientModule,
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact {
  messageSent = false;
  messageError = false;
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {}

  sendEmail(form: NgForm): void {
    if (!form.valid) return;

    const payload = {
      name: form.value.name,
      user_email: form.value.user_email,
      subject: form.value.subject,
      message: form.value.message,
    };

    // SSR-safety: only attempt network on browser
    if (!isPlatformBrowser(this.platformId)) return;

    this.http.post('/api/contact', payload).subscribe({
      next: () => {
        this.messageSent = true;
        this.messageError = false;
        form.resetForm();
      },
      error: () => {
        this.messageError = true;
        this.messageSent = false;
      }
    });
  }
}
