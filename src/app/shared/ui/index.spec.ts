import { describe, expect, it } from 'vitest';
import {
  PageHeaderComponent,
  PageSectionComponent,
  StatusPanelComponent,
  UploadDropzoneComponent,
} from './index';

describe('The shared UI public API', () => {
  it('exports the reusable shared UI components', () => {
    expect(StatusPanelComponent).toBeDefined();
    expect(UploadDropzoneComponent).toBeDefined();
    expect(PageHeaderComponent).toBeDefined();
    expect(PageSectionComponent).toBeDefined();
  });
});
