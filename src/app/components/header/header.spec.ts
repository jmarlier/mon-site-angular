import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles theme and updates <html> classes', () => {
    const html = document.documentElement;
    html.classList.remove('light-mode', 'dark-mode');
    component.isDarkMode = false;
    component.toggleTheme();
    expect(html.classList.contains('dark-mode')).toBeTrue();
    component.toggleTheme();
    expect(html.classList.contains('light-mode')).toBeTrue();
  });
});
