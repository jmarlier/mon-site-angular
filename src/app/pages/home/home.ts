import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import schema from '../../../assets/schema.json';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})

export class Home implements OnInit {
  schemaJsonLd = JSON.stringify(schema);

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('Accueil — Jérôme Marlier | Développeur Web Freelance');
    this.meta.updateTag({ name: 'description', content: 'Développeur web freelance: sites vitrines, applications métier, back-offices. Basé en Auvergne-Rhône-Alpes.' });
    this.meta.updateTag({ property: 'og:title', content: 'Accueil — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Développeur web freelance: sites vitrines, applications métier, back-offices.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }
}
