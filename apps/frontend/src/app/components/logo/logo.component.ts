import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
   selector: 'pal-logo',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [CommonModule],
   templateUrl: './logo.component.html',
   styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {}
