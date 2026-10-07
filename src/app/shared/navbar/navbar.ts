import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  imports: [MatToolbarModule, MatButtonModule],
})
export class Navbar {}
