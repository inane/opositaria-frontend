import {beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SourceIngestionComponent} from './source-ingestion.component';
import {SOURCE_INGESTION_GATEWAY} from '../../application/ports/SourceIngestionGateway';
import {FakeSourceIngestionAdapter} from '../adapters/FakeSourceIngestionAdapter';
import {SourceIngestionStore} from '../store/source-ingestion-store.service';
import {GetSourceIngestionStatusUseCase} from '../../application/GetSourceIngestionStatusUseCase';

describe('The SourceIngestionComponent', () => {
  let fixture: ComponentFixture<SourceIngestionComponent>;
  let store: SourceIngestionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SOURCE_INGESTION_GATEWAY, useClass: FakeSourceIngestionAdapter},
        GetSourceIngestionStatusUseCase,
      ],
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

    expect(input).toBeTruthy();
    expect(input.getAttribute('accept')).toBe('.pdf');
    expect(input.getAttribute('aria-label')).toBe('Select a PDF source file');
  });

  it('displays the selected PDF file name', () => {
    const file = new File(['content'], 'exam.pdf', {type: 'application/pdf'});
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', {value: [file]});
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('exam.pdf');
  });

  it('disables the start action without a selected PDF', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button?.disabled).toBe(true);
  });

  it('shows pending feedback after starting ingestion', async () => {
    const file = new File(['content'], 'exam.pdf', {type: 'application/pdf'});
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', {value: [file]});
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Pending');
  });

  it('updates to processing status without reloading the page', async () => {
    const file = new File(['content'], 'exam.pdf', {type: 'application/pdf'});
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', {value: [file]});
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    fixture.detectChanges();

    await store.refreshStatus();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Processing');
  });
});
