import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || req.headers.get("x-client-ip") || req.headers.get("x-cluster-client-ip") || req.headers.get("x-forwarded-for") || req.headers.get("x-forwarded") || req.headers.get("forwarded-for") || req.headers.get("forwarded"),
    }),
  });

export { handler as GET, handler as POST };