import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStore } from '../store/dashboard-store.service';
import { StudySpaceFilter, StudySpace } from '../../domain/entities/StudySpace';
import { InMemoryStudySpaceRepository } from '../../domain/repositories/StudySpaceRepository';
import { ListStudySpacesUseCase } from '../../application/ListStudySpacesUseCase';
import { SaveStudySpaceUseCase } from '../../application/SaveStudySpaceUseCase';

@Component({
  selector: 'app-study-spaces-dashboard',
  imports: [RouterOutlet, MatButtonModule, MatIconModule],
  template: `
    <div class="study-spaces-dashboard">
      <header class="dashboard-header" aria-label="Study spaces header">
        <h1 class="dashboard-title">Study spaces</h1>
      </header>

      <main class="dashboard-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .study-spaces-dashboard {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .dashboard-header {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }
    .dashboard-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }
    .dashboard-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }
  `],
})
export class StudySpacesDashboardComponent {
  protected readonly store: DashboardStore;

  constructor() {
    const repository = new InMemoryStudySpaceRepository(StudySpacesDashboardComponent.seedSpaces());
    this.store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );
    this.store.init();
  }

  static seedSpaces(): StudySpace[] {
    return [];
  }
}