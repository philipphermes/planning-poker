import {getEmailInitials} from "~/utils/user";

export function Avatar({ email, extraClasses }: { email: string; extraClasses?: string }) {
    return (
        <div className={`avatar placeholder ${extraClasses || ''}`}>
            <div className="bg-emerald-100 text-base-100 w-6 md:w-10 rounded-full">
                <span className="text-xs">{getEmailInitials(email)}</span>
            </div>
        </div>
    );
}