import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button'

import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-mobile-navbar',
  templateUrl: 'mobile-navbar.html',
  styleUrl: 'mobile-navbar.css',
  imports: [MatToolbar, MatButton],
})

export class MobileNavbar extends Navbar {}
