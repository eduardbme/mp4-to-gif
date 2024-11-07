export interface Context {
  env: string;
  messageId: string;
  requestId?: string;
  sequenceId: number;
  pid: number;
}
