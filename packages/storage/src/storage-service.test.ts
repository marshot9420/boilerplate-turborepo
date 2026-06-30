import { describe, expect, it } from "vitest";

import { InMemoryStorageProvider } from "./providers";
import { createStorageService } from "./storage-service";

describe("Storage Service", () => {
  it("객체를 업로드한다", async () => {
    const provider = new InMemoryStorageProvider();
    const storageService = createStorageService({ provider });

    const result = await storageService.uploadObject({
      bucket: "products",
      key: "images/product-1.png",
      body: Buffer.from("test-image"),
      contentType: "image/png",
      visibility: "public",
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.data).toEqual({
      bucket: "products",
      key: "images/product-1.png",
      contentType: "image/png",
      size: Buffer.from("test-image").byteLength,
      visibility: "public",
    });

    expect(provider.hasObject("products", "images/product-1.png")).toBe(true);
  });

  it("객체를 삭제한다", async () => {
    const provider = new InMemoryStorageProvider();
    const storageService = createStorageService({ provider });

    await storageService.uploadObject({
      bucket: "products",
      key: "images/product-1.png",
      body: Buffer.from("test-image"),
    });

    const result = await storageService.deleteObject({
      bucket: "products",
      key: "images/product-1.png",
    });

    expect(result.ok).toBe(true);
    expect(provider.hasObject("products", "images/product-1.png")).toBe(false);
  });

  it("public URL을 생성한다", () => {
    const provider = new InMemoryStorageProvider({
      publicBaseUrl: "https://cdn.example.com",
    });

    const storageService = createStorageService({ provider });

    const result = storageService.getPublicUrl({
      bucket: "products",
      key: "images/product 1.png",
    });

    expect(result).toEqual({
      ok: true,
      data: "https://cdn.example.com/products/images/product%201.png",
    });
  });

  it("signed upload URL을 생성한다", async () => {
    const provider = new InMemoryStorageProvider({
      publicBaseUrl: "https://cdn.example.com",
    });

    const storageService = createStorageService({ provider });

    const result = await storageService.getSignedUploadUrl({
      bucket: "products",
      key: "images/product-1.png",
      expiresInSeconds: 60,
    });

    expect(result).toEqual({
      ok: true,
      data: "https://cdn.example.com/products/images/product-1.png?operation=upload&expiresIn=60&signature=in-memory",
    });
  });

  it("signed download URL을 생성한다", async () => {
    const provider = new InMemoryStorageProvider({
      publicBaseUrl: "https://cdn.example.com",
    });

    const storageService = createStorageService({ provider });

    const result = await storageService.getSignedDownloadUrl({
      bucket: "products",
      key: "images/product-1.png",
      expiresInSeconds: 60,
    });

    expect(result).toEqual({
      ok: true,
      data: "https://cdn.example.com/products/images/product-1.png?operation=download&expiresIn=60&signature=in-memory",
    });
  });

  it("bucket이 비어 있으면 실패한다", async () => {
    const provider = new InMemoryStorageProvider();
    const storageService = createStorageService({ provider });

    const result = await storageService.uploadObject({
      bucket: "",
      key: "images/product-1.png",
      body: Buffer.from("test-image"),
    });

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe("STORAGE.INVALID_INPUT");
  });

  it("signed URL 만료 시간이 올바르지 않으면 실패한다", async () => {
    const provider = new InMemoryStorageProvider();
    const storageService = createStorageService({ provider });

    const result = await storageService.getSignedUploadUrl({
      bucket: "products",
      key: "images/product-1.png",
      expiresInSeconds: 0,
    });

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe("STORAGE.INVALID_INPUT");
  });
});
