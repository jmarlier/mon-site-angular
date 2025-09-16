import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Composant Footer avec fonctionnalités de scroll-to-top et détection de visibilité
 * @selector app-footer
 * @standalone true
 * @imports CommonModule, RouterModule
 */

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  imports: [CommonModule, RouterModule] // ✅ on ajoute CommonModule ici
})
export class Footer implements AfterViewInit {
  /** Année courante pour le copyright */
  currentYear = new Date().getFullYear();


  /** Indique si le bouton scroll-to-top doit être affiché */
  showScrollTop = false;

  /** Indique si le footer est visible à l'écran */
  footerVisible = false;

  /** Référence à l'élément footer pour l'Intersection Observer */
  @ViewChild('footerObserver', { static: true }) footerElement!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

    /**
   * Initialisation après le rendu de la vue
   * Configure l'Intersection Observer et le bouton scroll-to-top
   */

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Observer pour la visibilité du footer
    const observer = new IntersectionObserver(([entry]) => {
      this.footerVisible = entry.isIntersecting;
    }, { threshold: 0.2 });

    observer.observe(this.footerElement.nativeElement);
    
    // Configurer le bouton scroll to top
    this.setupScrollTopButton();
  }
  
  /**
   * Configure l'événement click sur le bouton scroll-to-top
   */

  setupScrollTopButton(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Utiliser setTimeout pour s'assurer que le bouton est rendu
    setTimeout(() => {
      const scrollTopButton = document.querySelector('.scroll-top');
      if (scrollTopButton) {
        scrollTopButton.addEventListener('click', () => {
          this.scrollToTop();
        });
      }
    }, 0);
  }

    /**
   * Scroll smooth vers le haut de la page
   */

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Écouteur d'événement de scroll pour afficher/masquer le bouton scroll-to-top
   */

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.showScrollTop = window.scrollY > 300;
  }
}