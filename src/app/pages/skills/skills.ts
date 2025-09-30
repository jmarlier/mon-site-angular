import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { EqualHeightsDirective } from '../../directives/equal-heights.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [EqualHeightsDirective],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class Skills implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit(): void {
    this.title.setTitle('Compétences — Jérôme Marlier | Angular, Symfony, API, SEO');
    this.meta.updateTag({ name: 'description', content: 'Angular, TypeScript, Symfony, PHP, API REST, MySQL, performance web, design system et SEO technique.' });
    this.meta.updateTag({ property: 'og:title', content: 'Compétences — Jérôme Marlier' });
    this.meta.updateTag({ property: 'og:description', content: 'Stack front & back: Angular, Symfony, API, SEO et bonnes pratiques.' });
  }
}
