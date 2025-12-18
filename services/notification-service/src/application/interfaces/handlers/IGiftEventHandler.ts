export interface IGiftEventHandler {
  handle(event: any): Promise<void>;
}
