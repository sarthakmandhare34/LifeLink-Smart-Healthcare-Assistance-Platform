import type { Express, Request, Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { sessionAuth } from "./_core/sessionAuth";

const storageDirectory = path.resolve(
  process.env.LIFELINK_STORAGE_DIR ||
    path.resolve(import.meta.dirname, "../local-data/uploads")
);

function normalizeStorageKey(value: string) {
  const key = value.replace(/\\/g, "/").replace(/^\/+/, "");
  if (
    !key ||
    key
      .split("/")
      .some(segment => !segment || segment === "." || segment === "..")
  ) {
    throw new Error("Invalid local storage key.");
  }
  return key;
}

function appendHashSuffix(relKey: string) {
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const lastDot = relKey.lastIndexOf(".");
  return lastDot === -1
    ? `${relKey}_${suffix}`
    : `${relKey.slice(0, lastDot)}_${suffix}${relKey.slice(lastDot)}`;
}

function localStorageUrl(key: string) {
  return `/api/local-storage/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function getLocalStorageDirectory() {
  return storageDirectory;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  _contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeStorageKey(relKey));
  const target = path.resolve(storageDirectory, key);
  if (!target.startsWith(`${storageDirectory}${path.sep}`))
    throw new Error("Invalid local storage path.");
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, data);
  return { key, url: localStorageUrl(key) };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeStorageKey(relKey);
  return { key, url: localStorageUrl(key) };
}

function contentTypeFor(key: string) {
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export function registerLocalStorageRoute(app: Express) {
  app.get("/api/local-storage/*", async (req: Request, res: Response) => {
    const user = await sessionAuth.authenticateRequest(req).catch(() => null);
    if (!user)
      return res
        .status(401)
        .json({ error: "Please sign in before opening private files." });

    try {
      const key = normalizeStorageKey(
        (req.params as Record<string, string>)[0] ?? ""
      );
      const expectedPrefix = `patient-profile-photos/${user.id}/`;
      if (!key.startsWith(expectedPrefix))
        return res.status(403).json({ error: "You cannot access this file." });
      const target = path.resolve(storageDirectory, key);
      if (!target.startsWith(`${storageDirectory}${path.sep}`))
        return res.status(403).json({ error: "You cannot access this file." });
      await fs.access(target);
      res.set({
        "Cache-Control": "private, no-store",
        "Content-Type": contentTypeFor(key),
      });
      return res.sendFile(target);
    } catch {
      return res
        .status(404)
        .json({ error: "The requested file is unavailable." });
    }
  });
}
