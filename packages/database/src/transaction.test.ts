import { beforeEach, describe, expect, it, vi } from "vitest";

import { transaction } from "./transaction";

const prismaMock = vi.hoisted(() => ({
  $transaction: vi.fn(),
}));

vi.mock("./client", () => ({
  prisma: prismaMock,
}));

describe("transaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prisma.$transaction에 callback을 위임한다", async () => {
    const callback = vi.fn(async () => "transaction-result");

    prismaMock.$transaction.mockResolvedValue("transaction-result");

    const result = await transaction(callback);

    expect(prismaMock.$transaction).toHaveBeenCalledWith(callback);
    expect(result).toBe("transaction-result");
  });

  it("prisma.$transaction에서 발생한 에러를 그대로 전파한다", async () => {
    const error = new Error("transaction failed");
    const callback = vi.fn(async () => "transaction-result");

    prismaMock.$transaction.mockRejectedValue(error);

    await expect(transaction(callback)).rejects.toBe(error);

    expect(prismaMock.$transaction).toHaveBeenCalledWith(callback);
  });
});
