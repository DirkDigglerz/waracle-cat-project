"use client";

import { trpc } from "@/app/client/trpc";
import { useUserUUID } from "@/store/useUserID";
import { CatProps } from "@/types";
import {
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
  Text,
} from "@mantine/core";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import CatCard from "./CatCard";



export default function CatGrid() {
  const router = useRouter();
  const uuid = useUserUUID();

  // Fetch cats
  const { data: cats, isLoading: catsLoading } = trpc.cats.get.useQuery(
    { userId: uuid || "" },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 0.5,
    }
  );

  // Fetch user votes
  const { data: votes = [], isLoading: votesLoading } = trpc.cats.userVotes.useQuery(
    { userId: uuid || "" },
    {
      enabled: Boolean(uuid),
      staleTime: 1000 * 60 * 5,
    }
  );

  // Fetch user favourites
  const { data: favourites = [], isLoading: favsLoading } = trpc.cats.userFavourites.useQuery(
    { userId: uuid || "" },
    {
      enabled: Boolean(uuid),
      staleTime: 1000 * 60 * 5,
    }
  );

  const loading = catsLoading || votesLoading || favsLoading;

  // Memoize vote and favourite maps for fast lookup
  const voteMap = useMemo(() => {
    const map = new Map<string, "up" | "down" | undefined>();
    votes.forEach(({ imageId, value }: { imageId: string; value: number }) => {
      map.set(imageId, value === 1 ? "up" : value === 0 ? "down" : undefined);
    });
    return map;
  }, [votes]);

  const favouriteMap = useMemo(() => {
    const map = new Map<string, string>(); // imageId -> favouriteId
    favourites.forEach(({ imageId, id }: { imageId: string; id: string }) => {
      map.set(imageId, id);
    });
    return map;
  }, [favourites]);

  return (
    <Box
      id="view-cats"
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <Flex
        h="100vh"
        w="100vw"
        align="center"
        justify="center"
        direction="column"
      >
        <Container
          size="xl"
          w={{ base: "100%", md: "90%" }}
          h="95%"
          style={{
            maxWidth: "100vw",
            position: "relative",
          }}
        >
          <Flex
            h="100%"
            w="100%"
            direction="column"
            style={{
              background: `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.25) 0%, 
                rgba(255, 255, 255, 0.1) 50%, 
                rgba(255, 255, 255, 0.05) 100%)`,
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25),
                         0 0 0 1px rgba(255, 255, 255, 0.1),
                         inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
              position: "relative",
            }}
          >
            {/* Inner glow effect */}
            <Box
              pos="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                borderRadius: "32px",
                background: `linear-gradient(45deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.03) 50%, 
                  transparent 100%)`,
                pointerEvents: "none",
              }}
            />

            {/* Fixed Header */}
            <Flex
              p="md"
              pb="lg"
              align="center"
              justify="center"
              style={{
                position: "relative",
                zIndex: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                flexShrink: 0,
              }}
            >
              <Flex
                align="center"
                gap="md"
                px="xl"
                py="md"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Icons.Cat size={24} color="rgba(255, 255, 255, 0.9)" />
                <Text
                  size="xl"
                  fw={700}
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Your Cat Collection {cats && cats.length > 0 && `(${cats.length})`}
                </Text>
              </Flex>
            </Flex>

            {/* Scrollable Content Area */}
            <Flex
              flex={1}
              direction="column"
              style={{
                position: "relative",
                zIndex: 1,
                overflow: "hidden",
              }}
            >
              {loading ? (
                <Flex
                  flex={1}
                  justify="center"
                  align="center"
                  direction="column"
                  gap="xl"
                  p="md"
                >
                  <Box pos="relative">
                    <Flex
                      w="100px"
                      h="100px"
                      align="center"
                      justify="center"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Icons.Cat size={40} color="rgba(255, 255, 255, 0.8)" />
                    </Flex>
                  </Box>
                  <Flex direction="column" align="center" gap="sm">
                    <Text
                      size="xl"
                      fw={600}
                      ta="center"
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      Loading your cats...
                    </Text>
                    <Text
                      size="md"
                      ta="center"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Fetching the most adorable content
                    </Text>
                  </Flex>
                </Flex>
              ) : cats && cats.length > 0 ? (
                <Box
                  p="md"
                  pt="lg"
                  style={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    height: "100%",
                  }}
                >
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 4}}
                    spacing="lg"
                    style={{ width: "100%" }}
                  >
                    {cats.map((cat: CatProps) => {
                      return (
                        <Box key={cat.id}>
                          <CatCard
                            {...cat}
                            voteValue={voteMap.get(cat.id)} // "up" | "down" | undefined
                            favouriteId={favouriteMap.get(cat.id)} // id of the favourite if exists
                            userId={uuid || ""}
                          />
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              ) : (
                <Flex
                  flex={1}
                  justify="center"
                  align="center"
                  direction="column"
                  gap="xl"
                  p="md"
                >
                  <Box pos="relative">
                    <Flex
                      w="120px"
                      h="120px"
                      align="center"
                      justify="center"
                      style={{
                        background: `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.2) 0%, 
                          rgba(255, 255, 255, 0.1) 100%)`,
                        borderRadius: "50%",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <Icons.ImagePlus size={48} color="rgba(255, 255, 255, 0.8)" />
                    </Flex>
                  </Box>

                  <Flex direction="column" align="center" gap="md" ta="center">
                    <Text
                      size="xl"
                      fw={700}
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      No cats yet!
                    </Text>
                    <Text
                      size="md"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        maxWidth: "400px",
                        lineHeight: 1.6,
                      }}
                    >
                      Start building your collection by uploading your first adorable cat photo
                    </Text>
                  </Flex>

                  <Button
                    size="lg"
                    leftSection={<Icons.Upload size={20} />}
                    onClick={() => router.push("/upload")}
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.25) 0%, 
                        rgba(255, 255, 255, 0.15) 100%)`,
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "16px",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: 600,
                      padding: "12px 24px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                          background: `linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.35) 0%, 
                            rgba(255, 255, 255, 0.25) 100%)`,
                        },
                      },
                    }}
                  >
                    Upload Your First Cat
                  </Button>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
}
