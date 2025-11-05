import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class About implements OnInit {
  constructor(private title: Title, private meta: Meta) { }
  ngOnInit(): void {
    this.title.setTitle('À Propos | Développeur Freelance Spécialisé Création Site');
    this.meta.updateTag({ name: 'description', content: 'Développeur freelance avec 15 ans d\'expérience en management. Spécialisé dans la création de sites internet et applications web sur mesure. Reconversion réussie vers le développement.' });
    this.meta.updateTag({ property: 'og:title', content: 'À Propos | Développeur Freelance Création Site' });
    this.meta.updateTag({ property: 'og:description', content: 'Développeur freelance spécialisé création de sites internet. 15 ans d\'expérience, approche pragmatique et orientée résultats.' });
  }
}
