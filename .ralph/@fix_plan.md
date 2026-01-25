# OpenCode TODO Items - Current Tasks

**Project**: opencode (Luckybalabala/opencode)
**Date**: 2026-01-25
**Status**: Fresh TODO extraction from codebase

---

## Context

All 6 previously documented bugs (#10341-10343, #10346, #10349-10350) have been **fixed and committed**. This new task list is extracted from current TODO/FIXME comments in the codebase.

---

## Task List

- [x] **1. Filesystem.contains Symlinks** (HIGH - Security) ✅ FIXED
  - **File**: `packages/opencode/src/util/filesystem.ts`
  - **Comment**: `// TODO: Filesystem.contains is lexical only - symlinks inside the project can escape.`
  - **Impact**: Security vulnerability
  - **Estimated Time**: 3 hours
  - **Status**: Implemented three-layer validation with realpath check
  - **Date Fixed**: 2026-01-26

- [x] **2. Server.ts Refactoring** (HIGH - Maintainability) ✅ FIXED
  - **File**: `packages/opencode/src/server/server.ts`
  - **Comment**: `// TODO: Break server.ts into smaller route files to fix type inference`
  - **Impact**: Type safety and maintainability
  - **Estimated Time**: 6 hours
  - **Status**: Extracted 6 route files (instance, utility, agent, auth, streaming, proxy)
  - **Date Fixed**: 2026-01-26

- [x] **3. Pricing Model Enhancement** (MEDIUM) ✅ FIXED
  - **File**: `packages/opencode/src/provider/provider.ts`, `packages/opencode/src/session/index.ts`, `packages/opencode/src/plugin/copilot.ts`, `packages/opencode/src/plugin/codex.ts`
  - **Comment**: `// TODO: update models.dev to have better pricing model, for now:`
  - **Impact**: Cost calculation accuracy
  - **Estimated Time**: 2 hours
  - **Status**: Added dedicated `reasoning` field to cost schema at 4 locations:
    - provider.ts lines 549, 558 (schema definition)
    - provider.ts line 617, 630, 791 (cost object construction)
    - session/index.ts line 467 (cost calculation)
    - copilot.ts line 34 (plugin cost object)
    - codex.ts line 376 (plugin cost object)
  - **Date Fixed**: 2026-01-26

- [ ] **4. Tool Logic Centralization** (MEDIUM)
  - **File**: `packages/opencode/src/session/prompt.ts`
  - **Comment**: `// TODO: centralize "invoke tool" logic`
  - **Impact**: Code maintainability
  - **Estimated Time**: 3 hours

- [ ] **5. Permission Ruleset Persistence** (MEDIUM)
  - **File**: `packages/opencode/src/permission/next.ts`
  - **Comment**: `// TODO: we don't save the permission ruleset to disk yet until there's`
  - **Impact**: Feature completeness
  - **Estimated Time**: 2 hours

- [x] **6. Windows Cross-Drive Paths** (MEDIUM) ✅ FIXED
  - **File**: `packages/opencode/src/util/filesystem.ts`
  - **Comment**: `// TODO: On Windows, cross-drive paths bypass this check. Consider realpath canonicalization.`
  - **Impact**: Cross-platform compatibility
  - **Estimated Time**: 4 hours
  - **Status**: Implemented Windows drive letter validation in Layer 1
  - **Date Fixed**: 2026-01-26

- [x] **7. OpenAI SDK 6 Migration** (MEDIUM) ✅ FIXED
  - **File**: `packages/opencode/src/provider/sdk/openai-compatible/src/responses/openai-responses-language-model.ts`
  - **Comment**: `// TODO AI SDK 6: use optional here instead of nullish`
  - **Impact**: SDK migration
  - **Estimated Time**: 2 hours
  - **Status**: Migrated from .nullish() to .optional()
  - **Date Fixed**: 2026-01-26

- [ ] **8. Task Tool Input Complexity** (LOW)
  - **File**: `packages/opencode/src/session/prompt.ts`
  - **Comment**: `// TODO: how can we make task tool accept a more complex input?`
  - **Impact**: Feature enhancement
  - **Estimated Time**: 4 hours

- [ ] **9. Bash Tool Rename** (LOW)
  - **File**: `packages/opencode/src/tool/bash.ts`
  - **Comment**: `// TODO: we may wanna rename this tool so it works better on other shells`
  - **Impact**: Cross-shell compatibility
  - **Estimated Time**: 2 hours

- [ ] **10. Bun SDK Compatibility** (LOW)
  - **File**: `packages/opencode/src/bun/index.ts`
  - **Comment**: `// TODO: get rid of this case (see: https://github.com/oven-sh/bun/issues/19936)`
  - **Impact**: Bun-specific workaround
  - **Estimated Time**: 1 hour (depends on upstream fix)

---

## Total Estimated Time

- **High priority**: 9 hours
- **Medium priority**: 15 hours
- **Low priority**: 7 hours
- **Total**: ~31 hours

---

## Notes

- All items extracted from actual code comments on 2026-01-25
- Previous 6 bugs (#10341-10343, #10346, #10349-10350) are confirmed fixed
- No GitHub issues available (repository has issues disabled)
- Consider creating GitHub issues for these TODO items for better tracking

---

**Generated**: 2026-01-25 23:50 UTC
**Ralph Version**: v0.10.4
