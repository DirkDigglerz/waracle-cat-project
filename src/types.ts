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

export type VoteResult =
  | { success: true; id: string }
  | { success: false; error: string };

export type RemoveVoteResult =
  | { success: true; deletedVoteId: string }
  | { success: false; error: string | "no_vote_found" };

export type FavouriteResult =
  | { success: true; id: string }
  | { success: false; error: string | "already_favourited" };

export type UnfavouriteResult =
  | { success: true; id: number }
  | { success: false; error: string };

export type UploadResult =
  | { success: true; id: string; url: string }
  | { success: false; error: string };

// Extended types for CatCard component
export interface CatCardProps extends CatProps {
  userId: string;
  voteValue?: "up" | "down" | null;
  favouriteId?: number | null;
}

// Internal types for tRPC operations
export interface Vote {
  id: string;
  imageId: string;
  value: "up" | "down";
  userId: string;
}

export interface Favourite {
  id: string;
  imageId: string;
}

// Mutation variable types
export interface FavouriteMutationVariables {
  imageId: string;
  userId: string;
}

export interface UnfavouriteMutationVariables {
  favouriteId: number;
}

export interface VoteMutationVariables {
  imageId: string;
  userId: string;
  value: "up" | "down";
}

export interface RemoveVoteMutationVariables {
  imageId: string;
  userId: string;
}

// Context types for optimistic updates
export interface FavouriteContext {
  previousFavourites: Favourite[];
}

export interface VoteContext {
  previousVotes: Vote[];
}

// Utility type for vote values
export type VoteValue = "up" | "down" | null;