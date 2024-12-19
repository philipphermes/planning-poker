import {Form} from '@remix-run/react';
import {ActionFunctionArgs, MetaFunction} from "@remix-run/node";
import {InputWithLabel} from "~/components/form/Input";
import {Button} from "~/components/form/Button";
import {getCurrentUser} from "~/.server/auth/user";
import {getAndValidateFormData} from "~/utils/formData";
import {roomSchema} from "~/validators/roomSchema";
import {createRoom} from "~/db/queries/roomQueries";
import {v4 as uuidV4} from "uuid";
import {toast} from "~/.server/toast/toast";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export async function action({request}: ActionFunctionArgs) {
    const user = await getCurrentUser(request);

    const result = await getAndValidateFormData(await request.formData(), request, roomSchema)
    if (result.init) return result

    const room = await createRoom({id: uuidV4(), name: result.name}, user.id)

    await toast.throwRedirectWithToasts(request, {
        message: room.id ? 'Room was created successfully!' : 'Failed to create new room!',
        status: room.id ? 'success' : 'error',
    }, '/rooms/' + room.id);
}

export default function Rooms() {
    return (
        <div className="w-full min-h-full flex justify-center items-center">
            <div className="w-full max-w-2xl card bg-base-300 rounded-box p-4">
                <Form method="post" className="space-y-6">
                    <InputWithLabel
                        type="text"
                        name="name"
                        placeholder="Type here"
                        label="Create new Room"
                        className="input-bordered"
                    />
                    <Button type="submit" text="Create Room" className="btn-outline btn-primary w-full"/>
                    <div className="divider">OR</div>
                    <label htmlFor="my-drawer" className="btn btn-outline drawer-button w-full">Show Rooms</label>
                </Form>
            </div>
        </div>
    );
}
