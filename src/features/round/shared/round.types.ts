import {EstimateDto} from "@/features/estimate/shared/estimate.types";

export interface RoundDto {
    id: string | null;
    name: string;
    roomId: string;
    status: string;
    estimates?: EstimateDto[];
}