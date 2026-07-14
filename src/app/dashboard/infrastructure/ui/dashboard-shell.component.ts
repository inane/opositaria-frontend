import { Component, ElementRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSideNavigationComponent } from './side-navigation/dashboard-side-navigation.component';

@Component({
  selector: 'app-dashboard-shell',
  host: {
    class: 'dashboard-shell',
    '(document:click)': 'closeSideMenuOnOutsideClick($event)',
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
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly isSideMenuOpen = signal(false);

  protected closeSideMenu(): void {
    this.isSideMenuOpen.set(false);
  }

  protected toggleSideMenu(): void {
    this.isSideMenuOpen.set(!this.isSideMenuOpen());
  }

  protected closeSideMenuOnOutsideClick(event: MouseEvent): void {
    const eventTarget = event.target;
    const nav = this.elementRef.nativeElement.querySelector('.side-navigation');
    const menuButton = this.elementRef.nativeElement.querySelector('.burger-menu-button');
    if (
      !(eventTarget instanceof Node) ||
      !nav ||
      !menuButton ||
      nav.contains(eventTarget) ||
      menuButton.contains(eventTarget)
    ) {
      return;
    }
    this.closeSideMenu();
  }

  protected closeSideMenuOnEscape(): void {
    this.closeSideMenu();
  }
}
