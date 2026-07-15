import { Component, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { educationalMenu, NavigationEntry } from '../../../domain/navigation-menu';

@Component({
  selector: 'app-dashboard-side-navigation',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './side-navigation.component.css',
  template: `
    <nav
      class="side-navigation"
      [class.side-navigation--collapsed]="!isOpen()"
      [class.side-navigation--rail]="!isOpen()"
      role="navigation"
      aria-label="Side menu"
      id="side-menu"
    >
      @for (entry of entries; track entry.label) {
        @if (entry.type === 'link') {
          <a
            class="side-navigation-link"
            [routerLink]="entry.path"
            routerLinkActive="active-link"
            ariaCurrentWhenActive="page"
            [routerLinkActiveOptions]="{ exact: true }"
            [attr.aria-label]="entry.label"
            (click)="onItemSelected()"
          >
            <span class="side-navigation-icon" aria-hidden="true">◉</span>
            <span class="side-navigation-label">{{ entry.label }}</span>
          </a>
        } @else {
          <button
            class="side-navigation-group-toggle"
            [class.active-link]="isGroupActive(entry)"
            type="button"
            [attr.aria-expanded]="isExpanded(entry.label)"
            (click)="toggleGroup(entry.label)"
          >
            <span class="side-navigation-icon" aria-hidden="true">▣</span>
            <span class="side-navigation-label">{{ entry.label }}</span>
          </button>
          @if (isExpanded(entry.label)) {
            <div class="side-navigation-group-children">
              @for (child of entry.children; track child.label) {
                <a
                  class="side-navigation-link"
                  [routerLink]="child.path"
                  routerLinkActive="active-link"
                  ariaCurrentWhenActive="page"
                  [attr.aria-label]="child.label"
                  (click)="onItemSelected()"
                >
                  <span class="side-navigation-icon" aria-hidden="true">·</span>
                  <span class="side-navigation-label">{{ child.label }}</span>
                </a>
              }
            </div>
          }
        }
      }
    </nav>
  `,
})
export class SideNavigationComponent {
  readonly isOpen = input(false);
  readonly itemSelected = output<void>();

  private readonly router = inject(Router);
  protected readonly entries: NavigationEntry[] = educationalMenu;
  private readonly expandedGroups = signal<Set<string>>(new Set());

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.expandGroupForUrl(event.url);
      }
    });
    this.expandGroupForUrl(this.router.url);
  }

  protected isGroupActive(entry: NavigationEntry): boolean {
    if (entry.type !== 'group') {
      return false;
    }
    return entry.children.some((child) => this.isRouteWithinPath(this.router.url, child.path));
  }

  protected isExpanded(label: string): boolean {
    return this.expandedGroups().has(label);
  }

  protected toggleGroup(label: string): void {
    const set = new Set(this.expandedGroups());

    if (set.has(label)) {
      set.delete(label);
    } else {
      set.add(label);
    }
    this.expandedGroups.set(set);
  }

  protected onItemSelected(): void {
    this.itemSelected.emit();
  }

  private expandGroupForUrl(url: string): void {
    for (const entry of this.entries) {
      if (
        entry.type === 'group' &&
        entry.children.some((child) => this.isRouteWithinPath(url, child.path))
      ) {
        const set = new Set(this.expandedGroups());
        set.add(entry.label);
        this.expandedGroups.set(set);
      }
    }
  }

  private isRouteWithinPath(url: string, path: string): boolean {
    const [urlPath] = url.split(/[?#]/, 1);

    return urlPath === path || urlPath.startsWith(`${path}/`);
  }
}
