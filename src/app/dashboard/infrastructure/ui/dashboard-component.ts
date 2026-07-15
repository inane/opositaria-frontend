import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';

@Component({
  selector: 'app-dashboard-shell',
  host: {
    class: 'dashboard-shell',
    '(document:click)': 'closeSideMenuOnBackdropClick($event)',
    '(document:keydown.escape)': 'closeSideMenuOnEscape()',
  },
  imports: [RouterOutlet, MatButtonModule, MatIconModule, SideNavigationComponent],
  template: `
    <header class="dashboard-header" aria-label="Application header">
      <div class="dashboard-header-left">
        <button
          mat-icon-button
          type="button"
          [attr.aria-label]="isSideMenuOpen() ? 'Close menu' : 'Open menu'"
          [attr.aria-expanded]="isSideMenuOpen()"
          aria-controls="side-menu"
          (click)="toggleSideMenu()"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <span class="dashboard-brand" aria-hidden="true">Opositaria</span>
      </div>
      <div class="dashboard-header-right">
        <button mat-icon-button type="button" aria-label="Notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button type="button" aria-label="Profile">
          <mat-icon>person</mat-icon>
        </button>
      </div>
    </header>

    <div class="dashboard-body">
      <app-dashboard-side-navigation [isOpen]="isSideMenuOpen()" (itemSelected)="closeSideMenu()" />

      <main class="dashboard-content dashboard-content--grow">
        <router-outlet />
      </main>
    </div>

    <footer class="dashboard-footer"></footer>

    @if (isSideMenuOpen()) {
      <div class="side-menu-backdrop"></div>
    }
  `,
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  protected readonly isSideMenuOpen = signal(false);

  protected closeSideMenu(): void {
    this.isSideMenuOpen.set(false);
  }

  protected toggleSideMenu(): void {
    this.isSideMenuOpen.set(!this.isSideMenuOpen());
  }

  protected closeSideMenuOnBackdropClick(event: MouseEvent): void {
    const eventTarget = event.target;

    if (
      !(eventTarget instanceof Element) ||
      !eventTarget.classList.contains('side-menu-backdrop')
    ) {
      return;
    }

    this.closeSideMenu();
  }

  protected closeSideMenuOnEscape(): void {
    this.closeSideMenu();
  }
}
