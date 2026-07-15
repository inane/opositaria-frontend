import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-educational-placeholder',
  template: `
    <section class="placeholder-page">
      <h2 class="placeholder-title">{{ getTitle() }}</h2>
      <p class="placeholder-description">
        This section is available as navigation scaffolding only. Feature content will be
        implemented in a future change.
      </p>
    </section>
  `,
  styles: [
    `
      .placeholder-page {
        padding: 2rem;
      }
      .placeholder-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: var(--opo-color-text);
      }
      .placeholder-description {
        font-size: 0.875rem;
        color: var(--opo-color-text-secondary);
        margin: 0;
      }
    `,
  ],
})
export class EducationalPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected getTitle(): string {
    return this.route.snapshot.data['title'] as string;
  }
}
