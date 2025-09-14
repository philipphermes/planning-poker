'use client'

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Check, ChevronsUpDown, Minus, Plus} from "lucide-react";
import {toast} from "sonner";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/shared/utils";
import {formRoomSchema} from "@/features/room/shared/room.validations";
import {CardSetDto} from "@/features/card-set/shared/card-set.types";
import {UserDto} from "@/features/user/shared/user.types";
import {RoomDto} from "@/features/room/shared/room.types";
import {persistRoomAction} from "@/features/room/server/room.actions";
import Link from "next/link";

export function RoomForm({userCardSets, userList, roomWithUsers}: {
    userCardSets: CardSetDto[],
    userList: UserDto[],
    roomWithUsers?: RoomDto
}) {
    const form = useForm<z.infer<typeof formRoomSchema>>({
        resolver: zodResolver(formRoomSchema),
        defaultValues: {
            name: roomWithUsers?.name ?? '',
            cardSetId: roomWithUsers?.cardSetId ?? '',
            userIds: [],
        },
        values: {
            id: roomWithUsers?.id,
            name: roomWithUsers?.name ?? '',
            cardSetId: roomWithUsers?.cardSetId ?? '',
            userIds: roomWithUsers?.participants?.map(roomParticipant => (roomParticipant.id ?? '')).filter(id => id !== roomWithUsers?.ownerId) ?? []
        }
    })

    async function onSubmit(data: z.infer<typeof formRoomSchema>) {
        const response = await persistRoomAction(data);
        if (response.success) {
            toast.success(response.message)
            form.reset();
        } else {
            toast.error(response.message)
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
                                <Input placeholder="example room" {...field} />
                            </FormControl>
                            <FormDescription>
                                The name of yor new room
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cardSetId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Card Set</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='cursor-pointer'>
                                        <SelectValue placeholder="Select a card set"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userCardSets.map(cardSet => (
                                            <SelectItem className='cursor-pointer' key={cardSet.id} value={cardSet.id}>{cardSet.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Choose a card set for your room. <br/>
                                No card sets? Create one <Link href='/card-set' className='underline cursor-pointer'>here</Link>!
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FormLabel>Users</FormLabel>
                    {form.watch("userIds")?.map((userId, index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={`userIds.${index}`}
                            render={({field}) => (
                                <FormItem className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild className='cursor-pointer'>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {(() => {
                                                        const selectedUser = userList.find(user => user.id === field.value);
                                                        return selectedUser
                                                            ? selectedUser.name ?? selectedUser.email
                                                            : "Select user";
                                                    })()}
                                                    <ChevronsUpDown className="opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search user..." className="h-9"/>
                                                <CommandList>
                                                    <CommandEmpty>No user found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {userList.map((user) => (
                                                            <CommandItem
                                                                value={user.name ?? user.email}
                                                                key={user.id}
                                                                onSelect={() => {
                                                                    if (user.id) {
                                                                        const current = [...form.getValues("userIds")];
                                                                        current[index] = user.id;
                                                                        form.setValue("userIds", current, {shouldValidate: true});
                                                                    }
                                                                }}
                                                            >
                                                                {user.name ?? user.email}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        user.id === field.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className='cursor-pointer'
                                        onClick={() => {
                                            const current = [...form.getValues("userIds")];
                                            current.splice(index, 1);
                                            form.setValue("userIds", current, {shouldValidate: true});
                                        }}
                                    >
                                        <Minus/>
                                    </Button>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button variant='outline' className='cursor-pointer' type="button" onClick={() => {
                        const current = form.getValues("userIds") || [];
                        form.setValue("userIds", [...current, ""], {shouldValidate: false});
                    }}>
                        <Plus/>
                    </Button>
                </div>

                <Button type="submit" className='cursor-pointer'>Save</Button>
            </form>
        </Form>
    </div>)
}