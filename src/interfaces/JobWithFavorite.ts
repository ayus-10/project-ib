export interface JobWithFavorite {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  userId: number;
  created: Date;
  deadline: Date;
  type: string;
  isFavorite?: boolean;
}
