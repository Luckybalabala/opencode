import { realpathSync } from "fs"
import { dirname, join, parse, relative } from "path"

export namespace Filesystem {
  export const exists = (p: string) =>
    Bun.file(p)
      .stat()
      .then(() => true)
      .catch(() => false)

  export const isDir = (p: string) =>
    Bun.file(p)
      .stat()
      .then((s) => s.isDirectory())
      .catch(() => false)
  /**
   * On Windows, normalize a path to its canonical casing using the filesystem.
   * This is needed because Windows paths are case-insensitive but LSP servers
   * may return paths with different casing than what we send them.
   */
  export function normalizePath(p: string): string {
    if (process.platform !== "win32") return p
    try {
      return realpathSync.native(p)
    } catch {
      return p
    }
  }
  export function overlaps(a: string, b: string) {
    const relA = relative(a, b)
    const relB = relative(b, a)
    return !relA || !relA.startsWith("..") || !relB || !relB.startsWith("..")
  }

  export function contains(parent: string, child: string): boolean {
    // Layer 1: Cross-drive check (Windows only)
    if (process.platform === "win32") {
      const parentDrive = parse(parent).root
      const childDrive = parse(child).root
      if (parentDrive !== childDrive) {
        // Log cross-drive access attempt
        const { Log } = require("../log")
        Log.Default.warn("Filesystem.contains: Cross-drive access denied", {
          parent,
          child,
          parentDrive,
          childDrive,
        })
        return false
      }
    }

    // Layer 2: Lexical check (fast path for obvious violations)
    const lexicalCheck = !relative(parent, child).startsWith("..")
    if (!lexicalCheck) {
      return false
    }

    // Layer 3: Realpath check (prevents symlink attacks)
    try {
      const realParent = realpathSync.native(parent)
      const realChild = realpathSync.native(child)
      const secureCheck = !relative(realParent, realChild).startsWith("..")

      if (!secureCheck) {
        // Log potential symlink attack
        const { Log } = require("../log")
        Log.Default.warn("Filesystem.contains: Symlink escape detected", {
          parent,
          child,
          realParent,
          realChild,
        })
        return false
      }

      return true
    } catch (error) {
      // Conservative: deny access on error
      const { Log } = require("../log")
      Log.Default.error("Filesystem.contains: realpath failed, denying access", {
        parent,
        child,
        error: (error as Error).message,
      })
      return false
    }
  }

  export async function findUp(target: string, start: string, stop?: string) {
    let current = start
    const result = []
    while (true) {
      const search = join(current, target)
      if (await exists(search)) result.push(search)
      if (stop === current) break
      const parent = dirname(current)
      if (parent === current) break
      current = parent
    }
    return result
  }

  export async function* up(options: { targets: string[]; start: string; stop?: string }) {
    const { targets, start, stop } = options
    let current = start
    while (true) {
      for (const target of targets) {
        const search = join(current, target)
        if (await exists(search)) yield search
      }
      if (stop === current) break
      const parent = dirname(current)
      if (parent === current) break
      current = parent
    }
  }

  export async function globUp(pattern: string, start: string, stop?: string) {
    let current = start
    const result = []
    while (true) {
      try {
        const glob = new Bun.Glob(pattern)
        for await (const match of glob.scan({
          cwd: current,
          absolute: true,
          onlyFiles: true,
          followSymlinks: true,
          dot: true,
        })) {
          result.push(match)
        }
      } catch {
        // Skip invalid glob patterns
      }
      if (stop === current) break
      const parent = dirname(current)
      if (parent === current) break
      current = parent
    }
    return result
  }
}
