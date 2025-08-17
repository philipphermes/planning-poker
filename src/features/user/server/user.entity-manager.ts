import {eq} from "drizzle-orm";
import {AbstractEntityManager} from "@/lib/server/db/abstract.entity-manager";
import {users} from "@/lib/server/db/schema";
import {Transaction} from "@/lib/server/db/types";
import {UserUpdateInput} from "@/features/user/shared/user.validations";

export class UserEntityManager extends AbstractEntityManager {
    async update(user: UserUpdateInput) {
        return this.safeExecute('update', async () => {
            return this.db.transaction(async (tx) => {
                const [updatedUser] = await tx
                    .update(users)
                    .set({
                        name: user.name,
                        image: user.image,
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
