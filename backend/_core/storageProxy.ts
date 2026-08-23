import type { Express } from "express";
import type { Request, Response } from "express";
import { ENV } from "./env";

export const LIFELINK_OFFICIAL_LOGO_STORAGE_KEY = "lifelink-official-logo_71a0ddff.jpg";
export const LIFELINK_OFFICIAL_LOGO_ROUTE = "/assets/branding/lifelink-logo.jpg";
export const LIFELINK_OFFICIAL_LOGO_LOCKUP_STORAGE_KEY = "lifelink-official-logo-lockup_f75be2e5.jpg";
export const LIFELINK_OFFICIAL_LOGO_LOCKUP_ROUTE = "/assets/branding/lifelink-logo-lockup.jpg";

async function getStorageDownloadUrl(key: string) {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    throw new Error("Storage proxy not configured");
  }

  const forgeUrl = new URL(
    "v1/storage/presign/get",
    ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
  );
  forgeUrl.searchParams.set("path", key);

  const forgeResp = await fetch(forgeUrl, {
    headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
  });

  if (!forgeResp.ok) {
    const body = await forgeResp.text().catch(() => "");
    throw new Error(`Storage backend error: ${forgeResp.status} ${body}`);
  }

  const { url } = (await forgeResp.json()) as { url: string };
  if (!url) {
    throw new Error("Empty signed URL from storage backend");
  }

  return url;
}

export function registerStorageProxy(app: Express) {
  const serveBrandAsset = (storageKey: string) => async (_req: Request, res: Response) => {
    try {
      const signedUrl = await getStorageDownloadUrl(storageKey);
      const assetResponse = await fetch(signedUrl);

      if (!assetResponse.ok) {
        throw new Error(`Official logo download failed: ${assetResponse.status}`);
      }

      const asset = Buffer.from(await assetResponse.arrayBuffer());
      res
        .status(200)
        .set({
          "Cache-Control": "public, max-age=86400, immutable",
          "Content-Type": "image/jpeg",
          "Content-Length": String(asset.byteLength),
        })
        .send(asset);
    } catch (err) {
      console.error("[BrandAsset] failed to serve the official LifeLink logo:", err);
      res.status(502).send("Brand asset unavailable");
    }
  };

  app.get(LIFELINK_OFFICIAL_LOGO_ROUTE, serveBrandAsset(LIFELINK_OFFICIAL_LOGO_STORAGE_KEY));
  app.get(LIFELINK_OFFICIAL_LOGO_LOCKUP_ROUTE, serveBrandAsset(LIFELINK_OFFICIAL_LOGO_LOCKUP_STORAGE_KEY));

  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      const url = await getStorageDownloadUrl(key);

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
