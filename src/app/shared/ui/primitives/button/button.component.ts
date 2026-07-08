import { Component } from '@angular/core';

@Component({
  selector: 'opo-button',
  template: `<button class="button" type="button"><ng-content /></button>`,
  styleUrl: './button.component.css',
})
export class ButtonComponent {}
