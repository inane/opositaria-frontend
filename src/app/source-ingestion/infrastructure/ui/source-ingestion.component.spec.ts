import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceIngestionComponent } from './source-ingestion.component';
import { SOURCE_INGESTION_PORT } from '../tokens/source-ingestion-port.token';
import { InMemorySourceIngestionRepository } from '../../domain/repositories/SourceIngestionRepository';
import { SourceIngestionStore } from '../store/source-ingestion-store.service';

function selectFile(fixture: ComponentFixture<SourceIngestionComponent>, file: File): void {
  const input = fixture.nativeElement.querySelector('input[type="file"]');

  Object.defineProperty(input, 'files', { value: [file] });
  input.dispatchEvent(new Event('change'));
  fixture.detectChanges();
}

async function startIngestion(fixture: ComponentFixture<SourceIngestionComponent>): Promise<void> {
  fixture.nativeElement.querySelector('button').click();

  await fixture.whenStable();
  fixture.detectChanges();
}

describe('The SourceIngestionComponent', () => {
  let fixture: ComponentFixture<SourceIngestionComponent>;
  let store: SourceIngestionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SOURCE_INGESTION_PORT, useClass: InMemorySourceIngestionRepository }],
    });
    fixture = TestBed.createComponent(SourceIngestionComponent);
    store = TestBed.inject(SourceIngestionStore);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the source ingestion heading', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Upload your study source');
  });

  it('gives the primary action an accessible name', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button?.textContent?.trim()).toBe('Start ingestion');
    expect(button?.hasAttribute('mat-button')).toBe(true);
  });

  it('renders an accessible PDF file selection control', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]');
    const label = fixture.nativeElement.querySelector('label');

    expect(input).toBeTruthy();
    expect(input.getAttribute('accept')).toBe('.pdf');
    expect(label).toBeTruthy();
    expect(input.id).toBe(label.getAttribute('for'));
  });

  it('displays the selected PDF file name', () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });

    selectFile(fixture, file);

    expect(fixture.nativeElement.textContent).toContain('exam.pdf');
  });

  it('displays a validation message when a non-PDF file is selected', () => {
    const file = new File(['content'], 'exam.txt', { type: 'text/plain' });

    selectFile(fixture, file);

    expect(fixture.nativeElement.textContent).toContain('Only PDF files are supported');
  });

  it('announces validation feedback through an alert region', () => {
    const file = new File(['content'], 'exam.txt', { type: 'text/plain' });

    selectFile(fixture, file);

    const alert = fixture.nativeElement.querySelector('[role="alert"]');

    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Only PDF files are supported');
  });

  it('disables the start action without a selected PDF', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button?.disabled).toBe(true);
  });

  it('shows pending feedback after starting ingestion', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    selectFile(fixture, file);

    await startIngestion(fixture);

    expect(fixture.nativeElement.textContent).toContain('Pending');
  });

  it('announces ingestion status through a polite live region', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    selectFile(fixture, file);

    await startIngestion(fixture);

    const status = fixture.nativeElement.querySelector('[role="status"]');

    expect(status).toBeTruthy();
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toContain('Pending');
  });

  it('displays processing status after refreshing the job', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    selectFile(fixture, file);
    await startIngestion(fixture);

    await store.refreshStatus();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Processing');
  });

  it('shows done feedback when ingestion completes', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    selectFile(fixture, file);
    await startIngestion(fixture);

    await store.refreshStatus();
    await store.refreshStatus();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Done');
  });

  it('shows error feedback with a recovery path when ingestion fails', async () => {
    const file = new File(['content'], 'error-exam.pdf', { type: 'application/pdf' });
    selectFile(fixture, file);
    await startIngestion(fixture);

    await store.refreshStatus();
    await store.refreshStatus();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Error');

    const retryButton = fixture.nativeElement.querySelector('[data-testid="retry-ingestion"]');

    expect(retryButton).toBeTruthy();
    expect(retryButton.textContent?.trim()).toBe('Try again');
  });

  it('does not show study actions while ingestion is pending', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    selectFile(fixture, file);
    await startIngestion(fixture);

    const chatAction = fixture.nativeElement.querySelector('[data-testid="action-chat"]');
    const summaryAction = fixture.nativeElement.querySelector('[data-testid="action-summary"]');

    expect(chatAction).toBeNull();
    expect(summaryAction).toBeNull();
  });

  it('shows future study action placeholders when ingestion is done', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    selectFile(fixture, file);
    await startIngestion(fixture);

    await store.refreshStatus();
    await store.refreshStatus();
    fixture.detectChanges();

    const chatAction = fixture.nativeElement.querySelector('[data-testid="action-chat"]');
    const summaryAction = fixture.nativeElement.querySelector('[data-testid="action-summary"]');
    const testAction = fixture.nativeElement.querySelector('[data-testid="action-test"]');
    const planAction = fixture.nativeElement.querySelector('[data-testid="action-plan"]');
    const recommendationsAction = fixture.nativeElement.querySelector(
      '[data-testid="action-recommendations"]',
    );

    expect(chatAction).toBeTruthy();
    expect(summaryAction).toBeTruthy();
    expect(testAction).toBeTruthy();
    expect(planAction).toBeTruthy();
    expect(recommendationsAction).toBeTruthy();
    expect(chatAction?.disabled).toBe(true);
    expect(summaryAction?.disabled).toBe(true);
    expect(testAction?.disabled).toBe(true);
    expect(planAction?.disabled).toBe(true);
    expect(recommendationsAction?.disabled).toBe(true);
  });
});
