import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  imports: [CommonModule] // ✅ on ajoute CommonModule ici
})
export class Footer implements AfterViewInit {
  currentYear = new Date().getFullYear();
  showScrollTop = false;
  footerVisible = false;

  @ViewChild('footerObserver', { static: true }) footerElement!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      this.footerVisible = entry.isIntersecting;
    }, { threshold: 0.2 });

    observer.observe(this.footerElement.nativeElement);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.showScrollTop = window.scrollY > 300;
  }
}
