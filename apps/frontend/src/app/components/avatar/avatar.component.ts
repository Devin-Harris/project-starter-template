import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@Component({
   selector: 'pal-avatar',
   standalone: true,
   imports: [
      CommonModule,
      MatButtonModule,
      MatMenuModule,
      MatDividerModule,
      RouterModule,
   ],
   templateUrl: './avatar.component.html',
   styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {}
