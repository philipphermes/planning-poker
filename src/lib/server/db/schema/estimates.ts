import {sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {rounds} from './rounds';
import {users} from './users';
import {relations} from 'drizzle-orm';

export const estimates = sqliteTable('estimate', {
    roundId: text('round_id').notNull().references(() => rounds.id),
    userId: text('user_id').notNull().references(() => users.id),
    value: text('value').notNull(),
});

export const estimatesRelations = relations(estimates, ({one}) => ({
    round: one(rounds, {
        fields: [estimates.roundId],
        references: [rounds.id],
    }),
    user: one(users, {
        fields: [estimates.userId],
        references: [users.id],
    }),
}));
