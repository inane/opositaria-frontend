import { describe, expect, it } from 'vitest';
import {
  AlertComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  PageHeaderComponent,
  PageSectionComponent,
  StatusPanelComponent,
  UploadDropzoneComponent,
} from './index';

describe('The shared UI public API', () => {
  it('exports all shared UI components', () => {
    expect(ButtonComponent).toBeDefined();
    expect(CardComponent).toBeDefined();
    expect(AlertComponent).toBeDefined();
    expect(BadgeComponent).toBeDefined();
    expect(StatusPanelComponent).toBeDefined();
    expect(UploadDropzoneComponent).toBeDefined();
    expect(PageHeaderComponent).toBeDefined();
    expect(PageSectionComponent).toBeDefined();
  });
});
