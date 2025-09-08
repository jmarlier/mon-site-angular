import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Surbar } from './components/surbar/surbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, Surbar, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class App {

}
