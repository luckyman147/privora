---
name: optimized-generation
description: Enforces file size limits, folder structure limits, SOLID principles, and clean-code practices before any code generation in this project.
---

# Optimized Generation — Project Rules

Apply **every rule below** before writing or editing any file in this project.

---

## 1. File size — hard limit: 150 lines

- Every file must stay **under 150 lines** (comments + blank lines included).
- If a file would exceed 150 lines, **split it first**:
  - Extract a type/interface → `types.ts`
  - Extract a helper/utility → `utils.ts` or a dedicated `lib/` file
  - Extract a sub-component → its own file in the same folder
- Never pile everything into one file to save time.

---

## 2. Folder size — max 3 files per folder

- No folder may contain **more than 3 files**.
- When adding a 4th file, reorganize:
  - Group by feature into a sub-folder (e.g. `builder/design/`, `builder/results/`)
  - Or lift shared code to a parent `lib/` or `shared/` folder
- `index.ts` barrel files count toward the limit.

---

## 3. SOLID principles — one check per letter

| Letter | Rule | Common violation to avoid |
|--------|------|--------------------------|
| **S** — Single Responsibility | One file = one concern. A component renders; a hook fetches; a util transforms. | God components that fetch + transform + render |
| **O** — Open/Closed | Extend behavior via props/config, not by editing internals. | Hard-coding variants instead of accepting a `variant` prop |
| **L** — Liskov Substitution | Any component accepting `Question` must handle all `QuestionType` values safely. | Switch without a default / exhaustive check |
| **I** — Interface Segregation | Pass only the props a component needs — not the whole `form` object when only `form.id` is used. | Passing `form` when the child only uses `form.id` |
| **D** — Dependency Inversion | Components depend on abstractions (props, hooks) not on concrete Supabase calls. | Calling `createClient()` inside a presentational component |

---

## 4. Naming & structure

- **Files**: `camelCase` for hooks (`useDesign.ts`), `PascalCase` for components (`QuestionCard.tsx`), `kebab-case` for routes.
- **Functions**: verb-noun (`resolvePageBg`, `countOptions`), not noun-only (`pageBg`, `options`).
- **Booleans**: `is*` / `has*` / `can*` prefix (`isLoading`, `hasError`).
- No file named `utils.ts` at the root — scope it (`design/utils.ts`, `form/utils.ts`).

---

## 5. React / Next.js specifics

- All hooks before any early return — no exceptions.
- `'use client'` only on files that use browser APIs or React state; keep server components server-only.
- Never call `createClient()` inside a render function — call it at module level or inside `useEffect` / server action.
- Inline styles only for **runtime dynamic values** (colors from DB, widths from user config). Use Tailwind for everything static.
- No magic strings for question types — reference `QuestionType` from `src/lib/types.ts`.

---

## 6. Before writing any file, answer these three questions

1. **Will this file exceed 150 lines?** → Split it now, not later.
2. **Will the target folder have more than 3 files?** → Create a sub-folder first.
3. **Does this component do more than one thing?** → Extract the second concern before writing.

If any answer is "yes", restructure first, then write.
