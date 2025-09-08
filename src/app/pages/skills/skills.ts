import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class Skills implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit(): void {
    this.title.setTitle('Compétences — Jérôme Marlier | Web & Back‑End');
    this.meta.updateTag({ name: 'description', content: 'Angular, Symfony, TypeScript, PHP, MySQL, API, design system et bonnes pratiques.' });
    this.meta.updateTag({ property: 'og:title', content: 'Compétences — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Compétences techniques et services proposés.' });
  }
}
