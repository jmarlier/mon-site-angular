import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-portfolio',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss']
})
export class Portfolio implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('Prestations — Jérôme Marlier | Sites vitrines, Apps métier, API');
    this.meta.updateTag({ name: 'description', content: 'Sites vitrines modernes, applications métier, espaces clients, intégration d’API, génération de PDF et maintenance.' });
    this.meta.updateTag({ property: 'og:title', content: 'Prestations — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Services de développement web sur mesure pour PME et indépendants.' });
  }
}
