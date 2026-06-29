import { describe, expect, it } from "vitest";

import { createStorageServiceFromConfig, STORAGE_PROVIDER_TYPE } from "./storage-config";

describe("Storage Config", () => {
  it("in-memory provider 기반 storage service를 생성한다", async () => {
    const storageService = createStorageServiceFromConfig({
      provider: STORAGE_PROVIDER_TYPE.IN_MEMORY,
      publicBaseUrl: "https://cdn.example.com",
    });

    const uploadResult = await storageService.uploadObject({
      bucket: "products",
      key: "images/product-1.png",
      body: Buffer.from("test-image"),
      contentType: "image/png",
      visibility: "public",
    });

    expect(uploadResult.ok).toBe(true);

    const publicUrlResult = storageService.getPublicUrl({
      bucket: "products",
      key: "images/product-1.png",
    });

    expect(publicUrlResult).toEqual({
      ok: true,
      data: "https://cdn.example.com/products/images/product-1.png",
    });
  });
});
