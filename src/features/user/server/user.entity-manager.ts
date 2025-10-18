import {eq} from "drizzle-orm";
import {AbstractEntityManager} from "@/lib/server/db/abstract.entity-manager";
import {users} from "@/lib/server/db/schema";
import {Transaction} from "@/lib/server/db/types";
import {UserUpdateImageInput, UserUpdateNameInput} from "@/features/user/shared/user.validations";

export class UserEntityManager extends AbstractEntityManager {
    async updateName(user: UserUpdateNameInput) {
        return this.safeExecute('update', async () => {
            return this.db.transaction(async (tx) => {
                const [updatedUser] = await tx
                    .update(users)
                    .set({
                        name: user.name,
                    })
                    .where(eq(users.id, user.id))
                    .returning();
                return updatedUser;
            });
        });
    }

    async updateImage(user: UserUpdateImageInput) {
        return this.safeExecute('update', async () => {
            return this.db.transaction(async (tx) => {
                const [updatedUser] = await tx
                    .update(users)
                    .set({
                        image: user.image ?? null,
                    })
                    .where(eq(users.id, user.id))
                    .returning();
                return updatedUser;
            });
        });
    }

    async deleteByUserId(userId: string, tx: Transaction) {
        await tx.delete(users).where(eq(users.id, userId));
    }
}
