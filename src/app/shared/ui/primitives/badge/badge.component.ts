import { Component, input } from '@angular/core';

@Component({
  selector: 'opo-badge',
  template: `<span class="badge"><ng-content /></span>`,
  styleUrl: './badge.component.css',
  host: {
    '[attr.data-tone]': 'tone()',
  },
})
export class BadgeComponent {
  readonly tone = input<'neutral' | 'info' | 'success' | 'warning' | 'error'>('neutral');
}
