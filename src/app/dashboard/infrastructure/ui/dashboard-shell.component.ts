import { Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DashboardSideNavigationComponent } from './side-navigation/dashboard-side-navigation.component';

interface NavigationItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-dashboard-shell',
  host: {
    class: 'dashboard-shell',
    '(document:click)': 'closeSideMenuOnOutsideClick($event)',
    '(document:keydown.escape)': 'closeSideMenuOnEscape()',
  },
  imports: [RouterLink, RouterOutlet, DashboardSideNavigationComponent],
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
      <app-dashboard-side-navigation [isOpen]="isSideMenuOpen()" />
      <nav
        class="side-navigation"
        [class.side-navigation--collapsed]="!isSideMenuOpen()"
        [class.side-navigation--rail]="!isSideMenuOpen()"
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
            (click)="closeSideMenu()"
          >
            <span class="side-navigation-icon" aria-hidden="true">⌂</span>
            <span class="side-navigation-label">{{ item.label }}</span>
          </a>
        }
      </nav>

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
  protected readonly navigationItems: NavigationItem[] = [
    { label: 'Inicio', path: '/dashboard' },
  ];

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
