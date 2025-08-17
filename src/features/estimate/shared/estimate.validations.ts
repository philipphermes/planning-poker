import {z} from "zod";
import {userUUIDZodType} from "@/features/user/shared/user.validations";
import {sanitize} from "@/lib/shared/utils";
import {roundUUIDZodType} from "@/features/round/shared/round.validations";

export const valueZodType = z.string().min(1, "Estimate value is required").transform(sanitize);

export const submitEstimateSchema = z.object({
    userId: userUUIDZodType,
    roundId: roundUUIDZodType,
    value: valueZodType,
});

export const submitEstimateFormSchema = z.object({
    roundId: roundUUIDZodType,
    value: valueZodType,
});

export type SubmitEstimateInput = z.infer<typeof submitEstimateSchema>;
export type SubmitEstimateFormInput = z.infer<typeof submitEstimateFormSchema>;