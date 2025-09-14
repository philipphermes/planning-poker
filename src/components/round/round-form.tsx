'use client'

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {RoundDto} from "@/features/round/shared/round.types";
import {RoomDto} from "@/features/room/shared/room.types";
import {UserDto} from "@/features/user/shared/user.types";
import {roundSchemaInputFormSchema} from "@/features/round/shared/round.validations";
import {useSocket} from "@/features/socket/client/socket.hooks";

export function RoundForm({round, room, user}: { round?: RoundDto, room: RoomDto, user: UserDto }) {
    const {socket} = useSocket();
    const form = useForm<z.infer<typeof roundSchemaInputFormSchema>>({
        resolver: zodResolver(roundSchemaInputFormSchema),
        defaultValues: {
            name: '',
        },
        values: {
            id: round?.id ?? undefined,
            roomId: room.id,
            name: round?.status === 'active' ? round?.name ?? '' : '',
        }
    })

    if (room.ownerId !== user.id) {
        return null;
    }

    async function onSubmit(data: z.infer<typeof roundSchemaInputFormSchema>) {
        if (!socket) return;

        if (round?.status === 'active') {
            socket.emit('reveal', data);
        } else {
            socket.emit('new-round', data);
        }
    }

    return (<div className="bg-muted/50 rounded-xl min-h-min p-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input readOnly={round?.status === 'active'} placeholder="example round" {...field} />
                            </FormControl>
                            <FormDescription>
                                The name of the new round
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className='cursor-pointer'>
                    {round?.status === 'active' ? 'Flip Cards' : 'New Round'}
                </Button>
            </form>
        </Form>
    </div>)
}