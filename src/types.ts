

export type CatProps = {
  breed_ids: string | null;
  breeds: { id: string; name: string; temperament: string; origin: string; description: string; }[];
  created_at: string;
  height: number;
  id: string;
  original_filename: string;
  sub_id: string;
  url: string;
  width: number;
};

export type FavouriteProps = {
  id: number;
  imageId: string;
}

export type VoteProps = {
  id: number;
  imageId: string;
  value: number; // 1 for upvote, 0 for downvote
  sub_id: string;
};


export type UseCatStore = {
  loaded?: boolean;
  cats: CatProps[];
  favourites: FavouriteProps[];
  votes: VoteProps[];

};