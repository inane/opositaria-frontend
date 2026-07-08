import {Component, inject} from '@angular/core';
import {SourceIngestionStore} from '../store/source-ingestion-store.service';

@Component({
  selector: 'app-source-ingestion',
  imports: [],
  template: `
    <section class="source-ingestion">
      <h1>Upload your study source</h1>
      <p>Start building your knowledge base by uploading a PDF from your exam syllabus.</p>
    </section>
  `,
  styleUrl: './source-ingestion.component.css',
})
export class SourceIngestionComponent {
  protected readonly store = inject(SourceIngestionStore);
}
