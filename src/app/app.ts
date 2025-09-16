import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Surbar } from './components/surbar/surbar';
import { SITE_SETTINGS } from './config/site-settings';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, Surbar, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class App {
  // Flag contrôlé en code, sans UI
  readonly surbarEnabled = SITE_SETTINGS.surbarEnabled;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    // Ajuste les variables CSS globales pour l'offset du header
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      root.style.setProperty('--surbar-on', this.surbarEnabled ? '1' : '0');
      // Optionnel: si désactivée, forcer aussi hauteur/bordure à 0
      if (!this.surbarEnabled) {
        root.style.setProperty('--surbar-height', '0px');
        root.style.setProperty('--surbar-border', '0px');
      }
    }
  }
}
