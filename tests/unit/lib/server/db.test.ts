import { describe, expect, it } from "vitest";
import { DatabaseError } from "../../../../src/lib/shared/errors";
import { safeExecute } from "../../../../src/lib/server/db";

describe("DB", () => {
    describe("safeExecute", () => {
        it("should wrap errors in DatabaseError with original message", async () => {
            await expect(
                safeExecute("test", async () => {
                    throw new Error("test error");
                })
            ).rejects.toMatchObject({
                constructor: DatabaseError,
                message: "Database operation failed in test: test error",
            });
        });

        it("should wrap non-Error exceptions in DatabaseError with unknown message", async () => {
            await expect(
                safeExecute("test", async () => {
                    throw "error";
                })
            ).rejects.toMatchObject({
                constructor: DatabaseError,
                message: "Database operation failed in test: Unknown error",
            });
        });
    });
});
