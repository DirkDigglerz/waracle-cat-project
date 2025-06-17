import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const API_BASE_URL = "https://api.thecatapi.com/v1";
const API_KEY = process.env.CAT_API_KEY || "";

type VoteResult =
  | { success: true; id: string }
  | { success: false; error: string };

type RemoveVoteResult =
  | { success: true; deletedVoteId: string }
  | { success: false; error: string | "no_vote_found" };

type FavouriteResult =
  | { success: true; id: string }
  | { success: false; error: string | "already_favourited" };

type UnfavouriteResult =
  | { success: true; id: number }
  | { success: false; error: string };

export const cats = router({
  voteCat: publicProcedure
    .input(
      z.object({
        imageId: z.string().min(1, "Image ID is required"),
        userId: z.string().min(1, "User ID is required"),
        value: z.enum(["up", "down"]),
      })
    )
    .mutation(async ({ input }): Promise<VoteResult> => {
      const voteValue = input.value === "up" ? 1 : 0;

      try {
        const response = await fetch(`${API_BASE_URL}/votes`, {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_id: input.imageId,
            sub_id: input.userId,
            value: voteValue,
          }),
        });

        if (!response.ok) {
          const errorText = (await response.text()).trim();
          console.error(
            "Failed to vote on cat, status:",
            response.status,
            errorText
          );
          return { success: false, error: `HTTP ${response.status}: ${errorText}` };
        }

        const data = await response.json();
        return { success: true, id: data.id };
      } catch (err) {
        console.error("Unexpected error voting on cat:", err);
        return { success: false, error: "Unexpected error" };
      }
    }),

  removeVote: publicProcedure
    .input(
      z.object({
        imageId: z.string().min(1, "Image ID is required"),
        userId: z.string().min(1, "User ID is required"),
      })
    )
    .mutation(async ({ input }): Promise<RemoveVoteResult> => {
      try {
        const votesResponse = await fetch(
          `${API_BASE_URL}/votes?sub_id=${input.userId}`,
          {
            method: "GET",
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!votesResponse.ok) {
          console.error("Failed to fetch votes to find vote ID");
          return { success: false, error: "Failed to fetch votes" };
        }

        const votes = await votesResponse.json();
        const voteToDelete = votes.find(
          (vote: { image_id: string }) => vote.image_id === input.imageId
        );

        if (!voteToDelete) {
          return { success: false, error: "no_vote_found" };
        }

        const deleteResponse = await fetch(
          `${API_BASE_URL}/votes/${voteToDelete.id}`,
          {
            method: "DELETE",
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!deleteResponse.ok) {
          const errorText = (await deleteResponse.text()).trim();
          console.error(
            "Failed to delete vote, status:",
            deleteResponse.status,
            errorText
          );
          return { success: false, error: `HTTP ${deleteResponse.status}: ${errorText}` };
        }

        return { success: true, deletedVoteId: voteToDelete.id };
      } catch (err) {
        console.error("Unexpected error removing vote:", err);
        return { success: false, error: "Unexpected error" };
      }
    }),

  favouriteCat: publicProcedure
    .input(
      z.object({
        imageId: z.string().min(1, "Image ID is required"),
        userId: z.string().min(1, "User ID is required"),
      })
    )
    .mutation(async ({ input }): Promise<FavouriteResult> => {
      try {
        const response = await fetch(`${API_BASE_URL}/favourites`, {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_id: input.imageId,
            sub_id: input.userId,
          }),
        });

        if (!response.ok) {
          const errorText = (await response.text()).trim();
          console.error(
            "Failed to favourite cat, status:",
            response.status,
            errorText
          );

          if (errorText.includes("DUPLICATE_FAVOURITE")) {
            return { success: false, error: "already_favourited" };
          }

          return { success: false, error: `HTTP ${response.status}: ${errorText}` };
        }

        const data = await response.json();
        return { success: true, id: data.id };
      } catch (err) {
        console.error("Unexpected error favouriting cat:", err);
        return { success: false, error: "Unexpected error" };
      }
    }),

  unfavouriteCat: publicProcedure
    .input(
      z.object({
        favouriteId: z.number().min(1, "Favourite ID is required"),
      })
    )
    .mutation(async ({ input }): Promise<UnfavouriteResult> => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/favourites/${input.favouriteId}`,
          {
            method: "DELETE",
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = (await response.text()).trim();
          console.error(
            "Failed to unfavourite cat, status:",
            response.status,
            errorText
          );
          return { success: false, error: "Failed to unfavourite cat" };
        }

        return { success: true, id: input.favouriteId };
      } catch (err) {
        console.error("Unexpected error unfavouriting cat:", err);
        return { success: false, error: "Unexpected error" };
      }
    }),

  userFavourites: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "ID is required"),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${API_BASE_URL}/favourites?sub_id=${input.userId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch favourites");
      }

      const favourites = await response.json();
      return favourites.map((fav: { id: string; image_id: string }) => ({
        id: fav.id,
        imageId: fav.image_id,
      }));
    }),

  userVotes: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "ID is required"),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${API_BASE_URL}/votes?sub_id=${input.userId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch votes");
      }

      const votes = await response.json();
      return votes.map(
        (vote: { id: number; image_id: string; value: number }) => ({
          id: vote.id.toString(),
          imageId: vote.image_id,
          value: vote.value === 1 ? "up" : "down",
        })
      );
    }),

  getFavourites: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "ID is required"),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${API_BASE_URL}/favourites?sub_id=${input.userId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch favourites");
      }

      const favourites = await response.json();
      return favourites.map((fav: { id: string; image_id: string }) => ({
        id: fav.id,
        imageId: fav.image_id,
      }));
    }),

  get: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "ID is required"),
        limit: z.number().min(1, "Limit must be at least 1").default(20),
        page: z.number().min(0, "Page must be at least 0").default(0),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${API_BASE_URL}/images?limit=${input.limit}&page=${input.page}&order=DESC&sub_id=${input.userId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cats");
      }

      return response.json();
    }),
});
