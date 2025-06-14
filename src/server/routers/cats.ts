import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const API_BASE_URL = "https://api.thecatapi.com/v1";
const API_KEY = process.env.NEXT_PUBLIC_CAT_API_KEY || "";

interface VoteApiResponse {
  id: string;
}

interface VoteApiItem {
  id: number;
  image_id: string;
  value: number;
}

interface FavouriteApiResponse {
  id: string;
}

interface FavouriteApiItem {
  id: string;
  image_id: string;
}

// ---- Input schemas ----

const voteInputSchema = z.object({
  imageId: z.string().min(1, "Image ID is required"),
  userId: z.string().min(1, "User ID is required"),
  value: z.enum(["up", "down"]),
});

const removeVoteInputSchema = z.object({
  imageId: z.string().min(1, "Image ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

const favouriteInputSchema = z.object({
  imageId: z.string().min(1, "Image ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

const unfavouriteInputSchema = z.object({
  favouriteId: z.number().min(1, "Favourite ID is required"),
});

const userIdInputSchema = z.object({
  userId: z.string().min(1, "ID is required"),
});

const getCatsInputSchema = z.object({
  userId: z.string().min(1, "ID is required"),
  limit: z.number().min(1, "Limit must be at least 1").default(20),
  page: z.number().min(0, "Page must be at least 0").default(0),
});

// ---- Output schemas ----

const voteCatOutputSchema = z.string().or(z.literal("failed_but_ignored"));

const removeVoteOutputSchema = z
  .object({
    success: z.boolean(),
    deletedVoteId: z.number().optional(),
    message: z.string().optional(),
  })
  .or(z.literal("no_vote_found"))
  .or(z.literal("failed_but_ignored"));

const favouriteCatOutputSchema = z
  .string()
  .or(z.literal("already_favourited"))
  .or(z.literal("failed_but_ignored"));

const unfavouriteCatOutputSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  message: z.string().optional(),
});

const userFavouritesOutputSchema = z.array(
  z.object({
    id: z.string(),
    imageId: z.string(),
  })
);

const userVotesOutputSchema = z.array(
  z.object({
    id: z.number(),
    imageId: z.string(),
    value: z.enum(["up", "down"]),
  })
);

const getCatsOutputSchema = z.array(
  z.object({
    id: z.string(),
    url: z.string(),
    width: z.number(),
    height: z.number(),
    breeds: z.array(z.any()), // Adjust if you know breed schema
    categories: z.array(z.any()), // Adjust if you know category schema
  })
);

// ---- Router ----

export const cats = router({
  voteCat: publicProcedure
    .input(voteInputSchema)
    .output(voteCatOutputSchema)
    .mutation(async ({ input }): Promise<string | "failed_but_ignored"> => {
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
          console.error("Failed to vote on cat, status:", response.status, errorText);
          return "failed_but_ignored";
        }

        const data: VoteApiResponse = await response.json();
        return data.id;
      } catch (err) {
        console.error("Unexpected error voting on cat:", err);
        return "failed_but_ignored";
      }
    }),

  removeVote: publicProcedure
    .input(removeVoteInputSchema)
    .output(removeVoteOutputSchema)
    .mutation(
      async ({
        input,
      }): Promise<
        | { success: boolean; deletedVoteId?: number; message?: string }
        | "no_vote_found"
        | "failed_but_ignored"
      > => {
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
            return "failed_but_ignored";
          }

          const votes: VoteApiItem[] = await votesResponse.json();
          const voteToDelete = votes.find((vote) => vote.image_id === input.imageId);

          if (!voteToDelete) {
            return "no_vote_found";
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
            console.error("Failed to delete vote, status:", deleteResponse.status, errorText);
            return "failed_but_ignored";
          }

          return { success: true, deletedVoteId: voteToDelete.id };
        } catch (err) {
          console.error("Unexpected error removing vote:", err);
          return "failed_but_ignored";
        }
      }
    ),

  favouriteCat: publicProcedure
    .input(favouriteInputSchema)
    .output(favouriteCatOutputSchema)
    .mutation(async ({ input }): Promise<string | "already_favourited" | "failed_but_ignored"> => {
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
          console.error("Failed to favourite cat, status:", response.status, errorText);

          if (errorText.includes("DUPLICATE_FAVOURITE")) {
            return "already_favourited";
          }

          return "failed_but_ignored";
        }

        const data: FavouriteApiResponse = await response.json();
        return data.id;
      } catch (err) {
        console.error("Unexpected error favouriting cat:", err);
        return "failed_but_ignored";
      }
    }),

  unfavouriteCat: publicProcedure
    .input(unfavouriteInputSchema)
    .output(unfavouriteCatOutputSchema)
    .mutation(
      async ({
        input,
      }): Promise<{ success: boolean; id?: number; message?: string }> => {
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
            console.error("Failed to unfavourite cat, status:", response.status, errorText);
            return { success: false, message: "Failed to unfavourite cat" };
          }

          return { success: true, id: input.favouriteId };
        } catch (err) {
          console.error("Unexpected error unfavouriting cat:", err);
          return { success: false, message: "Unexpected error" };
        }
      }
    ),

  userFavourites: publicProcedure
    .input(userIdInputSchema)
    .output(userFavouritesOutputSchema)
    .query(async ({ input }) => {
      const response = await fetch(`${API_BASE_URL}/favourites?sub_id=${input.userId}`, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favourites");
      }

      const favourites: FavouriteApiItem[] = await response.json();
      return favourites.map((fav) => ({
        id: fav.id,
        imageId: fav.image_id,
      }));
    }),

  userVotes: publicProcedure
    .input(userIdInputSchema)
    .output(userVotesOutputSchema)
    .query(async ({ input }) => {
      const response = await fetch(`${API_BASE_URL}/votes?sub_id=${input.userId}`, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch votes");
      }

      const votes: VoteApiItem[] = await response.json();
      return votes.map((vote) => ({
        id: vote.id,
        imageId: vote.image_id,
        value: vote.value === 1 ? "up" : "down",
      }));
    }),

  getFavourites: publicProcedure
    .input(userIdInputSchema)
    .output(userFavouritesOutputSchema)
    .query(async ({ input }) => {
      const response = await fetch(`${API_BASE_URL}/favourites?sub_id=${input.userId}`, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favourites");
      }

      const favourites: FavouriteApiItem[] = await response.json();
      return favourites.map((fav) => ({
        id: fav.id,
        imageId: fav.image_id,
      }));
    }),

  get: publicProcedure
    .input(getCatsInputSchema)
    .output(getCatsOutputSchema)
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
