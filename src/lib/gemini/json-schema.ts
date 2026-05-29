export const BLOCK_JSON_SCHEMA = `Output ONLY valid JSON (no markdown fences):
{"blocks":[{"type":"title|chunk|key|step|bullet|caption|describe|note","text":"string"}]}

Global rules:
- Plain text in "text" fields (no HTML).
- Block types allowed: title, chunk, key, step, bullet, caption, describe, note
- Educational, classroom-ready tone. No filler or generic AI intros.`;
