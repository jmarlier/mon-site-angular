import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home), title: 'Accueil - Mon Site' },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About), title: 'À propos - Mon Site' },
  { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio').then(m => m.Portfolio), title: 'Portfolio - Mon Site' },
  { path: 'legal', loadComponent: () => import('./pages/legal/legal').then(m => m.Legal), title: 'Mentions légales - Mon Site' },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact), title: 'Contact - Mon Site' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
