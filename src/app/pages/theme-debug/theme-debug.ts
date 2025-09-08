import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-debug',
  standalone: true,
  templateUrl: './theme-debug.html',
  styleUrls: ['./theme-debug.scss']
})
export class ThemeDebug {
  theme: 'light' | 'dark' = 'light';

  toggle(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}

