import { Component, input, output } from '@angular/core';

@Component({
  selector: 'opo-upload-dropzone',
  template: `
    <div class="dropzone" [class.dropzone-disabled]="disabled()">
      <label class="dropzone-label" for="dropzone-input">{{ label() }}</label>

      @if (description()) {
        <p class="dropzone-description">{{ description() }}</p>
      }

      <input
        id="dropzone-input"
        class="dropzone-input"
        type="file"
        [attr.accept]="accept()"
        [disabled]="disabled()"
        (change)="onFileSelected($event)"
      />
    </div>
  `,
  styleUrl: './upload-dropzone.component.css',
})
export class UploadDropzoneComponent {
  readonly label = input.required<string>();
  readonly description = input('');
  readonly accept = input('');
  readonly disabled = input(false);

  readonly fileSelected = output<File>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.fileSelected.emit(file);
    }
  }
}
