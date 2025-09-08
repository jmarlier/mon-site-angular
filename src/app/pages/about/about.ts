import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class About implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit(): void {
    this.title.setTitle('À propos — Jérôme Marlier | Développeur Web');
    this.meta.updateTag({ name: 'description', content: 'Parcours, valeurs et approche de Jérôme Marlier, développeur web freelance.' });
    this.meta.updateTag({ property: 'og:title', content: 'À propos — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Parcours et approche de développeur web freelance.' });
  }
}
