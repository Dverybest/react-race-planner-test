import { IStage } from "../types";
export interface Error {
    show: boolean;
    message: string;
}
export const sortStages = (stages: IStage[]) => {
    return stages.sort((a: IStage, b: IStage) => {
        return new Date(a.date).getTime() < new Date(b.date).getTime()
            ? -1
            : new Date(a.date).getTime() < new Date(b.date).getTime()
                ? 1
                : 0;
    });
};
export const getDuration = (stages: IStage[]) => {
    if (stages.length === 0) return `0 days`;
    if (stages.length === 1) return `1 day`;
    const sortedStages = sortStages(stages);
    const newestDate = new Date(sortedStages[stages.length - 1].date);
    const oldestDate = new Date(sortedStages[0].date);
    const diffTime = Math.abs(newestDate.getTime() - oldestDate.getTime());
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return duration > 1 ? `${duration} days` : `${duration} day`;
};