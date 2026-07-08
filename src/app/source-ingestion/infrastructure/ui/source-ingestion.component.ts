import {Component, inject} from '@angular/core';
import {SourceIngestionStore} from '../store/source-ingestion-store.service';

@Component({
  selector: 'app-source-ingestion',
  imports: [],
  template: `
    <section class="source-ingestion">
      <h1>Upload your study source</h1>
      <p>Start building your knowledge base by uploading a PDF from your exam syllabus.</p>

      <label for="source-file">Source file</label>
      <input
        id="source-file"
        type="file"
        accept=".pdf"
        aria-label="Select a PDF source file"
        (change)="onFileSelected($event)"
      />

      @if (store.selectedSource(); as source) {
        <p class="selected-source">Selected: {{ source.name }}</p>
      }
    </section>
  `,
  styleUrl: './source-ingestion.component.css',
})
export class SourceIngestionComponent {
  protected readonly store = inject(SourceIngestionStore);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.store.selectSource(file);
    }
  }
}
