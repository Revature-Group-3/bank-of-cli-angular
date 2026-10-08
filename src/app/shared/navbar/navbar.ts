import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  imports: [MatListModule],
})
export class Navbar {}
