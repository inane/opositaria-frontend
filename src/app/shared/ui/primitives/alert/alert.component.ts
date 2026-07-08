import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'opo-alert',
  template: `
    <div
      class="alert"
      [attr.role]="role()"
      [attr.data-tone]="tone()"
    >
      @if (title()) {
        <strong class="alert-title">{{ title() }}</strong>
      }
      <ng-content />
    </div>
  `,
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  readonly tone = input<'info' | 'success' | 'warning' | 'error'>('info');
  readonly title = input('');

  readonly role = computed(() => {
    const tone = this.tone();
    return tone === 'error' || tone === 'warning' ? 'alert' : null;
  });
}
