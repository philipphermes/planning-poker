import {CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import {useRouteLoaderData} from "@remix-run/react";
import {ReactElement, useEffect, useState} from "react";
import {loader} from "~/root";
import type {ToastMessage} from "remix-toast-notifications";

export type ToastConfig = {
    time: number;
    fps: number;
}

type ToastsProp = {
    key: number;
    message: ToastMessage;
    config: ToastConfig;
    offset: number;
}

const ToastIcons: Record<ToastMessage['status'], ReactElement> = {
    success: <CheckCircleIcon className="h-12" />,
    error: <XCircleIcon className="h-12" />,
    info: <InformationCircleIcon className="h-12" />,
    warning: <ExclamationCircleIcon className="h-12" />,
};

export default function Toasts(config: ToastConfig) {
    const toasts: ToastMessage[] = useRouteLoaderData<typeof loader>("root");

    return (
        <div className="fixed bottom-20 left-0 w-full flex flex-col items-center gap-2">
            {toasts && toasts.map((message, key) =>
                <Toast key={key} message={message} config={config} offset={key * 1000} />
            )}
        </div>
    )
}

function Toast({message, config, offset}: ToastsProp) {
    const [progress, setProgress] = useState(100);
    const time = config.time + offset;

    useEffect(() => {
        setProgress(100);
        const intervalDuration = 1000 / config.fps;
        const decrement = 100 / (time / intervalDuration);

        const progress = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress <= 0) return 0;
                return prevProgress - decrement;
            });
        }, intervalDuration);

        return () => clearInterval(progress);
    }, [config, message, time]);

    return (
        <div role="alert" className={
            `alert shadow-lg overflow-hidden w-96 transform transition-all duration-300 ease-out alert-${message.status}`
            + (progress > 0 ? " translate-y-0 opacity-100" : " translate-y-10 opacity-0")
        }>
            {ToastIcons[message.status]}
            <div className="w-full">
                <span>{message.message}</span>
                <progress className="progress progress-base-100 bg-base-100/25 w-full" value={progress} max="100"></progress>
            </div>
        </div>
    )
}