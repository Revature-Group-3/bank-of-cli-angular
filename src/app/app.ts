import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  imports: [RouterOutlet, Navbar, MatSidenavModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('bank-of-cli-angular');
}
