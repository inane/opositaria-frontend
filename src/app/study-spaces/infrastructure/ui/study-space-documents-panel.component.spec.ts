import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { StudySpaceDocument } from '../../domain/entities/StudySpaceDocument';
import { StudySpaceDocumentsPanelComponent } from './study-space-documents-panel.component';
import { SOURCE_INGESTION_PORT } from '../../../source-ingestion/infrastructure/tokens/source-ingestion-port.token';

class FakeSourceIngestionRepository {
  async start() { return { jobId: 'fake', status: 'PENDING' }; }
  async status() { return { jobId: 'fake', status: 'DONE', documentId: 'fake-doc' }; }
}

describe('StudySpaceDocumentsPanelComponent', () => {
  function render(documents: StudySpaceDocument[] = []): ComponentFixture<StudySpaceDocumentsPanelComponent> {
    const fixture = TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SOURCE_INGESTION_PORT, useClass: FakeSourceIngestionRepository },
      ],
    }).createComponent(StudySpaceDocumentsPanelComponent);
    fixture.componentRef.setInput('documents', documents);
    fixture.detectChanges();
    return fixture;
  }

  it('lists document filename and status', () => {
    const fixture = render([
      StudySpaceDocument.create({ id: 'doc-1', filename: 'Civil law.pdf', status: 'ready', chunksCount: 8 }),
    ]);

    expect(fixture.nativeElement.textContent).toContain('Civil law.pdf');
    expect(fixture.nativeElement.textContent).toContain('ready');
  });

  it('shows a delete button with an accessible label per document', () => {
    const fixture = render([
      StudySpaceDocument.create({ id: 'doc-1', filename: 'Civil law.pdf', status: 'ready', chunksCount: 8 }),
    ]);

    const button = fixture.nativeElement.querySelector('button[aria-label="Delete Civil law.pdf"]');

    expect(button).not.toBeNull();
  });

  it('asks for confirmation before emitting a delete request', () => {
    const fixture = render([
      StudySpaceDocument.create({ id: 'doc-1', filename: 'Civil law.pdf', status: 'ready', chunksCount: 8 }),
    ]);
    const emitSpy = vi.spyOn(fixture.componentInstance.deleteDocument, 'emit');

    fixture.nativeElement.querySelector('button[aria-label="Delete Civil law.pdf"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Civil law.pdf will be removed');
    expect(emitSpy).not.toHaveBeenCalled();

    fixture.nativeElement.querySelector('.confirm-button').click();

    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 'doc-1' }));
  });

  it('cancels document deletion without emitting', () => {
    const fixture = render([
      StudySpaceDocument.create({ id: 'doc-1', filename: 'Civil law.pdf', status: 'ready', chunksCount: 8 }),
    ]);
    const emitSpy = vi.spyOn(fixture.componentInstance.deleteDocument, 'emit');

    fixture.nativeElement.querySelector('button[aria-label="Delete Civil law.pdf"]').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.cancel-button').click();
    fixture.detectChanges();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows an add document button when not loading', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelector('.add-button')).not.toBeNull();
  });

  it('toggles upload area when add document is clicked', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelector('.upload-area')).toBeNull();

    fixture.nativeElement.querySelector('.add-button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.upload-area')).not.toBeNull();

    fixture.nativeElement.querySelector('.cancel-upload-button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.upload-area')).toBeNull();
  });

  it('emits addDocument with document ID when ingestion completes', () => {
    const fixture = render();
    const emitSpy = vi.spyOn(fixture.componentInstance.addDocument, 'emit');

    fixture.componentInstance.handleDocumentIngested({ sourceCount: 1, documentIds: ['new-doc-123'] });

    expect(emitSpy).toHaveBeenCalledWith('new-doc-123');
  });

  it('shows empty state when documents list becomes empty after deletion', () => {
    const fixture = render([
      StudySpaceDocument.create({ id: 'doc-1', filename: 'Last.pdf', status: 'ready', chunksCount: 4 }),
    ]);

    expect(fixture.nativeElement.textContent).toContain('Last.pdf');

    fixture.componentRef.setInput('documents', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No documents yet');
    expect(fixture.nativeElement.textContent).not.toContain('Last.pdf');
  });
});
