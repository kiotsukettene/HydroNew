export type WaterQuality = {
    pHLevel: numnber;
    status: 'Good' | 'Poor';
    level: 'Low' | 'Medium' | 'High';
}

export type GrowthProgess = {
    plantType: string;
    percentage: number;
}

export type HomeProps = {
  waterQuality: WaterQuality;
  growth: GrowthProgress;
};