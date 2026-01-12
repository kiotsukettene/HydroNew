export interface TipItem {
  heading: string;
  tips: string[];
}

export interface TipsSuggestion {
  category: string;
  title: string;
  description: string;
  bullet_points: TipItem[];
}

export interface TipsResponse {
  quality: string;
  tips: {
    category: string;
    title: string;
    description: string;
    bullet_points: {
      heading: string;
      tips: string[];
    }[];
  };
}

