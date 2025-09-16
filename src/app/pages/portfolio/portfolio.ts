import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss']
})
export class Portfolio implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('Prestations — Jérôme Marlier | Développement web sur mesure');
    this.meta.updateTag({
      name: 'description',
      content: 'Création de sites vitrines, d’applications métier, d’espaces clients, de PDF automatisés et plus encore.'
    });
    this.meta.updateTag({ property: 'og:title', content: 'Prestations — Jérôme Marlier' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Découvrez les services proposés en développement web freelance.'
    });
  }
}