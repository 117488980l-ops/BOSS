export interface JsonCompletionRequest {
  system: string;
  user: string;
  schemaName: string;
}

export interface AiProvider {
  completeJson<T>(request: JsonCompletionRequest): Promise<T>;
}

export class StaticAiProvider<T> implements AiProvider {
  constructor(private readonly response: T) {}

  async completeJson<R>(): Promise<R> {
    return this.response as unknown as R;
  }
}
