import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-side-navigation',
  template: `
    <nav
      class="side-navigation"
      [class.side-navigation--collapsed]="!isOpen()"
      [class.side-navigation--rail]="!isOpen()"
    >
    </nav>
  `,
})
export class DashboardSideNavigationComponent {
  readonly isOpen = input(false);
}