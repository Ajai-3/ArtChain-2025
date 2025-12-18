export interface ISupportEventHandler {
  handle(event: any): Promise<void>;
}
