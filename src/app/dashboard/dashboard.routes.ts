import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { StudySpacesDashboardComponent } from './infrastructure/ui/study-spaces-dashboard.component';
import { HttpStudySpaceAdapter } from './infrastructure/adapters/HttpStudySpaceAdapter';
import { HttpStudySpaceDetailAdapter } from '../study-spaces/infrastructure/adapters/HttpStudySpaceDetailAdapter';
import { HttpStudySpaceDocumentAdapter } from '../study-spaces/infrastructure/adapters/HttpStudySpaceDocumentAdapter';
import { HttpStudySpaceCopilotAdapter } from '../study-spaces/infrastructure/adapters/HttpStudySpaceCopilotAdapter';
import { STUDY_SPACE_DETAIL_REPOSITORY } from '../study-spaces/infrastructure/tokens/study-space-detail-repository.token';
import { STUDY_SPACE_DOCUMENT_REPOSITORY } from '../study-spaces/infrastructure/tokens/study-space-document-repository.token';
import { STUDY_SPACE_COPILOT_REPOSITORY } from '../study-spaces/infrastructure/tokens/study-space-copilot-repository.token';
import { STUDY_SPACE_DETAIL_STORE } from '../study-spaces/infrastructure/tokens/study-space-detail-store.token';
import { STUDY_SPACE_DOCUMENTS_STORE } from '../study-spaces/infrastructure/tokens/study-space-documents-store.token';
import { STUDY_SPACE_COPILOT_STORE } from '../study-spaces/infrastructure/tokens/study-space-copilot-store.token';
import { DASHBOARD_STORE } from './infrastructure/tokens/dashboard-store.token';
import { DashboardStore } from './infrastructure/store/dashboard-store.service';
import { StudySpaceDetailStore } from '../study-spaces/infrastructure/store/study-space-detail-store.service';
import { StudySpaceDocumentsStore } from '../study-spaces/infrastructure/store/study-space-documents-store.service';
import { StudySpaceCopilotStore } from '../study-spaces/infrastructure/store/study-space-copilot-store.service';
import { ListStudySpacesUseCase } from './application/ListStudySpacesUseCase';
import { SaveStudySpaceUseCase } from './application/SaveStudySpaceUseCase';
import { GetStudySpaceDetailUseCase } from '../study-spaces/application/GetStudySpaceDetailUseCase';
import { ListStudySpaceDocumentsUseCase } from '../study-spaces/application/ListStudySpaceDocumentsUseCase';
import { AddDocumentToStudySpaceUseCase } from '../study-spaces/application/AddDocumentToStudySpaceUseCase';
import { DeleteStudySpaceDocumentUseCase } from '../study-spaces/application/DeleteStudySpaceDocumentUseCase';
import { GetStudySpaceConversationUseCase } from '../study-spaces/application/GetStudySpaceConversationUseCase';
import { SendStudySpaceCopilotMessageUseCase } from '../study-spaces/application/SendStudySpaceCopilotMessageUseCase';
import { ClearStudySpaceConversationUseCase } from '../study-spaces/application/ClearStudySpaceConversationUseCase';
import type { StudySpaceDetailRepository } from '../study-spaces/domain/repositories/StudySpaceDetailRepository';
import type { StudySpaceDocumentRepository } from '../study-spaces/domain/repositories/StudySpaceDocumentRepository';
import type { StudySpaceCopilotRepository } from '../study-spaces/domain/repositories/StudySpaceCopilotRepository';
import type { StudySpaceRepository } from './domain/repositories/StudySpaceRepository';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: StudySpacesDashboardComponent,
    providers: [
      { provide: HttpStudySpaceAdapter, useClass: HttpStudySpaceAdapter },
      {
        provide: DASHBOARD_STORE,
        useFactory: () => {
          const repo = inject<StudySpaceRepository>(HttpStudySpaceAdapter);
          return new DashboardStore(
            new ListStudySpacesUseCase(repo),
            new SaveStudySpaceUseCase(repo),
          );
        },
      },
    ],
    children: [
      {
        path: 'spaces/:spaceId',
        loadComponent: () =>
          import('../study-spaces/infrastructure/ui/study-space-detail-page.component').then(
            (m) => m.StudySpaceDetailPageComponent,
          ),
        providers: [
          { provide: STUDY_SPACE_DETAIL_REPOSITORY, useClass: HttpStudySpaceDetailAdapter },
          { provide: STUDY_SPACE_DOCUMENT_REPOSITORY, useClass: HttpStudySpaceDocumentAdapter },
          { provide: STUDY_SPACE_COPILOT_REPOSITORY, useClass: HttpStudySpaceCopilotAdapter },
          {
            provide: STUDY_SPACE_DETAIL_STORE,
            useFactory: () => {
              const repo = inject<StudySpaceDetailRepository>(STUDY_SPACE_DETAIL_REPOSITORY);
              return new StudySpaceDetailStore(new GetStudySpaceDetailUseCase(repo));
            },
          },
          {
            provide: STUDY_SPACE_DOCUMENTS_STORE,
            useFactory: () => {
              const repo = inject<StudySpaceDocumentRepository>(STUDY_SPACE_DOCUMENT_REPOSITORY);
              return new StudySpaceDocumentsStore(
                new ListStudySpaceDocumentsUseCase(repo),
                new AddDocumentToStudySpaceUseCase(repo),
                new DeleteStudySpaceDocumentUseCase(repo),
              );
            },
          },
          {
            provide: STUDY_SPACE_COPILOT_STORE,
            useFactory: () => {
              const repo = inject<StudySpaceCopilotRepository>(STUDY_SPACE_COPILOT_REPOSITORY);
              return new StudySpaceCopilotStore(
                new GetStudySpaceConversationUseCase(repo),
                new SendStudySpaceCopilotMessageUseCase(repo),
                new ClearStudySpaceConversationUseCase(repo),
              );
            },
          },
        ],
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
