import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AvatarComponent } from '@frontend/components/avatar/avatar.component';
import { FooterComponent } from '@frontend/components/footer/footer.component';
import { HeaderComponent } from '@frontend/components/header/header.component';
import { SiteMenuComponent } from '@frontend/components/site-menu/site-menu.component';
import { NavbarStateService } from './services/navbar-state.service';

@Component({
  selector: 'pal-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    AvatarComponent,
    FooterComponent,
    SiteMenuComponent,
    CommonModule,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  readonly navbarStateService = inject(NavbarStateService);
}
