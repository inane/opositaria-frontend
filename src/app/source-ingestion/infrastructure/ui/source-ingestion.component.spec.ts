import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceIngestionComponent } from './source-ingestion.component';
import { SOURCE_INGESTION_PORT } from '../tokens/source-ingestion-port.token';
import { InMemorySourceIngestionRepository } from '../../domain/repositories/SourceIngestionRepository';
import { SourceIngestionStore } from '../store/source-ingestion-store.service';

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
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('exam.pdf');
  });

  it('displays a validation message when a non-PDF file is selected', () => {
    const file = new File(['content'], 'exam.txt', { type: 'text/plain' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Only PDF files are supported');
  });

  it('disables the start action without a selected PDF', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button?.disabled).toBe(true);
  });

  it('shows pending feedback after starting ingestion', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Pending');
  });

  it('updates to processing status without reloading the page', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    await store.refreshStatus();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Processing');
  });

  it('shows done feedback when ingestion completes', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    await store.refreshStatus();
    await store.refreshStatus();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Done');
  });

  it('shows error feedback with a recovery path when ingestion fails', async () => {
    const file = new File(['content'], 'error-exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    await store.refreshStatus();
    await store.refreshStatus();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Error');

    const retryButton = fixture.nativeElement.querySelector('[data-testid="retry-ingestion"]');

    expect(retryButton).toBeTruthy();
  });

  it('does not show study actions while ingestion is pending', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    const chatAction = fixture.nativeElement.querySelector('[data-testid="action-chat"]');
    const summaryAction = fixture.nativeElement.querySelector('[data-testid="action-summary"]');

    expect(chatAction).toBeNull();
    expect(summaryAction).toBeNull();
  });

  it('announces ingestion status for assistive technologies', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[aria-live="polite"]');

    expect(status).toBeTruthy();
    expect(status.textContent).toContain('Pending');
  });

  it('shows future study action placeholders when ingestion is done', async () => {
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    await store.refreshStatus();
    await store.refreshStatus();
    fixture.detectChanges();

    const chatAction = fixture.nativeElement.querySelector('[data-testid="action-chat"] button');
    const summaryAction = fixture.nativeElement.querySelector('[data-testid="action-summary"] button');
    const testAction = fixture.nativeElement.querySelector('[data-testid="action-test"] button');
    const planAction = fixture.nativeElement.querySelector('[data-testid="action-plan"] button');
    const recommendationsAction = fixture.nativeElement.querySelector(
      '[data-testid="action-recommendations"] button',
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
