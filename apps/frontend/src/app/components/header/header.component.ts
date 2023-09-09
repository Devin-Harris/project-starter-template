import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AvatarComponent } from '../avatar/avatar.component';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'pal-header',
  standalone: true,
  imports: [LogoComponent, AvatarComponent, CommonModule, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {}
