import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Portfolio } from './portfolio';

describe('PortfolioComponent', () => {
  let component: Portfolio;
  let fixture: ComponentFixture<Portfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Portfolio]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Portfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the portfolio component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain projects', () => {
    const projects = component.projects;
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].title).toBeDefined();
  });
});
