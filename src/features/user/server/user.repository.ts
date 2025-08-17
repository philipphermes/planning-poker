import {eq, not} from "drizzle-orm";
import {AbstractRepository} from "@/lib/server/db/abstract.repository";
import {User} from "@/features/user/shared/user.types";
import {users} from "@/lib/server/db/schema";

export class UserRepository extends AbstractRepository {
    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.safeExecute('findOneByEmail', async () => {
            return this.db.query.users.findFirst({
                where: eq(users.email, email)
            });
        });
    }

    async findManyExcept(userId: string) {
        return this.safeExecute('findManyExcept', async () => {
            return this.db.select().from(users).where(not(eq(users.id, userId)));
        });
    }
}
