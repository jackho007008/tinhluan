/** Package 2.3 retires the free Astra outbox. Existing files/jobs are immutable;
 * reopening or scanning never backfills a new job. Keep the entry point for
 * legacy operational callers without consuming their historical backlog. */
export async function reconcileAiOutbox() {
  return 0;
}
