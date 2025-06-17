// api.ts
import { trpc } from '@/app/client/trpc';
import { useCallback, useRef } from 'react';
import { useThrottledCallback } from '@mantine/hooks';
import { FavouriteProps, VoteProps } from '@/types';

export function useUserVotes(userId: string) {
  return trpc.cats.userVotes.useQuery({ userId });
}

export function useUserFavourites(userId: string) {
  return trpc.cats.userFavourites.useQuery({ userId });
}

export function useFavouriteCat(userId: string, imageId: string) {
  const utils = trpc.useUtils();

  return trpc.cats.favouriteCat.useMutation({
    onMutate: async () => {
      await utils.cats.userFavourites.cancel({ userId });
      const previousFavourites = utils.cats.userFavourites.getData({ userId }) || [];
      const newFav: FavouriteProps = {
        id: 9999999, // temporary ID for optimistic update
        imageId,
      };

      utils.cats.userFavourites.setData({ userId }, [...previousFavourites, newFav]);

      return { previousFavourites };
    },
    onError: (error, variables, context) => {
      if (context?.previousFavourites) {
        utils.cats.userFavourites.setData({ userId }, context.previousFavourites);
      }
    },
    onSettled: () => {
      utils.cats.userFavourites.invalidate({ userId });
    },
  });
}

export function useUnfavouriteCat(userId: string) {
  const utils = trpc.useUtils();

  return trpc.cats.unfavouriteCat.useMutation({
    onMutate: async ({ favouriteId }: { favouriteId: number }) => {
      await utils.cats.userFavourites.cancel({ userId });
      const previousFavourites: FavouriteProps[] = utils.cats.userFavourites.getData({ userId }) || [];
      const updatedFavourites = previousFavourites.filter(fav => fav.id !== favouriteId);

      utils.cats.userFavourites.setData({ userId }, updatedFavourites);

      return { previousFavourites };
    },
    onError: (error, variables, context) => {
      if (context?.previousFavourites) {
        utils.cats.userFavourites.setData({ userId }, context.previousFavourites);
      }
    },
    onSettled: () => {
      utils.cats.userFavourites.invalidate({ userId });
    },
  });
}

export function useVoteCat(userId: string) {
  const utils = trpc.useUtils();

  return trpc.cats.voteCat.useMutation({
    onMutate: async (variables: { imageId: string; value: "up" | "down" }) => {
      await utils.cats.userVotes.cancel({ userId });
      const previousVotes = utils.cats.userVotes.getData({ userId }) || [];

      const existingVoteIndex = previousVotes.findIndex((vote: VoteProps) => vote.imageId === variables.imageId);

      let updatedVotes: VoteProps[];
      if (existingVoteIndex >= 0) {
        // Update existing vote
        updatedVotes = [...previousVotes];
        updatedVotes[existingVoteIndex] = {
          ...updatedVotes[existingVoteIndex],
          value: variables.value === "up" ? 1 : 0,
        };
      } else {
        // Add new vote
        const newVote: VoteProps = {
          id: 9999999, // temporary ID for optimistic update
          imageId: variables.imageId,
          value: variables.value === "up" ? 1 : 0,
          sub_id: userId,
        };
        updatedVotes = [...previousVotes, newVote];
      }

      utils.cats.userVotes.setData({ userId }, updatedVotes);

      return { previousVotes };
    },
    onError: (error, variables, context) => {
      if (context?.previousVotes) {
        utils.cats.userVotes.setData({ userId }, context.previousVotes);
      }
    },
    onSettled: () => {
      utils.cats.userVotes.invalidate({ userId });
    },
  });
}

export function useRemoveVote(userId: string) {
  const utils = trpc.useUtils();

  return trpc.cats.removeVote.useMutation({
    onMutate: async ({ imageId }: { imageId: string }) => {
      await utils.cats.userVotes.cancel({ userId });
      const previousVotes = utils.cats.userVotes.getData({ userId }) || [];

      const updatedVotes = previousVotes.filter(
        (vote: VoteProps) => vote.imageId !== imageId
      );

      // Optimistically update
      utils.cats.userVotes.setData({ userId }, updatedVotes);

      return { previousVotes };
    },
    onError: (error, variables, context) => {
      if (context?.previousVotes) {
        utils.cats.userVotes.setData({ userId }, context.previousVotes);
      }
    },
    onSettled: () => {
      utils.cats.userVotes.invalidate({ userId });
    },
  });
}


// Combined hook for easier usage in components
export function useCatActions(userId: string, imageId: string) {
  const favouriteCat = useFavouriteCat(userId, imageId);
  const unfavouriteCat = useUnfavouriteCat(userId);
  const voteCat = useVoteCat(userId);
  const removeVote = useRemoveVote(userId);

  // Throttled favourite toggle
  const toggleFavourite = useThrottledCallback((favouriteId: number | null | undefined) => {
    if (!imageId || !userId) return;

    if (favouriteId != null) {
      unfavouriteCat.mutate({ favouriteId });
    } else {
      favouriteCat.mutate({ imageId, userId });
    }
  }, 250);

  // Throttled vote functions
  const throttledVote = useRef(
    useThrottledCallback((voteType: "up" | "down") => {
      voteCat.mutate({ imageId, userId, value: voteType });
    }, 300)
  ).current;

  const throttledRemoveVote = useRef(
    useThrottledCallback(() => {
      removeVote.mutate({ imageId, userId });
    }, 300)
  ).current;

  // Vote handler that manages up/down/remove logic
  const handleVote = useCallback((voteType: "up" | "down", currentVote: "up" | "down" | null) => {
    if (currentVote === voteType) {
      throttledRemoveVote();
    } else {
      throttledVote(voteType);
    }
  }, [throttledVote, throttledRemoveVote]);

  return {
    toggleFavourite,
    handleVote,
    isPending: {
      favourite: favouriteCat.isPending || unfavouriteCat.isPending,
      vote: voteCat.isPending || removeVote.isPending,
    },
  };
}