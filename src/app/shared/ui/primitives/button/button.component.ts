import { Component, input } from '@angular/core';

@Component({
  selector: 'opo-button',
  template: `<button class="button" [type]="type()"><ng-content /></button>`,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
}
