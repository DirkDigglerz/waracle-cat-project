import { UseCatStore } from "@/types";
import { create } from "zustand";

export const useCats = create<UseCatStore>()(() => ({
  loaded: false,
  cats: [],
  favourites: [],
  votes: [],
}));