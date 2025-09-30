import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-legal',
  standalone: true,
  templateUrl: './legal.html',
  styleUrls: ['./legal.scss']
})
export class Legal implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('Mentions légales — Jérôme Marlier | Développeur Web Freelance');
    this.meta.updateTag({ name: 'description', content: 'Mentions légales du site de Jérôme Marlier, développeur web freelance basé en Auvergne‑Rhône‑Alpes.' });
    this.meta.updateTag({ property: 'og:title', content: 'Mentions légales — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Informations légales et contact.' });
  }
}

