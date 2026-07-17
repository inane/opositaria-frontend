import { StudySpaceDetail } from './StudySpaceDetail';

describe('The StudySpaceDetail', () => {
  it('creates a valid owned space detail with id, title, document count, and creation date', () => {
    const createdAt = new Date('2026-07-15T10:30:00Z');

    const detail = StudySpaceDetail.create({
      id: 'space-123',
      title: 'My Study Space',
      documentCount: 3,
      createdAt,
    });

    expect(detail.id).toBe('space-123');
    expect(detail.title).toBe('My Study Space');
    expect(detail.documentCount).toBe(3);
    expect(detail.createdAt).toBe(createdAt);
  });

  it('generates a UUID when no id is provided', () => {
    const detail = StudySpaceDetail.create({
      title: 'Generated Space',
      documentCount: 0,
    });

    expect(detail.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('defaults createdAt to current date when not provided', () => {
    const before = new Date();

    const detail = StudySpaceDetail.create({
      title: 'Recent Space',
      documentCount: 1,
    });

    const after = new Date();

    expect(detail.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(detail.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('rejects blank titles', () => {
    expect(() =>
      StudySpaceDetail.create({ title: '', documentCount: 1 }),
    ).toThrow('Study space title must not be empty');
  });

  it('rejects titles with only whitespace', () => {
    expect(() =>
      StudySpaceDetail.create({ title: '   ', documentCount: 1 }),
    ).toThrow('Study space title must not be empty');
  });

  it('allows zero documents', () => {
    const detail = StudySpaceDetail.create({
      title: 'Empty Space',
      documentCount: 0,
    });

    expect(detail.documentCount).toBe(0);
  });
});
