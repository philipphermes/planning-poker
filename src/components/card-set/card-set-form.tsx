'use client'

import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Minus, Plus} from "lucide-react";
import {toast} from "sonner";
import {CardSetDto} from "@/features/card-set/shared/card-set.types";
import {persistCardSetAction} from "@/features/card-set/server/card-set.actions";
import {CardSetFormInput, cardSetFormSchema} from "@/features/card-set/shared/card-set.validations";

export function CardSetForm({cardSet}: { cardSet?: CardSetDto }) {
    const form = useForm<z.infer<typeof cardSetFormSchema>>({
        resolver: zodResolver(cardSetFormSchema),
        defaultValues: {
            name: '',
            cards: [],
        },
        values: {
            id: cardSet?.id,
            name: cardSet?.name ?? '',
            cards: cardSet?.cards?.map(card => ({value: card})) ?? [],
        }
    })

    const {fields, append, remove} = useFieldArray({
        name: 'cards',
        control: form.control,
    });

    async function onSubmit(data: CardSetFormInput) {
        const response = await persistCardSetAction(data);
        if (response.success) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    }

    return (<div className="bg-muted/50 min-h-min rounded-xl p-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="example card set" {...field} />
                            </FormControl>
                            <FormDescription>
                                The name of yor new card set
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FormLabel>Cards</FormLabel>
                    {fields.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={form.control}
                            name={`cards.${index}.value`}
                            render={({field}) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Input {...field} placeholder={`Card ${index + 1}`}/>
                                    </FormControl>
                                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                        <Minus/>
                                    </Button>
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button variant='outline' type="button" onClick={() => append({value: ''})}>
                        <Plus/>
                    </Button>
                </div>

                <Button type="submit">Save</Button>
            </form>
        </Form>
    </div>)
}