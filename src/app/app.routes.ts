import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Portfolio } from './pages/portfolio/portfolio';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home, title: 'Accueil - Mon Site' },
  { path: 'about', component: About, title: 'À propos - Mon Site' },
  { path: 'portfolio', component: Portfolio, title: 'Portfolio - Mon Site' },
  { path: 'contact', component: Contact, title: 'Contact - Mon Site' },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirection pour les routes inconnues
];