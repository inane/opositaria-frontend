import { Component, input, output } from '@angular/core';

@Component({
  selector: 'opo-button',
  template: `
    <button
      class="button"
      [type]="type()"
      [disabled]="disabled()"
      (click)="onClick()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly pressed = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.pressed.emit();
    }
  }
}
