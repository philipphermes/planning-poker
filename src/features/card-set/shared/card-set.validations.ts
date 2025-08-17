import {z} from "zod";
import {sanitize} from "@/lib/shared/utils";
import {ownerUUIDZodType} from "@/features/user/shared/user.validations";

export const cardSetUUIDZodType = z.uuid("Invalid card set ID");
export const cardSetNameZodType = z.string().min(1, "Card set name is required").max(100, "Card set name too long").transform(sanitize);
export const cardsZodType = z.array(z.string().transform(sanitize)).min(1, "At least one card is required");

export const persistCardSetSchema = z.object({
    id: cardSetUUIDZodType.optional(),
    name: cardSetNameZodType,
    cards: cardsZodType,
    ownerId: ownerUUIDZodType,
});

export const deleteCardSetSchema = z.object({
    id: cardSetUUIDZodType,
    ownerId: ownerUUIDZodType,
});

export const cardSetFormSchema = z.object({
    id: cardSetUUIDZodType.optional(),
    name: cardSetNameZodType,
    cards: z.array(z.object({value: z.string()})),
})

export type PersistCardSetInput = z.infer<typeof persistCardSetSchema>;
export type DeleteCardSetInput = z.infer<typeof deleteCardSetSchema>;
export type CardSetFormInput = z.infer<typeof cardSetFormSchema>;