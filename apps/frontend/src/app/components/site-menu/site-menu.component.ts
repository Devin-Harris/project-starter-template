import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NavbarStateService } from '@frontend/core/layout/services/navbar-state.service';
import { MenuItem } from '@frontend/core/layout/state/models/nav-link.model';
import { Subject } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'pal-site-menu',
  styleUrls: ['./site-menu.component.scss'],
  templateUrl: './site-menu.component.html',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    LogoComponent,
    HeaderComponent,
  ],
  standalone: true,
})
export class SiteMenuComponent implements OnDestroy {
  readonly navbarStateService = inject(NavbarStateService);

  private destroyed$ = new Subject<void>();

  displayWith(item: MenuItem): string {
    return item.name;
  }

  getChildren(item: MenuItem): MenuItem[] | undefined {
    return item.children;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  trackBy(_: number, item: MenuItem): string {
    return `${item.routerLink}`;
  }

  onToggleMenuClicked() {
    this.navbarStateService.toggleMenu();
  }
}
