import type { RagSnapshot } from "../types";
import { EmptyRagProvider, type RagProvider, type RagRetrieveRequest } from "./ragProvider";

export async function retrieveKnowledge(
  request: RagRetrieveRequest,
  provider: RagProvider = new EmptyRagProvider()
): Promise<RagSnapshot> {
  const snapshot = await provider.retrieve(request);
  return {
    ...snapshot,
    provider: snapshot.provider || provider.name,
    chunks: snapshot.chunks ?? [],
    retrievedAt: snapshot.retrievedAt || new Date().toISOString()
  };
}
