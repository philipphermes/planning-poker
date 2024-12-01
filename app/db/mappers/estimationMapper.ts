import { SelectEstimation, SelectUser } from "../schema/schema";
import { Estimation } from "~/models/Estimation";
import { toUser } from "./userMapper";

export function toEstimation(estimation: SelectEstimation, user?: SelectUser): Estimation {
    const roundTransfer = new Estimation(
        estimation.time,
        estimation.id,
        user ? toUser(user) : undefined
    );

    return roundTransfer
}