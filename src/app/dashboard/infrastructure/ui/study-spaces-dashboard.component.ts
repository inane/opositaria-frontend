import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { DashboardStore } from '../store/dashboard-store.service';
import { StudySpaceFilter, StudySpace } from '../../domain/entities/StudySpace';
import { InMemoryStudySpaceRepository } from '../../domain/repositories/StudySpaceRepository';
import { ListStudySpacesUseCase } from '../../application/ListStudySpacesUseCase';
import { SaveStudySpaceUseCase } from '../../application/SaveStudySpaceUseCase';

@Component({
  selector: 'app-study-spaces-dashboard',
  imports: [MatButtonModule, MatIconModule, RouterOutlet],
  template: `
    <div class="study-spaces-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="dashboard-header-left">
          <span class="dashboard-brand" aria-hidden="true">Opositaria</span>
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
            [class.dashboard-tab--active]="activeFilter() === 'all'"
            role="tab"
            [attr.aria-selected]="activeFilter() === 'all'"
            (click)="store.setFilter('all')"
          >
            All
          </button>
          <button
            class="dashboard-tab"
            [class.dashboard-tab--active]="activeFilter() === 'owned'"
            role="tab"
            [attr.aria-selected]="activeFilter() === 'owned'"
            (click)="store.setFilter('owned')"
          >
            My spaces
          </button>
          <button
            class="dashboard-tab"
            [class.dashboard-tab--active]="activeFilter() === 'featured'"
            role="tab"
            [attr.aria-selected]="activeFilter() === 'featured'"
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
      <main class="dashboard-content">
        @if (store.isCreateFlowOpen()) {
          <router-outlet />
        } @else if (emptyStateMessage(); as msg) {
          <div class="dashboard-empty">
            <mat-icon class="dashboard-empty-icon" aria-hidden="true">folder_open</mat-icon>
            <p class="dashboard-empty-text">{{ msg }}</p>
            @if (msg.startsWith('No study spaces')) {
              <button mat-stroked-button type="button" (click)="store.openCreateFlow()">
                <mat-icon aria-hidden="true">add</mat-icon>
                Create new
              </button>
            }
          </div>
        } @else {
          <div class="dashboard-grid">
            @for (space of store.visibleSpaces(); track space.id) {
              <div class="space-card" tabindex="0" role="article" [attr.aria-label]="space.title">
                <div class="space-card-visual" aria-hidden="true">
                  <mat-icon>description</mat-icon>
                </div>
                <div class="space-card-body">
                  <h3 class="space-card-title">{{ space.title }}</h3>
                  <p class="space-card-meta">{{ space.sourceCountLabel }}</p>
                </div>
              </div>
            }
          </div>
        }
      </main>
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
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.2s;
      outline: none;
    }
    .space-card:hover,
    .space-card:focus-visible {
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
export class StudySpacesDashboardComponent {
  readonly store: DashboardStore;

  constructor() {
    const repository = new InMemoryStudySpaceRepository(StudySpacesDashboardComponent.seedSpaces());
    this.store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );
    this.store.init();
  }

  protected readonly emptyStateMessage = () => this.store.emptyStateReason();
  protected readonly activeFilter = () => this.store.activeFilter();

  static seedSpaces(): StudySpace[] {
    return [];
  }
}