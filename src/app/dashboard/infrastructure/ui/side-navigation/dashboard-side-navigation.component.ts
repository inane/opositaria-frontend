import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NavigationItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-dashboard-side-navigation',
  imports: [RouterLink],
  styleUrl: './dashboard-side-navigation.component.css',
  template: `
    <nav
      class="side-navigation"
      [class.side-navigation--collapsed]="!isOpen()"
      [class.side-navigation--rail]="!isOpen()"
      role="navigation"
      aria-label="Side menu"
      id="side-menu"
    >
      @for (item of navigationItems; track item.label) {
        <a
          class="side-navigation-item"
          [routerLink]="item.path"
          [attr.aria-label]="item.label"
          aria-current="page"
          (click)="onItemSelected()"
        >
          <span class="side-navigation-icon" aria-hidden="true">⌂</span>
          <span class="side-navigation-label">{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
})
export class DashboardSideNavigationComponent {
  readonly isOpen = input(false);
  readonly itemSelected = output<void>();

  protected readonly navigationItems: NavigationItem[] = [
    { label: 'Inicio', path: '/dashboard' },
  ];

  protected onItemSelected(): void {
    this.itemSelected.emit();
  }
}