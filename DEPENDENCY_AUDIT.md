# Dependency Audit Report

**Generated:** 2025-12-27
**Project:** platform

## Summary

| Metric | Status |
|--------|--------|
| Security Vulnerabilities | **0** |
| Outdated Packages | **0** |
| Total Packages (lockfile) | **621** |
| Direct Dependencies | **17** |
| Dev Dependencies | **8** |

---

## 1. Security Vulnerabilities

**Status: Clean** - `npm audit` found 0 vulnerabilities.

---

## 2. Package Version Status

All packages are at their **latest versions**. Versions are properly pinned where needed:
- `next` and `eslint-config-next` locked to `16.1.1`
- `react` and `react-dom` locked to `19.2.3`

---

## 3. Bloat Analysis & Recommendations

### High Impact: tldraw (~19 sub-packages)

| Package | Impact | Recommendation |
|---------|--------|----------------|
| `tldraw` (^4.2.1) | ~3% of total packages, brings heavy transitive deps including Babel, browser-fs-access, etc. | Used in 1 component (`page-editor.tsx`). If the canvas/drawing functionality is non-essential, consider removing. Otherwise, consider **lazy loading** (already using `dynamic()`) |

### Medium Impact: Potential Redundancies

| Package | Observation | Recommendation |
|---------|-------------|----------------|
| `clsx` + `tailwind-merge` | Both used together via `cn()` utility | **Keep as-is** - This is the standard pattern for shadcn/ui |
| `class-variance-authority` | Only used in `button.tsx` | Keep - lightweight (~4KB), provides type-safe variant handling |

### Low Priority: Unused UI Components

The following shadcn/ui components exist but have **limited usage**:
- `card.tsx` - used in 1 file only
- `alert-dialog.tsx` - used in 1 file only
- `collapsible.tsx` - used in 1 file only

These are **copy-pasted files** (not npm packages), so removing them saves minimal bundle size. Keep unless you're actively pruning the codebase.

---

## 4. Recommended Actions

### No Action Required
- All packages are up-to-date
- No security vulnerabilities
- All npm dependencies are being used in the codebase

### Consider (Optional)

1. **Review tldraw necessity**: If the drawing/canvas feature is experimental or rarely used, removing `tldraw` would reduce:
   - ~19 direct/transitive sub-packages
   - Significant bundle size (~hundreds of KB gzipped)

2. **Bundle analysis**: Run `npm run build` and check `.next/analyze` (after adding `@next/bundle-analyzer`) to identify actual production bundle contributors.

3. **Dev dependency versions**: The dev deps use very loose ranges (`^4`, `^9`, `^5`). Consider pinning more specifically for reproducible builds:
   ```json
   "@tailwindcss/postcss": "^4.0.0",
   "eslint": "^9.0.0",
   "tailwindcss": "^4.0.0",
   "typescript": "^5.0.0"
   ```

---

## 5. Health Score

| Category | Score |
|----------|-------|
| Security | 10/10 |
| Currency | 10/10 |
| Efficiency | 8/10 (tldraw is heavy but correctly lazy-loaded) |
| **Overall** | **9/10** |

The dependency setup is healthy. The main opportunity for improvement is evaluating whether tldraw's functionality justifies its weight in the bundle.

---

## Package Usage Summary

| Package | Files Using It |
|---------|----------------|
| @anthropic-ai/sdk | 3 files (dms API routes) |
| @radix-ui/* | 5 UI component files |
| @supabase/supabase-js | 3 files (lib + API routes) |
| class-variance-authority | 1 file (button.tsx) |
| clsx | 1 file (utils.ts) |
| lucide-react | 8 files (icons throughout) |
| next | Core framework |
| react / react-dom | Core framework |
| tailwind-merge | 1 file (utils.ts) |
| tldraw | 1 file (page-editor.tsx) |
| use-debounce | 1 file (page-editor.tsx) |
| zustand | 1 file (notes-store.ts) |
