/**
 * Prompt entry points (single map for maintainers).
 *
 * - Transform modes: `@/lib/gemini/prompts` → buildSystemPrompt / buildUserPrompt
 * - Generators: `@/lib/generation/prompts/*` + mode-rules for shared formatting
 */

export {
  buildSystemPrompt,
  buildUserPrompt,
  MODE_TEMPERATURE,
} from "@/lib/gemini/prompts";

export { modeFormattingRules } from "@/lib/generation/prompts/mode-rules";
