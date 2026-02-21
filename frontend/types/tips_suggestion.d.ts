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
  category: string;
  title: string;
  description: string;
  warnings: string[];
  bullet_points: TipItem[];
}

