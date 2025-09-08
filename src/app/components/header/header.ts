import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements AfterViewInit, OnDestroy {
  isDarkMode = false;
  private cleanup: Array<() => void> = [];
  isShrunk = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // Vérifier si on est côté client avant d'utiliser localStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        // Respect system preference by default
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyTheme(this.isDarkMode ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const newTheme: 'light' | 'dark' = this.isDarkMode ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  applyTheme(theme: 'light' | 'dark'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Nettoyage d'éventuelles anciennes classes
    html.classList.remove('light-mode', 'dark-mode');
    document.body.classList.remove('light-mode', 'dark-mode');
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Initialize shrink state
    this.updateShrinkState();
    // Initialiser le thème depuis localStorage si présent
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme(savedTheme);
    }
    const links = document.querySelectorAll('.nav-menu a');
    let underline = document.querySelector('.nav-menu .underline') as HTMLElement | null;
    const getUnderline = () => (underline ||= document.querySelector('.nav-menu .underline') as HTMLElement | null);

    const animateStretch = (fromX: number, toX: number, toWidth: number) => {
      const stretchWidth = Math.abs(toX - fromX) + toWidth;
      const minX = Math.min(fromX, toX);

      const ul = getUnderline();
      if (!ul) return;
      ul.style.transition = 'all 0.2s ease-out';
      ul.style.left = `${minX}px`;
      ul.style.width = `${stretchWidth}px`;

      setTimeout(() => {
        const ul2 = getUnderline();
        if (!ul2) return;
        ul2.style.transition = 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
        ul2.style.left = `${toX}px`;
        ul2.style.width = `${toWidth}px`;
      }, 200);
    };

    const updateUnderline = () => {
      const ul = getUnderline();
      if (!ul) return;
      let active = document.querySelector('.nav-menu a.active') as HTMLElement | null;
      if (!active) active = document.querySelector('.nav-menu a') as HTMLElement | null;
      if (!active) return;

      const toX = active.offsetLeft;
      const toWidth = active.offsetWidth;

      const fromX = ul.offsetLeft || 0;
      animateStretch(fromX, toX, toWidth);
    };

    // Try after layout/active class application and after fonts load
    requestAnimationFrame(() => {
      updateUnderline();
      setTimeout(updateUnderline, 150);
    });
    const onLoad = () => updateUnderline();
    window.addEventListener('load', onLoad);
    this.cleanup.push(() => window.removeEventListener('load', onLoad));

    const sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Close mobile menu if open
        const toggle = document.getElementById('menu-toggle') as HTMLInputElement | null;
        if (toggle) toggle.checked = false;
        setTimeout(updateUnderline, 80);
      }
    });
    this.cleanup.push(() => sub.unsubscribe());

    links.forEach(link => {
      const handler = () => updateUnderline();
      link.addEventListener('click', handler);
      this.cleanup.push(() => link.removeEventListener('click', handler));
    });

    const onResize = () => updateUnderline();
    window.addEventListener('resize', onResize);
    this.cleanup.push(() => window.removeEventListener('resize', onResize));

    // Debug helper removed after validation
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.updateShrinkState();
  }

  private updateShrinkState() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    this.isShrunk = y > 20;
  }

  ngOnDestroy(): void {
    this.cleanup.forEach(fn => {
      try { fn(); } catch { }
    });
    this.cleanup = [];
  }
}
