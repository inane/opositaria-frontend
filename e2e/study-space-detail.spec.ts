import { test, expect, Page } from '@playwright/test';

const now = '2026-07-17T10:00:00.000Z';

async function authenticate(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem('opositaria_token', 'test-token');
  });
}

async function mockStudySpaceApis(page: Page): Promise<void> {
  // Conversation: POST messages (specific first)
  await page.route('**/study-spaces/space-ready/conversation/messages', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        messages: [
          { id: 'msg-1', role: 'user', content: 'What should I study?', created_at: now },
          { id: 'msg-2', role: 'assistant', content: 'Review administrative law.', created_at: now },
          { id: 'msg-3', role: 'user', content: 'What is next?', created_at: now },
          { id: 'msg-4', role: 'assistant', content: 'Practice exam questions.', created_at: now },
        ],
      }),
    });
  });

  // Conversation: GET history / DELETE clear (methods split explicitly)
  let conversationMessages = [
    { id: 'msg-1', role: 'user', content: 'What should I study?', created_at: now },
    { id: 'msg-2', role: 'assistant', content: 'Review administrative law.', created_at: now },
  ];

  await page.route('**/study-spaces/space-ready/conversation', async (route) => {
    const method = route.request().method();

    if (method === 'DELETE') {
      conversationMessages = [];
      await route.fulfill({ status: 204 });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ messages: conversationMessages }),
    });
  });

  // Processing space: conversation
  await page.route('**/study-spaces/space-processing/conversation', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ messages: [] }) });
  });

  // Documents: DELETE specific doc
  let spaceReadyDocs = [
    { id: 'doc-ready', filename: 'Administrative law.pdf', status: 'ready', chunks_count: 12, created_at: now, updated_at: now },
  ];

  await page.route('**/study-spaces/space-ready/documents/doc-ready', async (route) => {
    if (route.request().method() === 'DELETE') {
      spaceReadyDocs = [];
      await route.fulfill({ status: 204 });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(spaceReadyDocs),
    });
  });

  // Documents: GET list
  await page.route('**/study-spaces/space-ready/documents', async (route) => {
    if (route.request().method() === 'POST') {
      spaceReadyDocs = [
        ...spaceReadyDocs,
        {
          id: 'new-doc-789',
          filename: 'Constitutional law.pdf',
          status: 'ready',
          chunks_count: 9,
          created_at: now,
          updated_at: now,
        },
      ];
      await route.fulfill({ status: 204 });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(spaceReadyDocs),
    });
  });

  // Processing space: documents
  await page.route('**/study-spaces/space-processing/documents', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'doc-pending', filename: 'Pending notes.pdf', status: 'pending', chunks_count: 0, created_at: now, updated_at: now },
      ]),
    });
  });

  // Missing space: 404
  await page.route('**/study-spaces/missing-space**', async (route) => {
    await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ detail: 'Not found' }) });
  });

  // Space detail: ready
  await page.route('**/study-spaces/space-ready', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'space-ready', name: 'Administrative Law', document_count: 1, created_at: now }),
    });
  });

  // Space detail: processing
  await page.route('**/study-spaces/space-processing', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'space-processing', name: 'Processing Space', document_count: 1, created_at: now }),
    });
  });

  // Dashboard list
  await page.route('**/study-spaces', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'space-ready', name: 'Administrative Law', document_count: 1, created_at: now },
        { id: 'space-processing', name: 'Processing Space', document_count: 1, created_at: now },
      ]),
    });
  });

  // Source ingestion: upload
  await page.route('**/study-documents/upload', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ document_id: 'new-doc-789', status: 'pending' }),
    });
  });

  // Source ingestion: poll status (transitions PENDING → PROCESSING → DONE)
  let statusCalls = 0;
  await page.route('**/study-documents/*/status', async (route) => {
    statusCalls++;
    let status = 'PENDING';
    if (statusCalls >= 4) {
      status = 'DONE';
    } else if (statusCalls >= 2) {
      status = 'PROCESSING';
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        document_id: 'new-doc-789',
        filename: 'Constitutional law.pdf',
        status,
        failure_reason: null,
        chunks_count: status === 'DONE' ? 9 : 0,
      }),
    });
  });
}

test.describe('Study Space Detail Journey', () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
    await mockStudySpaceApis(page);
  });

  test('dashboard card navigates to study space detail', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('link', { name: 'Administrative Law' }).click();

    await expect(page).toHaveURL(/\/dashboard\/spaces\/space-ready/);
    await expect(page.locator('app-study-space-detail-page').getByRole('heading', { name: 'Administrative Law' })).toBeVisible();
    await expect(page.getByText('Administrative law.pdf')).toBeVisible();
  });

  test('direct detail route loads owned space with documents and copilot history', async ({ page }) => {
    await page.goto('/dashboard/spaces/space-ready');

    await expect(page.locator('app-study-space-detail-page').getByRole('heading', { name: 'Administrative Law' })).toBeVisible();
    await expect(page.getByText('Administrative law.pdf')).toBeVisible();
    await expect(page.getByText('Review administrative law.')).toBeVisible();
  });

  test('foreign or missing space shows a safe error', async ({ page }) => {
    await page.goto('/dashboard/spaces/missing-space');

    await expect(page.getByRole('heading', { name: 'Study space not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return to dashboard' })).toBeVisible();
  });

  test('processing or pending documents block copilot input', async ({ page }) => {
    await page.goto('/dashboard/spaces/space-processing');

    await expect(page.getByText('Pending notes.pdf')).toBeVisible();
    await expect(page.getByText('Documents are processing. Copilot will be available shortly.')).toBeVisible();
    await expect(page.getByLabel('Ask copilot a question')).toBeDisabled();
  });

  test('loads copilot history and sends a message', async ({ page }) => {
    await page.goto('/dashboard/spaces/space-ready');

    const input = page.getByLabel('Ask copilot a question');
    await expect(input).toBeEnabled();
    await input.fill('What is next?');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Practice exam questions.')).toBeVisible();
  });

  test('clears copilot conversation after confirmation', async ({ page }) => {
    await page.goto('/dashboard/spaces/space-ready');

    await expect(page.getByText('Review administrative law.')).toBeVisible();

    // First click opens confirmation dialog
    await page.getByRole('button', { name: 'Clear conversation' }).click();
    await expect(page.getByText('This removes the visible copilot history')).toBeVisible();

    // Second click (inside dialog) confirms clear
    await page.getByRole('button', { name: 'Clear conversation' }).last().click();

    // Wait for conversation to clear and empty state to appear
    await expect(page.getByText('No conversation yet. Start chatting with your study copilot.')).toBeVisible();
    await expect(page.getByText('Review administrative law.')).not.toBeVisible();
  });

  test('deletes a document after confirmation', async ({ page }) => {
    await page.goto('/dashboard/spaces/space-ready');

    await expect(page.getByText('Administrative law.pdf')).toBeVisible();

    await page.getByRole('button', { name: 'Delete Administrative law.pdf' }).click();
    await expect(page.getByText('will be removed from this study space')).toBeVisible();

    await page.getByRole('button', { name: 'Delete document' }).last().click();

    await expect(page.getByText('Administrative law.pdf')).not.toBeVisible();
  });

  test('deletes last document and shows empty copilot state', async ({ page }) => {
    await page.goto('/dashboard/spaces/space-ready');

    await expect(page.getByText('Administrative law.pdf')).toBeVisible();

    await page.getByRole('button', { name: 'Delete Administrative law.pdf' }).click();
    await page.getByRole('button', { name: 'Delete document' }).last().click();

    await expect(page.getByText('No documents yet')).toBeVisible();
    await expect(page.getByText('Add documents before asking questions.')).toBeVisible();
  });

  test('adds a document through upload process and association', async ({ page }) => {
    await page.goto('/dashboard/spaces/space-ready');

    await expect(page.getByText('Administrative law.pdf')).toBeVisible();

    // Click "Add document" to open upload area
    await page.getByRole('button', { name: 'Add document' }).click();
    await expect(page.getByText('Cancel')).toBeVisible();

    // Upload a file via the hidden input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'Constitutional law.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-pdf-content'),
    });

    // Start ingestion
    await page.getByRole('button', { name: 'Start ingestion' }).click();

    // Wait for processing and association to complete
    await expect(page.getByText('Constitutional law.pdf')).toBeVisible({ timeout: 15000 });
  });
});
