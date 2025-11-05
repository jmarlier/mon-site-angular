import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs/operators';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Surbar } from './components/surbar/surbar';
import { SITE_SETTINGS } from './config/site-settings';
import { GoogleAnalyticsService } from './services/google-analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, Surbar, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class App implements OnInit {
  // Flag contrôlé en code, sans UI
  readonly surbarEnabled = SITE_SETTINGS.surbarEnabled;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private googleAnalytics: GoogleAnalyticsService
  ) {
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

  ngOnInit() {
    // Tracking automatique des pages
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const pageName = this.getPageNameFromUrl(event.url);
          this.googleAnalytics.trackPage(pageName, event.url);
        });
    }
  }

  private getPageNameFromUrl(url: string): string {
    const routes: { [key: string]: string } = {
      '/': 'Accueil',
      '/about': 'À propos',
      '/skills': 'Compétences',
      '/portfolio': 'Prestations',
      '/contact': 'Contact',
      '/legal': 'Mentions légales'
    };
    return routes[url] || url;
  }
}
