'use client'

import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/shadcn-io/dropzone";
import {useState} from "react";
import imageCompression from "browser-image-compression";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {UserDto} from "@/features/user/shared/user.types";
import {useSession} from "next-auth/react";

type UserFormProps = {
    user: UserDto;
}

export function AccountImage({user}: UserFormProps) {
    const {update} = useSession();
    const [files, setFiles] = useState<File[]>([]);
    const [filePreview, setFilePreview] = useState<string | null>(user.image);

    const handleDrop = async (files: File[]) => {
        if (files.length > 0) {
            const firstFile = files[0];

            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 200,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(firstFile, options);
                setFiles([compressedFile])

                const formData = new FormData();
                formData.append("file", compressedFile);

                const response = await fetch("/api/account/image", {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json();
                if (responseData.success) {
                    await update({name: user.name, image: responseData.data?.image});
                    toast.success(responseData.message);
                } else {
                    toast.error(responseData.message);
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    if (typeof e.target?.result === 'string') {
                        setFilePreview(e.target.result);
                    }
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                toast.error('Unexpected error accrued');
                console.error(error);
            }
        }
    };

    const handleDelete = async () => {
        const response = await fetch("/api/account/image", {
            method: "DELETE",
        });

        const responseData = await response.json();
        if (responseData.success) {
            toast.success(responseData.message);
        } else {
            toast.error(responseData.message);
        }

        setFilePreview(null);
    };

    const handleError = () => {
        toast.error('Failed to upload image. Only one file is allowed and it has to be a jpeg or png!');
    }

    return (<div className='flex flex-col gap-2'>
        <Dropzone
            accept={{'image/png,': ['png'], 'image/jpeg': ['jpeg', 'jpg']}}
            onDrop={handleDrop}
            onError={handleError}
            className='w-full h-36 cursor-pointer'
            maxFiles={1}
            src={files}
        >
            <DropzoneEmptyState />
            <DropzoneContent>
                {filePreview && (
                    <div className="h-full w-full flex justify-center items-center">
                        <img
                            alt="Preview"
                            className="absolute h-full p-2 aspect-square object-cover object-center"
                            src={filePreview}
                        />
                    </div>
                )}
            </DropzoneContent>
        </Dropzone>
        <Button variant='outline' type='button' onClick={handleDelete} className='cursor-pointer'>Delete</Button>
    </div>)
}