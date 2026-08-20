export interface UpcomingGame {
  id: string;
  title: string;
  image: string;
  imagePublicId?: string;
  order?: number;
  [key: string]: unknown;
}

export const defaultUpcomingGames: UpcomingGame[] = [];
