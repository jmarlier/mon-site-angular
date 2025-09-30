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
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit(): void {
    this.title.setTitle('À propos — Jérôme Marlier | Développeur Web Freelance');
    this.meta.updateTag({ name: 'description', content: 'Mon parcours et mon approche: développement web sur mesure (Angular, Symfony, API, SEO), accompagnement pragmatique et orienté résultats.' });
    this.meta.updateTag({ property: 'og:title', content: 'À propos — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Développeur web freelance — expertise Angular, Symfony, API et SEO.' });
  }
}
