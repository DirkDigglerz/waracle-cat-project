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


const globalStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideInUp {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const staggerDelay = (index: number) => `${index * 0.1}s`;

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
    const map = new Map<string, number>(); // imageId -> favouriteId
    favourites.forEach(({ imageId, id }: { imageId: string; id: number }) => {
      map.set(imageId, id);
    });
    return map;
  }, [favourites]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <Flex
          id="view-cats"
          style={{
            minHeight: "100vh",
            width: "100vw",
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
                  rgba(255, 255, 255, 0.35) 0%, 
                  rgba(255, 255, 255, 0.15) 30%,
                  rgba(255, 255, 255, 0.08) 70%,
                  rgba(255, 255, 255, 0.12) 100%)`,
                backdropFilter: "blur(40px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "var(--mantine-radius-md)",
                overflow: "hidden",
                boxShadow: `
                  0 32px 64px -12px rgba(0, 0, 0, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                `,
                position: "relative",
                animation: `slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              {/* Animated gradient overlay */}
              <Box
                pos="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                style={{
                  borderRadius: "40px",
                  background: `
                    linear-gradient(45deg, 
                      transparent 0%, 
                      rgba(255, 255, 255, 0.05) 25%,
                      transparent 50%,
                      rgba(255, 255, 255, 0.03) 75%,
                      transparent 100%)
                  `,
                  backgroundSize: '200% 200%',
                  animation: `shimmer 8s ease-in-out infinite`,
                  pointerEvents: "none",
                }}
              />



              {/* Enhanced Header */}
              <Flex
                p="xl"
                pb="lg"
                align="center"
                justify="center"
                style={{
                  position: "relative",
                  zIndex: 2,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                  flexShrink: 0,
                }}
              >
                <Flex
                  align="center"
                  gap="lg"
                  px="2xl"
                  py="lg"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.25) 0%, 
                        rgba(255, 255, 255, 0.15) 50%,
                        rgba(255, 255, 255, 0.1) 100%)
                    `,
                    backdropFilter: "blur(20px)",
                    borderRadius: "var(--mantine-radius-sm)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: `
                      0 8px 32px rgba(0, 0, 0, 0.12),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `,
                    animation: `float 6s ease-in-out infinite`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >

                  
                  <Flex
                    ml="md"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",
                      borderRadius: "50%",
                      aspectRatio: "1 / 1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      
                      padding: "12px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <Icons.Cat size={28} color="rgba(255, 255, 255, 0.95)" />
                  </Flex>
                  
                  <Text
                    size="xl"
                    fw={700}
                    style={{
                      color: "rgba(255, 255, 255, 0.95)",
                      textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      letterSpacing: "0.5px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Your Cat Collection {cats && cats.length > 0 && (
                      <Text
                        component="span"
                        mr='md'
                        style={{
                          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.15))",
                          padding: "4px 12px",
                          borderRadius: "var(--mantine-radius-sm)",
                          marginLeft: "8px",
                          fontSize: "0.9em",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        {cats.length}
                      </Text>
                    )}
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
                    gap="2xl"
                    p="xl"
                  >
                    <Box pos="relative">
                      <Flex
                        w="140px"
                        h="140px"
                        align="center"
                        justify="center"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              rgba(255, 255, 255, 0.2) 0%, 
                              rgba(255, 255, 255, 0.1) 50%,
                              rgba(255, 255, 255, 0.15) 100%)
                          `,
                          borderRadius: "50%",
                          backdropFilter: "blur(20px)",
                          border: "2px solid rgba(255, 255, 255, 0.25)",
                          boxShadow: `
                            0 16px 40px rgba(0, 0, 0, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3)
                          `,
                          animation: `pulse 2s ease-in-out infinite, float 4s ease-in-out infinite`,
                        }}
                      >
                        <Icons.Cat size={56} color="rgba(255, 255, 255, 0.9)" />
                      </Flex>
                      
                      {/* Loading ring */}
                      <Box
                        pos="absolute"
                        top={-8}
                        left={-8}
                        w="156px"
                        h="156px"
                        style={{
                          borderRadius: "50%",
                          border: "3px solid transparent",
                          borderTop: "3px solid rgba(255, 255, 255, 0.6)",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    </Box>
                    
                    <Flex direction="column" align="center" gap="md">
                      <Text
                        size="2xl"
                        fw={700}
                        ta="center"
                        style={{
                          color: "rgba(255, 255, 255, 0.95)",
                          textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Loading your cats...
                      </Text>
                      <Text
                        size="lg"
                        ta="center"
                        style={{
                          color: "rgba(255, 255, 255, 0.75)",
                          textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
                          maxWidth: "300px",
                        }}
                      >
                        Fetching the most adorable content
                      </Text>
                    </Flex>
                  </Flex>
                ) : cats && cats.length > 0 ? (
                  <Box
                    p="xl"
                    pt="2xl"
                    style={{
                      overflowY: "auto",
                      overflowX: "hidden",
                      height: "100%",
                    }}
                  >
                    <SimpleGrid
                      cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                      spacing="xl"
                      style={{ width: "100%" }}
                    >
                      {cats.map((cat: CatProps, index: number) => {
                        return (
                          <Box 
                            key={cat.id}
                            style={{
                              animation: `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay(index)} both`,
                            }}
                          >
                            <CatCard
                              {...cat}
                              voteValue={voteMap.get(cat.id)}
                              favouriteId={favouriteMap.get(cat.id)}
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
                    gap="2xl"
                    p="xl"
                  >
                    <Box pos="relative">
                      <Flex
                        w="160px"
                        h="160px"
                        align="center"
                        justify="center"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              rgba(255, 255, 255, 0.25) 0%, 
                              rgba(255, 255, 255, 0.12) 50%,
                              rgba(255, 255, 255, 0.18) 100%)
                          `,
                          borderRadius: "50%",
                          backdropFilter: "blur(20px)",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          boxShadow: `
                            0 20px 60px rgba(0, 0, 0, 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                          `,
                          animation: `float 6s ease-in-out infinite`,
                        }}
                      >
                        <Icons.ImagePlus size={64} color="rgba(255, 255, 255, 0.9)" />
                      </Flex>
                    </Box>

                    <Flex direction="column" align="center" gap="lg" ta="center">
                      <Text
                        size="2xl"
                        fw={700}
                        style={{
                          color: "rgba(255, 255, 255, 0.95)",
                          textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        No cats yet!
                      </Text>
                      <Text
                        size="lg"
                        style={{
                          color: "rgba(255, 255, 255, 0.75)",
                          maxWidth: "480px",
                          lineHeight: 1.7,
                          textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        Start building your collection by uploading your first adorable cat photo
                      </Text>
                    </Flex>

                    <Button
                      size="xl"
                      leftSection={<Icons.Upload size={24} />}
                      onClick={() => router.push("/upload")}
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.3) 0%, 
                            rgba(255, 255, 255, 0.18) 50%,
                            rgba(255, 255, 255, 0.25) 100%)
                        `,
                        backdropFilter: "blur(20px)",
                        border: "2px solid rgba(255, 255, 255, 0.35)",
                        borderRadius: "var(--mantine-radius-sm)",
                        color: "rgba(255, 255, 255, 0.95)",
                        fontWeight: 700,
                        padding: "16px 32px",
                        fontSize: "18px",
                        letterSpacing: "0.5px",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        boxShadow: `
                          0 8px 32px rgba(0, 0, 0, 0.15),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                        position: "relative",
                        overflow: "hidden",
                      }}
                      styles={{
                        root: {
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                            transition: 'left 0.6s',
                          },
                          '&:hover::before': {
                            left: '100%',
                          },
                          '&:hover': {
                            transform: "translateY(-4px) scale(1.02)",
                            boxShadow: `
                              0 16px 48px rgba(0, 0, 0, 0.25),
                              inset 0 1px 0 rgba(255, 255, 255, 0.4)
                            `,
                            background: `
                              linear-gradient(135deg, 
                                rgba(255, 255, 255, 0.4) 0%, 
                                rgba(255, 255, 255, 0.25) 50%,
                                rgba(255, 255, 255, 0.35) 100%)
                            `,
                            borderColor: "rgba(255, 255, 255, 0.45)",
                          },
                          '&:active': {
                            transform: "translateY(-2px) scale(0.98)",
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
      </Flex>
    </>
  );
}