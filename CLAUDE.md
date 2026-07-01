# Privora — AI Agent Instructions

## Before any code generation

Invoke the `optimized-generation` skill before writing or editing any file:

```
Skill("optimized-generation")
```

This skill enforces the project's hard constraints:
- **< 150 lines** per file
- **≤ 3 files** per folder
- **SOLID** principles (S / O / L / I / D)
- React + Next.js best practices

Do not skip this step even for small edits.

## Skill routing

| Request type | Invoke skill |
|---|---|
| Writing or editing any file | `optimized-generation` |
| Code review / diff check | `code-reviewer` |
| Bug investigation | `investigate` |

## Stack

- Next.js 15 App Router (`src/app/`)
- Supabase SSR (anon key + RLS — no service role key)
- TypeScript strict mode
- Tailwind CSS (static classes only — inline styles for runtime values)
- Shared types: `src/lib/types.ts`
- Supabase client: `src/lib/supabase/browser.ts` (client), `src/lib/supabase/server.ts` (server)
