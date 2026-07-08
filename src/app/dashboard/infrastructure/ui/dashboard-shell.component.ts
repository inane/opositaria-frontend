import { Component, ElementRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-shell',
  host: {
    class: 'dashboard-shell',
    '(document:click)': 'closeSideMenuOnOutsideClick($event)',
    '(document:keydown.escape)': 'closeSideMenuOnEscape()',
  },
  imports: [RouterOutlet],
  template: `
    <header class="dashboard-header">
      <button
        class="burger-menu-button"
        type="button"
        [attr.aria-label]="isSideMenuOpen() ? 'Close menu' : 'Open menu'"
        [attr.aria-expanded]="isSideMenuOpen()"
        [attr.aria-controls]="isSideMenuOpen() ? 'side-menu' : null"
        (click)="toggleSideMenu()"
      >
        <span class="burger-menu-icon" aria-hidden="true">☰</span>
      </button>
    </header>

    <main class="dashboard-content dashboard-content--grow">
      <router-outlet />
    </main>
    <footer class="dashboard-footer"></footer>

    @if (isSideMenuOpen()) {
      <div class="side-menu-backdrop"></div>
      <aside class="side-menu-panel" role="navigation" aria-label="Side menu" id="side-menu">
        <span class="side-menu-item">Inicio</span>
      </aside>
    }
  `,
  styleUrl: './dashboard-shell.component.css',
})
export class DashboardShellComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly isSideMenuOpen = signal(false);

  protected toggleSideMenu(): void {
    this.isSideMenuOpen.set(!this.isSideMenuOpen());
  }

  protected closeSideMenuOnOutsideClick(event: MouseEvent): void {
    const eventTarget = event.target;
    const panel = this.elementRef.nativeElement.querySelector('.side-menu-panel');
    const menuButton = this.elementRef.nativeElement.querySelector('.burger-menu-button');
    if (
      !(eventTarget instanceof Node) ||
      !panel ||
      !menuButton ||
      panel.contains(eventTarget) ||
      menuButton.contains(eventTarget)
    ) {
      return;
    }
    this.isSideMenuOpen.set(false);
  }

  protected closeSideMenuOnEscape(): void {
    this.isSideMenuOpen.set(false);
  }
}
