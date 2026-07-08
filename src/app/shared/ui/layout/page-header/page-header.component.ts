import { Component, input } from '@angular/core';

@Component({
  selector: 'opo-page-header',
  template: `
    <header class="page-header">
      <div class="page-header-content">
        <h1 class="page-header-title">{{ title() }}</h1>

        @if (description()) {
          <p class="page-header-description">{{ description() }}</p>
        }
      </div>

      <div class="page-header-actions">
        <ng-content />
      </div>
    </header>
  `,
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input('');
}
