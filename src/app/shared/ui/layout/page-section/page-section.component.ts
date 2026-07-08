import { Component, input } from '@angular/core';

@Component({
  selector: 'opo-page-section',
  template: `
    <section class="page-section">
      @if (title()) {
        <h2 class="page-section-title">{{ title() }}</h2>
      }

      @if (description()) {
        <p class="page-section-description">{{ description() }}</p>
      }

      <div class="page-section-body">
        <ng-content />
      </div>
    </section>
  `,
  styleUrl: './page-section.component.css',
})
export class PageSectionComponent {
  readonly title = input('');
  readonly description = input('');
}
