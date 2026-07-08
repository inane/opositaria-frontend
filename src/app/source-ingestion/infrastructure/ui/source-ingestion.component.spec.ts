import {beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SourceIngestionComponent} from './source-ingestion.component';
import {SOURCE_INGESTION_GATEWAY} from '../../application/ports/SourceIngestionGateway';
import {FakeSourceIngestionAdapter} from '../adapters/FakeSourceIngestionAdapter';

describe('The SourceIngestionComponent', () => {
  let fixture: ComponentFixture<SourceIngestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SOURCE_INGESTION_GATEWAY, useClass: FakeSourceIngestionAdapter},
      ],
    });
    fixture = TestBed.createComponent(SourceIngestionComponent);
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
});
