import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouteLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { loader } from "~/root";

export interface ToastConfig {
    time: number;
    fps: number;
}

export default function Toasts({ time, fps }: ToastConfig) {
    const toasts = useRouteLoaderData<typeof loader>("root");
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setProgress(100);

        const progress = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress <= 0) {
                    return 0;
                }
                return prevProgress - (fps / 100);
            });
        }, time / 100 * (fps / 100));

        return () => {
            clearInterval(progress);
        };
    }, [toasts]);

    return (
        <div className="fixed bottom-20 left-0 w-full flex flex-col items-center gap-2">
            {toasts && toasts.map((toastMessage, key) =>
                <div role="alert" className={
                    "alert shadow-lg overflow-hidden w-96 transform transition-all duration-300 ease-out "
                    + (toastMessage.status ? "alert-success" : "alert-error")
                    + (progress > 0 ? " translate-y-0 opacity-100" : " translate-y-10 opacity-0")
                } key={key}>
                    {toastMessage.status ? (<CheckCircleIcon className="h-12" />) : (<XCircleIcon className="h-12" />)}
                    <div className="w-full">
                        <span>{toastMessage.message}</span>
                        <progress className="progress progress-accent w-full" value={progress} max="100"></progress>
                    </div>
                </div>
            )}
        </div>
    )
}