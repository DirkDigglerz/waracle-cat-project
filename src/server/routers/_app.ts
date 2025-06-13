import { router } from "../trpc";
import { cats } from "./cats";
export const appRouter = router({
  cats: cats,
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;


