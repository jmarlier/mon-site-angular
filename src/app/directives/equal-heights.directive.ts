import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appEqualHeights]'
})
export class EqualHeightsDirective implements AfterViewInit {
  @Input('appEqualHeights') targetSelector = '';

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.equalize();
    // Run again after fonts/assets load (if any)
    setTimeout(() => this.equalize(), 100);
    requestAnimationFrame(() => this.equalize());
  }

  @HostListener('window:resize')
  onResize() { this.equalize(); }

  private equalize(): void {
    const container = this.host.nativeElement;
    const items = Array.from(
      this.targetSelector ? container.querySelectorAll<HTMLElement>(this.targetSelector) : Array.from(container.children) as HTMLElement[]
    );
    if (!items.length) return;

    // Reset heights
    items.forEach(el => (el.style.height = 'auto'));

    // Compute max natural height
    const max = Math.max(...items.map(el => el.getBoundingClientRect().height));
    items.forEach(el => (el.style.height = `${Math.ceil(max)}px`));
  }
}

