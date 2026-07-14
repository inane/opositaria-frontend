import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSideNavigationComponent } from './side-navigation/dashboard-side-navigation.component';

@Component({
  selector: 'app-dashboard-shell',
  host: {
    class: 'dashboard-shell',
    '(document:click)': 'closeSideMenuOnBackdropClick($event)',
    '(document:keydown.escape)': 'closeSideMenuOnEscape()',
  },
  imports: [RouterOutlet, DashboardSideNavigationComponent],
  template: `
    <header class="dashboard-header">
      <button
        class="burger-menu-button"
        type="button"
        [attr.aria-label]="isSideMenuOpen() ? 'Close menu' : 'Open menu'"
        [attr.aria-expanded]="isSideMenuOpen()"
        aria-controls="side-menu"
        (click)="toggleSideMenu()"
      >
        <span class="burger-menu-icon" aria-hidden="true">☰</span>
      </button>
    </header>

    <div class="dashboard-body">
      <app-dashboard-side-navigation
        [isOpen]="isSideMenuOpen()"
        (itemSelected)="closeSideMenu()"
      />

      <main class="dashboard-content dashboard-content--grow">
        <router-outlet />
      </main>
    </div>

    <footer class="dashboard-footer"></footer>

    @if (isSideMenuOpen()) {
      <div class="side-menu-backdrop"></div>
    }
  `,
  styleUrl: './dashboard-shell.component.css',
})
export class DashboardShellComponent {
  protected readonly isSideMenuOpen = signal(false);

  protected closeSideMenu(): void {
    this.isSideMenuOpen.set(false);
  }

  protected toggleSideMenu(): void {
    this.isSideMenuOpen.set(!this.isSideMenuOpen());
  }

  protected closeSideMenuOnBackdropClick(event: MouseEvent): void {
    const eventTarget = event.target;

    if (!(eventTarget instanceof Element) || !eventTarget.classList.contains('side-menu-backdrop')) {
      return;
    }

    this.closeSideMenu();
  }

  protected closeSideMenuOnEscape(): void {
    this.closeSideMenu();
  }
}
