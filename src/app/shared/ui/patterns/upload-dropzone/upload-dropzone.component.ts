import { Component, input, output } from '@angular/core';

let nextUploadDropzoneId = 0;

@Component({
  selector: 'opo-upload-dropzone',
  template: `
    <div class="dropzone" [class.dropzone-disabled]="disabled()">
      <label class="dropzone-label" [attr.for]="inputId">{{ label() }}</label>

      @if (description()) {
        <p [attr.id]="descriptionId" class="dropzone-description">{{ description() }}</p>
      }

      <input
        [id]="inputId"
        class="dropzone-input"
        type="file"
        [attr.accept]="accept()"
        [attr.aria-describedby]="description() ? descriptionId : null"
        [disabled]="disabled()"
        (change)="onFileSelected($event)"
      />
    </div>
  `,
  styleUrl: './upload-dropzone.component.css',
})
export class UploadDropzoneComponent {
  private readonly instanceId = nextUploadDropzoneId++;
  protected readonly inputId = `dropzone-input-${this.instanceId}`;
  protected readonly descriptionId = `dropzone-description-${this.instanceId}`;

  readonly label = input.required<string>();
  readonly description = input('');
  readonly accept = input('');
  readonly disabled = input(false);

  readonly fileSelected = output<File>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.fileSelected.emit(file);
  }
}
