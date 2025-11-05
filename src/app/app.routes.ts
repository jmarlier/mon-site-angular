import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home), title: 'Création de Site Internet | Développeur Freelance Jérôme Marlier' },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About), title: 'À Propos | Développeur Freelance Spécialisé Création Site' },
  { path: 'skills', loadComponent: () => import('./pages/skills/skills').then(m => m.Skills), title: 'Compétences | Développeur Web Freelance Création Site' },
  { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio').then(m => m.Portfolio), title: 'Portfolio Création Site Internet | Développeur Freelance' },
  { path: 'legal', loadComponent: () => import('./pages/legal/legal').then(m => m.Legal), title: 'Mentions Légales | Jérôme Marlier Développeur Freelance' },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact), title: 'Contact | Devis Création Site Internet Freelance' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
