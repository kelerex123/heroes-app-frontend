import { heroApi } from "../api/hero.api"
import type { SummaryInformationResponse } from "../types/summary-information.response";

// const BASE_URL = import.meta.env.VITE_API_URL;

export const getSummaryAction = async () => {
    const { data } = await heroApi.get<SummaryInformationResponse>('/summary');

    return data;
}