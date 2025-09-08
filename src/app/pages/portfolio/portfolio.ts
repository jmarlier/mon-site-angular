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
  projects = [
    {
      title: 'Agence Canopée',
      description: `Gestion de devis, signature électronique, génération PDF et facturation intégrée.`,
      tech: ['Symfony 7', 'Twig', 'Dompdf', 'MySQL', 'JWT'],
      image: '/images/project-canopee.jpg',
      link: '#'
    },
    {
      title: 'Alphadis',
      description: `Plateforme logistique: ordres de transport, signature en ligne, gestion multi-sites.`,
      tech: ['Symfony', 'Bootstrap', 'PDF', 'Upload'],
      image: '/images/project-alphadis.jpg',
      link: '#'
    }
  ];
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit(): void {
    this.title.setTitle('Prestations — Jérôme Marlier | Projets et Réalisations');
    this.meta.updateTag({ name: 'description', content: 'Exemples de projets: devis, signature électronique, plateformes logistiques, back-offices.' });
    this.meta.updateTag({ property: 'og:title', content: 'Prestations — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Projets et réalisations web.' });
  }
}
