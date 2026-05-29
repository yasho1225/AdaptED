import type { ContentBlock } from "@/lib/types";
import type { AssignmentInput } from "@/lib/generation/types";
import { buildAssignmentSourceText } from "@/lib/generation/build-assignment-text";
import { transformLocally } from "@/lib/local-transform";

export function generateAssignmentLocal(input: AssignmentInput): ContentBlock[] {
  const raw = buildAssignmentSourceText(input);
  return transformLocally(raw, input.mode).blocks;
}
