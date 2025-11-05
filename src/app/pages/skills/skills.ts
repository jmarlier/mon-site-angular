import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EqualHeightsDirective } from '../../directives/equal-heights.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [EqualHeightsDirective, RouterModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class Skills implements OnInit {
  constructor(private title: Title, private meta: Meta) { }
  ngOnInit(): void {
    this.title.setTitle('Compétences | Développeur Web Freelance Création Site');
    this.meta.updateTag({ name: 'description', content: 'Compétences techniques du développeur freelance : Angular, Symfony, PHP, API REST, MySQL. Spécialisé dans la création de sites internet professionnels avec optimisation SEO.' });
    this.meta.updateTag({ property: 'og:title', content: 'Compétences | Développeur Freelance Création Site' });
    this.meta.updateTag({ property: 'og:description', content: 'Développeur freelance expert Angular, Symfony, PHP. Création de sites internet avec performance et SEO.' });
  }
}
