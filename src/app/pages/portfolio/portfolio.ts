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
  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('Portfolio Création Site Internet | Développeur Freelance');
    this.meta.updateTag({ name: 'description', content: 'Portfolio du développeur freelance : création de sites internet, applications métier, espaces clients. Exemples de réalisations web professionnelles avec intégrations API.' });
    this.meta.updateTag({ property: 'og:title', content: 'Portfolio Création Site Internet | Développeur Freelance' });
    this.meta.updateTag({ property: 'og:description', content: 'Découvrez mes réalisations : création de sites internet professionnels, applications métier sur mesure.' });
  }
}
