export enum IngestionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

const BACKEND_TO_FRONTEND: Record<string, IngestionStatus> = {
  PENDING_PROCESSING: IngestionStatus.PENDING,
  PROCESSING: IngestionStatus.PROCESSING,
  READY: IngestionStatus.DONE,
  FAILED: IngestionStatus.ERROR,
};

export function fromBackendStatus(
  backendStatus: string,
  failureReason?: string | null,
): { status: IngestionStatus; recoveryMessage: string } {
  const mapped = BACKEND_TO_FRONTEND[backendStatus];

  if (!mapped) {
    return { status: IngestionStatus.ERROR, recoveryMessage: 'Unknown status received' };
  }

  if (mapped === IngestionStatus.ERROR && failureReason) {
    return { status: IngestionStatus.ERROR, recoveryMessage: failureReason };
  }

  return { status: mapped, recoveryMessage: '' };
}
