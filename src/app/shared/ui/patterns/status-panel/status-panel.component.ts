import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'opo-status-panel',
  template: `
    <div
      class="status-panel"
      [attr.role]="role()"
      [attr.aria-live]="ariaLive()"
      [attr.data-tone]="tone()"
    >
      <strong class="status-panel-title">{{ title() }}</strong>
      <p class="status-panel-message">{{ message() }}</p>
      <div class="status-panel-actions">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './status-panel.component.css',
})
export class StatusPanelComponent {
  readonly tone = input<'neutral' | 'info' | 'success' | 'warning' | 'error'>('neutral');
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly live = input<'off' | 'polite' | 'assertive'>('polite');

  readonly role = computed(() => {
    const live = this.live();
    return live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : null;
  });

  readonly ariaLive = computed(() => {
    const live = this.live();
    return live === 'off' ? null : live;
  });
}
