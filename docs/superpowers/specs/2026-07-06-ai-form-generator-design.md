# AI Form Generator — Design Spec

Date: 2026-07-06

## Problem

The builder's "✦ AI" tab (`src/components/builder/left/BuilderLeftPanel.tsx`) is a static placeholder: a textarea and a "Generate form" button that do nothing ("AI generation coming soon — stay tuned"). We want it to actually generate a form's questions and design from a free-text prompt, backed by a Hugging Face-hosted LLM.

The real Hugging Face API key will be supplied by the user directly into `.env` (locally) and Netlify (in production) — this spec covers the real integration code, not a mock.

## Architecture

```
AIGeneratorPanel (client)  →  generateFormFromPrompt() server action  →  callHuggingFaceChat()  →  HF Router
        ↑ preview/apply                    ↓ validates with zod              ↓ POST /v1/chat/completions
   page.tsx merges into draft      { questions, design_config }
```

The server action is the sole integration point — swapping models/keys later requires no UI changes.

## Components

### `src/lib/ai/client.ts`
- `callHuggingFaceChat(messages: {role, content}[]): Promise<string>`
- POSTs to `https://router.huggingface.co/v1/chat/completions`
- Model: `meta-llama/Llama-3.1-8B-Instruct` (hardcoded default; not configurable via env in v1 — YAGNI)
- Header: `Authorization: Bearer ${process.env.HUGGINGFACE_API_KEY}`
- On non-OK response, parses HF's JSON error body (`{ error: string }`) if present and throws `Error(message)`; falls back to `Error("Hugging Face request failed (status)")` if body isn't parseable.
- Returns `choices[0].message.content` (raw string, expected to be JSON per the system prompt).

### `src/lib/ai/schema.ts`
- Zod schema for the model's expected output shape: `{ questions: QuestionInput[], design_config: Partial<DesignConfig> }`
- `QuestionInput` = `Question` from `src/lib/types.ts` minus `id` (server assigns ids).
- Validates `type` against the existing `QuestionType` union so an invalid/hallucinated type fails validation rather than corrupting form state.
- Design config fields are validated loosely (partial, all optional) since the model may only return a subset (colors/theme) — anything not returned simply doesn't get merged.

### `src/app/builder/ai-actions.ts`
- `'use server'`
- `generateFormFromPrompt(prompt: string): Promise<{ questions: Question[], design_config: Partial<DesignConfig> }>`
- Steps: `requireAuth()` → build a system prompt instructing strict-JSON output matching the schema (field list, allowed `QuestionType` values, and an explicit "return ONLY valid JSON, no prose" instruction) → call `callHuggingFaceChat([{system}, {user: prompt}])` → `JSON.parse` the content (wrapped in try/catch → clear error on failure) → validate with the zod schema (clear error on failure) → assign `crypto.randomUUID()` to each question → return.
- Errors are plain `Error` objects with user-facing messages, following the existing `builder/actions.ts` convention (e.g. `saveAsTemplate`).

### `src/components/builder/left/ai/AIGeneratorPanel.tsx`
- `'use client'`
- Replaces the dead markup currently inline in `BuilderLeftPanel.tsx` for the AI tab.
- Controlled textarea (prompt state), "Generate form" button with loading state (disabled + spinner while pending).
- On success: switches to preview state, renders `<GeneratedPreview />`.
- On error: shows inline error text below the button (e.g. "AI generation failed: invalid API key") plus a "Try again" button; prompt text is preserved so the user doesn't retype.
- Props: `{ onApplyGenerated: (questions: Question[], design: Partial<DesignConfig>) => void }`

### `src/components/builder/left/ai/GeneratedPreview.tsx`
- Presentational only (Interface Segregation — receives just `questions` and `design_config`, not the whole form).
- Renders a simple list of generated question labels + types, and a small swatch/summary of the design patch (e.g. theme name, primary color dot).
- Buttons: **Apply** (calls `onApplyGenerated`), **Discard** (clears preview, returns to the prompt input).

### Wiring
- `BuilderLeftPanel.tsx`: tab index 2 renders `<AIGeneratorPanel onApplyGenerated={onApplyGenerated} />` instead of the current static block.
- `src/app/builder/[id]/page.tsx`: new `onApplyGenerated(questions, design)` handler mirroring the existing `onApplyTemplate` handler (around line 158) — replaces the question list, merges `design` over the current design state (`{ ...prev, ...design }`), passed down through `BuilderLeftPanel`.

## Data Flow

1. User types a prompt, clicks "Generate form".
2. Client calls `generateFormFromPrompt(prompt)`.
3. Server: auth check → LLM call → parse/validate → return `{ questions, design_config }` with fresh ids.
4. Client shows preview (no draft mutation yet).
5. User clicks **Apply** → `onApplyGenerated` fires → `page.tsx` replaces questions and merges design into the live draft, same as template-apply today.
6. User clicks **Discard** → preview clears, prompt text remains editable.

## Error Handling

| Failure | Where caught | User-facing result |
|---|---|---|
| Invalid/placeholder API key (401/403 from HF) | `client.ts` → rethrown by action | "AI generation failed: invalid API key" + Try again |
| Model returns non-JSON / prose | `ai-actions.ts` JSON.parse catch | "AI returned an invalid response, please try again" |
| Model returns JSON with wrong shape (bad `QuestionType`, missing fields) | `ai-actions.ts` zod validation catch | "AI returned an invalid response, please try again" |
| Network/timeout error | `client.ts` fetch throws | "AI generation failed: could not reach Hugging Face" |

All errors are non-fatal to the builder — the existing draft is never touched until the user clicks Apply.

## Out of Scope (YAGNI, revisit only if asked)

- Configurable model/provider via env var or UI.
- Regenerate-with-history / multi-turn refinement.
- Streaming the response token-by-token.
- Merge/append mode (append generated questions instead of replace) — replace-on-apply only, per approved design.

## Testing

- Unit tests for `schema.ts`: valid payload passes, invalid `QuestionType` fails, missing required fields fails.
- Manual verification in-browser: loading state, error state (current placeholder key will 401), preview render, apply-merges-into-draft, discard-returns-to-input.
- Full generate → preview → apply happy path is verified once the real Hugging Face key is confirmed working (key is already in `.env`; first real test will confirm success end-to-end).
