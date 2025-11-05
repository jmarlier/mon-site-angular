import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import schema from '../../../assets/schema.json';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})

export class Home implements OnInit {
  schemaJsonLd = JSON.stringify(schema);

  constructor(private title: Title, private meta: Meta, private googleAnalytics: GoogleAnalyticsService) { }

  ngOnInit(): void {
    this.title.setTitle('Création de Site Internet | Développeur Freelance Jérôme Marlier');
    this.meta.updateTag({ name: 'description', content: 'Développeur freelance spécialisé dans la création de sites internet professionnels. Sites vitrines, applications métier et solutions web sur mesure. Basé en Auvergne-Rhône-Alpes.' });
    this.meta.updateTag({ property: 'og:title', content: 'Création de Site Internet | Développeur Freelance' });
    this.meta.updateTag({ property: 'og:description', content: 'Développeur freelance spécialisé création de sites internet professionnels. Sites vitrines, applications métier sur mesure.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  trackExternalLink(url: string, linkText: string) {
    this.googleAnalytics.trackExternalLink(url, linkText);
  }
}
