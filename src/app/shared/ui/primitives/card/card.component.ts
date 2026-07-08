import { Component, input } from '@angular/core';

@Component({
  selector: 'opo-card',
  template: `<div class="card"><ng-content /></div>`,
  styleUrl: './card.component.css',
  host: {
    '[attr.data-variant]': 'variant()',
  },
})
export class CardComponent {
  readonly variant = input<'default' | 'muted' | 'outlined'>('default');
}
