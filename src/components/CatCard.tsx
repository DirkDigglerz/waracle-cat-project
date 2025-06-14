"use client";

import { trpc } from "@/app/client/trpc";
import { CatProps } from "@/types";
import { Box, Flex, Image, Text } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { CatControl } from "./CatControl";
import debounce from "lodash.debounce";

export interface CatCardProps extends CatProps {
  userId: string;
  voteValue?: "up" | "down" | null;
  favouriteId?: string | null;
}

export default function CatCard(props: CatCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Use tRPC utils for cleaner cache manipulation
  const utils = trpc.useUtils();

  // Get current vote from cache - no need for separate query since we're using optimistic updates
  const userVotesQuery = trpc.cats.userVotes.useQuery({ userId: props.userId });
  interface Vote {
    id: string;
    imageId: string;
    value: "up" | "down";
    userId: string;
  }

  const currentVote: "up" | "down" | null = (userVotesQuery.data as Vote[] | undefined)?.find((vote: Vote) => vote.imageId === props.id)?.value || props.voteValue || null;

  // Calculate score based on current vote
  const score = currentVote === "up" ? 1 : currentVote === "down" ? -1 : 0;

  const favouriteCat = trpc.cats.favouriteCat.useMutation({
    onMutate: async () => {
      // Cancel outgoing refetches to prevent them from overwriting optimistic update
      await utils.cats.userFavourites.cancel({ userId: props.userId });

      // Snapshot the previous value
      const previousFavourites = utils.cats.userFavourites.getData({ userId: props.userId }) || [];

      // Optimistically update to the new value
      const newFav = { 
        id: 'temp-fav-id-' + props.id, 
        imageId: props.id 
      };
      
      utils.cats.userFavourites.setData(
        { userId: props.userId }, 
        [...previousFavourites, newFav]
      );

      return { previousFavourites };
    },
    onError: (error, variables, context) => {
      console.error("Failed to favourite cat:", error);
      if (context?.previousFavourites) {
        utils.cats.userFavourites.setData(
          { userId: props.userId }, 
          context.previousFavourites
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      utils.cats.userFavourites.invalidate({ userId: props.userId });
    },
  });

  const unfavouriteCat = trpc.cats.unfavouriteCat.useMutation({
    onMutate: async () => {
      await utils.cats.userFavourites.cancel({ userId: props.userId })
      interface Favourite {
        id: string;
        imageId: string;
      }
      const previousFavourites: Favourite[] = utils.cats.userFavourites.getData({ userId: props.userId }) || [];
      const updatedFavourites: Favourite[] = previousFavourites.filter((fav: Favourite) => fav.id !== props.favouriteId);
    
      utils.cats.userFavourites.setData(
        { userId: props.userId }, 
        updatedFavourites
      );

      return { previousFavourites };
    },
    onError: (error, variables, context) => {
      console.error("Failed to unfavourite cat:", error);
      if (context?.previousFavourites) {
        utils.cats.userFavourites.setData(
          { userId: props.userId }, 
          context.previousFavourites
        );
      }
    },
    onSettled: () => {
      utils.cats.userFavourites.invalidate({ userId: props.userId });
    },
  });

  // Vote mutations
  const voteCat = trpc.cats.voteCat.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.cats.userVotes.cancel({ userId: props.userId });

      // Snapshot previous votes
      const previousVotes = utils.cats.userVotes.getData({ userId: props.userId }) || [];

      // Update cache optimistically
      interface Vote {
        id: string;
        imageId: string;
        value: "up" | "down";
        userId: string;
      }
      const existingVoteIndex: number = previousVotes.findIndex((vote: Vote) => vote.imageId === props.id);
      let updatedVotes;
      
      if (existingVoteIndex >= 0) {
        // Update existing vote
        updatedVotes = [...previousVotes];
        updatedVotes[existingVoteIndex] = {
          ...updatedVotes[existingVoteIndex],
          value: variables.value
        };
      } else {
        // Add new vote
        updatedVotes = [
          ...previousVotes,
          {
            id: 'temp-vote-id-' + props.id,
            imageId: props.id,
            value: variables.value,
            userId: props.userId
          }
        ];
      }

      utils.cats.userVotes.setData({ userId: props.userId }, updatedVotes);

      return { previousVotes };
    },
    onError: (error, variables, context) => {
      console.error("Failed to vote on cat:", error);
      // Revert optimistic updates
      if (context?.previousVotes) {
        utils.cats.userVotes.setData({ userId: props.userId }, context.previousVotes);
      }
    },
    onSettled: () => {
      utils.cats.userVotes.invalidate({ userId: props.userId });
    },
  });

  const removeVote = trpc.cats.removeVote.useMutation({
    onMutate: async () => {
      await utils.cats.userVotes.cancel({ userId: props.userId });

      const previousVotes = utils.cats.userVotes.getData({ userId: props.userId }) || [];
      interface Vote {
        id: string;
        imageId: string;
        value: "up" | "down";
        userId: string;
      }
      const updatedVotes: Vote[] = previousVotes.filter((vote: Vote) => vote.imageId !== props.id);

      utils.cats.userVotes.setData({ userId: props.userId }, updatedVotes);

      return { previousVotes };
    },
    onError: (error, variables, context) => {
      console.error("Failed to remove vote:", error);
      if (context?.previousVotes) {
        utils.cats.userVotes.setData({ userId: props.userId }, context.previousVotes);
      }
    },
    onSettled: () => {
      utils.cats.userVotes.invalidate({ userId: props.userId });
    },
  });

  const debouncedToggle = useRef(
    debounce((favouriteId, id, userId) => {
      if (favouriteId) {
        if (!favouriteId) return;
        unfavouriteCat.mutate({ favouriteId: Number(favouriteId) });
      } else {
        favouriteCat.mutate({ imageId: id, userId });
      }
    }, 500)
  ).current;

  const debouncedVote = useRef(
    debounce((voteType: "up" | "down", imageId: string, userId: string) => {
      voteCat.mutate({ 
        imageId, 
        userId, 
        value: voteType 
      });
    }, 300)
  ).current;

  const debouncedRemoveVote = useRef(
    debounce((imageId: string, userId: string) => {
      removeVote.mutate({ imageId, userId });
    }, 300)
  ).current;

  const toggleFavourite = useCallback(() => {
    debouncedToggle(props.favouriteId, props.id, props.userId);
  }, [props.favouriteId, props.id, props.userId]);

  const vote = useCallback((voteType: "up" | "down") => {
    if (currentVote === voteType) {
      // Remove vote if clicking the same vote type
      debouncedRemoveVote(props.id, props.userId);
    } else {
      // Add or change vote
      debouncedVote(voteType, props.id, props.userId);
    }
  }, [currentVote, props.id, props.userId, debouncedVote, debouncedRemoveVote]);
    
  const favouritePending = favouriteCat.isPending || unfavouriteCat.isPending;
  const votePending = voteCat.isPending || removeVote.isPending;

  return (
    <Box
      w="100%"
      h="100%"
      pos="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
        aspectRatio: "1 / 1",
        userSelect: "none",
      }}
    >
      <Flex
        w="100%"
        h="100%"
        pos="relative"
        justify="center"
        align="center"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05))",
          backdropFilter: "blur(20px)",
          border: `1px solid rgba(255, 255, 255, ${isHovered ? 0.3 : 0.2})`,
          borderRadius: 24,
          overflow: "hidden",
          transition: "all 0.4s ease",
          transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          opacity: loaded ? 1 : 0,
        }}
      >
        <Box w="100%" h="100%" pos="relative" style={{ borderRadius: 20, overflow: "hidden" }}>
          <Image
            src={props.url}
            alt={`Cat ${props.id}`}
            onLoad={() => setLoaded(true)}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              transition: "transform 0.4s ease",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          />
          <Box
            pos="absolute"
            inset={0}
            style={{
              background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)",
              opacity: isHovered ? 1 : 0.8,
              transition: "opacity 0.3s ease",
            }}
          />
        </Box>

        <Flex
          pos="absolute"
          // bg='red'
          h='fit-content'
          bottom={0}
          left={0}
          right={0}
          p="sm"
          pr="md"
          pl="md"
          align="center"
          justify="space-between"
          gap="md"
          style={{ 
            transform: isHovered ? "translateY(0)" : "translateY(8px)",
            opacity: isHovered ? 1 : 0.9,
            transition: "all 0.3s ease",
          }}
        >
          <CatControl
            name="Heart"
            color="rgba(255, 255, 255, 0.9)"
            fill={props.favouriteId ? "#ff6b6b" : "none"}
            onClick={toggleFavourite}
            disabled={favouritePending}
          />
          <Text  fw={600} c={
            currentVote === "up" ? "#4caf50" : currentVote === "down" ? "#f44336" : "rgba(255, 255, 255, 0.9)"
          } size="md">
            {score > 0 ? `+${score}` : `${score}`}
          </Text>
          <Flex gap="md">
            <CatControl
              name="ThumbsUp"
              color="rgba(255, 255, 255, 0.9)"
              fill={currentVote === "up" ? "#4caf50" : "none"}
              onClick={() => vote("up")}
              disabled={votePending}
            />
            <CatControl
              name="ThumbsDown"
              color="rgba(255, 255, 255, 0.9)"
              fill={currentVote === "down" ? "#f44336" : "none"}
              onClick={() => vote("down")}
              disabled={votePending}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}