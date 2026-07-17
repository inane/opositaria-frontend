import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStore } from '../store/dashboard-store.service';
import { DASHBOARD_STORE } from '../tokens/dashboard-store.token';
import { SourceIngestionComponent } from '../../../source-ingestion/infrastructure/ui/source-ingestion.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-study-spaces-dashboard',
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterOutlet, SourceIngestionComponent],
  template: `
    <div class="study-spaces-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="dashboard-header-left">
          <h1 class="dashboard-title">Opositaria</h1>
        </div>
        <div class="dashboard-header-right">
          <button mat-icon-button type="button" aria-label="Notifications">
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button type="button" aria-label="Profile">
            <mat-icon>account_circle</mat-icon>
          </button>
        </div>
      </header>

      <!-- Main toolbar -->
      <div class="dashboard-toolbar">
        <div class="dashboard-tabs" role="tablist" aria-label="Study space filters">
          <button
            class="dashboard-tab"
            [class.dashboard-tab--active]="activeFilter === 'all'"
            role="tab"
            [attr.aria-selected]="activeFilter === 'all'"
            (click)="store.setFilter('all')"
          >
            All
          </button>
          <button
            class="dashboard-tab"
            [class.dashboard-tab--active]="activeFilter === 'owned'"
            role="tab"
            [attr.aria-selected]="activeFilter === 'owned'"
            (click)="store.setFilter('owned')"
          >
            My spaces
          </button>
          <button
            class="dashboard-tab"
            [class.dashboard-tab--active]="activeFilter === 'featured'"
            role="tab"
            [attr.aria-selected]="activeFilter === 'featured'"
            (click)="store.setFilter('featured')"
          >
            Featured
          </button>
        </div>

        <div class="dashboard-toolbar-actions">
          <div class="dashboard-search">
            <mat-icon class="dashboard-search-icon" aria-hidden="true">search</mat-icon>
            <input
              class="dashboard-search-input"
              type="search"
              placeholder="Search study spaces..."
              aria-label="Search study spaces"
              (input)="store.setSearchTerm($any($event.target).value)"
            />
          </div>
          <button mat-stroked-button type="button" class="create-button" (click)="store.openCreateFlow()">
            <mat-icon aria-hidden="true">add</mat-icon>
            Create new
          </button>
        </div>
      </div>

      <!-- Main content area -->
      @if (!hasActiveChild()) {
        <main class="dashboard-content">
          @if (store.isCreateFlowOpen()) {
            @if (store.pendingSaveState(); as pendingSave) {
              <section class="save-space-panel" aria-labelledby="save-space-title">
                <h2 id="save-space-title">Save study space</h2>
                <p>{{ pendingSave.uploadedSourceCount }} source ready.</p>
                <label class="space-name-label" for="study-space-name">Study space name</label>
                <input
                  id="study-space-name"
                  class="space-name-input"
                  #spaceName
                  type="text"
                  placeholder="My study space"
                />
                @if (store.saveValidationMessage(); as validationMessage) {
                  <p role="alert" class="validation-message">{{ validationMessage }}</p>
                }
                <div class="save-space-actions">
                  <button mat-stroked-button type="button" (click)="store.skipSaving()">Skip saving</button>
                  <button mat-flat-button type="button" (click)="saveAndNavigate(spaceName.value)">
                    Save study space
                  </button>
                </div>
              </section>
            } @else {
              <app-source-ingestion (sourceIngested)="store.recordUploadedSources($event.sourceCount, $event.documentIds)" />
              <button mat-button type="button" (click)="store.cancelCreation()">Cancel creation</button>
            }
          } @else if (emptyStateMessage; as message) {
            <div class="dashboard-empty">
              <mat-icon class="dashboard-empty-icon" aria-hidden="true">folder_open</mat-icon>
              <p class="dashboard-empty-text">{{ message }}</p>
              @if (message.startsWith('No study spaces')) {
                <button mat-stroked-button type="button" (click)="store.openCreateFlow()">
                  <mat-icon aria-hidden="true">add</mat-icon>
                  Create new
                </button>
              }
            </div>
          } @else {
            <div class="dashboard-grid">
              @for (space of store.visibleSpaces(); track space.id) {
                <a
                  class="space-card"
                  [attr.aria-label]="space.title"
                  [routerLink]="['/dashboard/spaces', space.id]"
                >
                  <div class="space-card-visual" aria-hidden="true">
                    <mat-icon>description</mat-icon>
                  </div>
                  <div class="space-card-body">
                    <h3 class="space-card-title">{{ space.title }}</h3>
                    <p class="space-card-meta">{{ space.sourceCountLabel }}</p>
                  </div>
                </a>
              }
            </div>
          }
        </main>
      } @else {
        <router-outlet />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f9fafb;
    }
    .study-spaces-dashboard {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    /* Header */
    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1.5rem;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
    }
    .dashboard-brand {
      font-size: 1.125rem;
      font-weight: 600;
    }
    .dashboard-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
    .dashboard-header-right {
      display: flex;
      gap: 0.25rem;
    }
    /* Toolbar */
    .dashboard-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
    }
    .dashboard-tabs {
      display: flex;
      gap: 0.25rem;
    }
    .dashboard-tab {
      background: none;
      border: none;
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    .dashboard-tab:hover {
      background: #f3f4f6;
      color: #374151;
    }
    .dashboard-tab--active {
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 600;
    }
    .dashboard-toolbar-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .dashboard-search {
      display: flex;
      align-items: center;
      background: #f3f4f6;
      border-radius: 8px;
      padding: 0.375rem 0.75rem;
      gap: 0.375rem;
    }
    .dashboard-search-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #9ca3af;
    }
    .dashboard-search-input {
      border: none;
      background: none;
      outline: none;
      font-size: 0.875rem;
      min-width: 160px;
      font-family: inherit;
    }
    .create-button {
      white-space: nowrap;
    }
    /* Content area */
    .dashboard-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }
    /* Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }
    /* Cards */
    .space-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      transition: box-shadow 0.2s, transform 0.2s;
      text-decoration: none;
      color: inherit;
    }
    .space-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      transform: translateY(-2px);
    }
    .space-card-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      background: linear-gradient(135deg, #dbeafe, #ede9fe);
      color: #6366f1;
    }
    .space-card-visual mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }
    .space-card-body {
      padding: 0.75rem 1rem;
    }
    .space-card-title {
      font-size: 0.9375rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #111827;
    }
    .space-card-meta {
      font-size: 0.8125rem;
      color: #6b7280;
      margin: 0;
    }
    /* Empty state */
    .dashboard-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 1rem;
      text-align: center;
    }
    .dashboard-empty-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #d1d5db;
      margin-bottom: 1rem;
    }
    .dashboard-empty-text {
      font-size: 1rem;
      color: #6b7280;
      margin: 0 0 1.5rem;
    }
    .save-space-panel {
      max-width: 34rem;
      padding: 1.5rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .space-name-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .space-name-input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font: inherit;
    }
    .validation-message {
      color: #b91c1c;
    }
    .save-space-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .dashboard-toolbar-actions {
        flex-direction: column;
      }
      .dashboard-search {
        width: 100%;
      }
      .dashboard-search-input {
        width: 100%;
      }
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class StudySpacesDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  readonly store = inject(DASHBOARD_STORE);
  readonly hasActiveChild = signal(false);

  ngOnInit(): void {
    this.hasActiveChild.set(this.router.url !== '/dashboard');
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.hasActiveChild.set(event.urlAfterRedirects !== '/dashboard');
      });
    void this.store.init();
  }

  protected get emptyStateMessage() { return this.store.emptyStateReason(); }
  protected get activeFilter() { return this.store.activeFilter(); }

  async saveAndNavigate(name: string): Promise<void> {
    const createdId = await this.store.savePendingSpace(name);
    if (createdId) {
      void this.router.navigate(['/dashboard/spaces', createdId]);
    }
  }
}
