"use client";

import { CatCardProps, VoteProps } from "@/types";
import { useCatActions, useUserVotes } from "@/utils/api";
import { Box, Flex, Image, Text } from "@mantine/core";
import { useState } from "react";
import { CatControl } from "./CatControl";

const globalStyles = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes scoreChange {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.2); }
}

@keyframes imageLoad {
  0% { opacity: 0; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes controlsSlide {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
`;

export default function CatCard(props: CatCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scoreAnimation] = useState(false);
  const [favouriteAnimation] = useState(false);
  // Get current vote from cache
  const userVotesQuery = useUserVotes(props.userId);

  const currentVote = userVotesQuery.data?.find((vote: VoteProps) => vote.imageId === props.id)?.value || null; 
  interface UserVotesQuery {
    data?: VoteProps[];
  }

  const score: number = (userVotesQuery as UserVotesQuery).data?.reduce((acc: number, vote: VoteProps) => {
    if (vote.imageId === props.id) {
      return acc + (String(vote.value) === "up" ? 1 : String(vote.value) === "down" ? -1 : 0);
    }
    return acc;
  }, 0) || 0;
  // Calculate score based on current vote
  // const score = currentVote === "up" ? 1 : currentVote === "down" ? -1 : 0;
  const { toggleFavourite, handleVote } = useCatActions(props.userId, props.id);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
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
          direction={"column"}
          justify="center"
          align="center"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.3) 0%, 
                rgba(255, 255, 255, 0.15) 30%,
                rgba(255, 255, 255, 0.08) 70%,
                rgba(255, 255, 255, 0.2) 100%)
            `,
            backdropFilter: "blur(25px) saturate(150%)",
            border: `2px solid rgba(255, 255, 255, ${isHovered ? 0.4 : 0.25})`,
            borderRadius: "var(--mantine-radius-md)",
            overflow: "hidden",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: isHovered 
              ? "translateY(-12px) scale(1.03) rotateX(5deg)" 
              : "translateY(0) scale(1) rotateX(0deg)",
            boxShadow: isHovered
              ? `
                  0 32px 64px -12px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `
              : `
                  0 12px 28px -5px rgba(0, 0, 0, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
            opacity: loaded ? 1 : 0,
            animation: loaded ? 'imageLoad 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          {/* Shimmer effect overlay */}
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{
              background: `
                linear-gradient(45deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.1) 50%, 
                  transparent 100%)
              `,
              backgroundSize: '200% 200%',
              animation: isHovered ? 'shimmer 2s ease-in-out infinite' : 'none',
              pointerEvents: "none",
              borderRadius: 26,
            }}
          />

          {/* Image container */}
          <Box 
            w="100%" 
            h="100%" 
            pos='absolute'
            top={0}
            left={0}
            style={{ 
              borderRadius: "var(--mantine-radius-sm)",
              overflow: "hidden",
            }}
          >
            <Image

              src={props.url}
              alt={`Cat ${props.id}`}
              onLoad={() => setLoaded(true)}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "scale(1.15)" : "scale(1)",
              }}
            />
            
            {/* Advanced gradient overlay */}
            <Box
              pos="absolute"
              inset={0}
              style={{
                background: `
                  linear-gradient(180deg, 
                    transparent 0%, 
                    rgba(0,0,0,0.1) 40%,
                    rgba(0,0,0,0.4) 70%,
                    rgba(0,0,0,0.8) 100%)
                `,
                opacity: isHovered ? 1 : 0.7,
                transition: "opacity 0.4s ease",
              }}
            />

            {/* Glow effect when favourite */}
            {props.favouriteId && (
              <Box
                pos="absolute"
                inset={-2}
                style={{
                  background: "linear-gradient(45deg, #ff6b6b, #ff8e8e, #ff6b6b)",
                  borderRadius: "var(--mantine-radius-sm)",
                  opacity: 0.3,
                  animation: favouriteAnimation ? 'glowPulse 0.6s ease-in-out' : 'none',
                  zIndex: -1,
                }}
              />
            )}
          </Box>

          {/* Enhanced Controls */}
          <Flex
            w='100%'
            mt='auto'
            p="md"
            pb={{
              base: "xl",
              md: "lg",
            }}
            align="center"
            justify="space-between"
            gap="md"
            style={{ 
              transform: isHovered ? "translateY(0)" : "translateY(12px)",
              opacity: isHovered ? 1 : 0.85,
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              animation: isHovered ? 'controlsSlide 0.4s ease-out' : 'none',
              background: `
                linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(0,0,0,0.2) 30%,
                  rgba(0,0,0,0.6) 100%)
              `,
              borderRadius: "0 0 24px 24px",
            }}
          >
            {/* Favourite Control with enhanced styling */}
            <Box
              style={{
                background: props.favouriteId 
                  ? "linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 107, 107, 0.1))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))",
                borderRadius: 'var(--mantine-radius-sm)',
                padding: "var(--mantine-spacing-xs)",
                border: `1px solid ${props.favouriteId ? 'rgba(255, 107, 107, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
                backdropFilter: "blur(10px)",
                animation: favouriteAnimation ? 'heartBeat 0.6s ease-in-out' : 'none',
                transition: "all 0.3s ease",
              }}
            >
              <CatControl
                name="Heart"
                color="rgba(255, 255, 255, 0.95)"
                fill={props.favouriteId ? "#ff6b6b" : "none"}
                onClick={() => {
                  toggleFavourite(props.favouriteId);
                }}
                // disabled={isPending.favourite}
              />
            </Box>

            {/* Enhanced Score Display */}
            <Box
              style={{
                background: `
                  linear-gradient(135deg, 
                    ${currentVote === "up" 
                      ? "rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.1)" 
                      : currentVote === "down" 
                        ? "rgba(244, 67, 54, 0.3), rgba(244, 67, 54, 0.1)"
                        : "rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1)"
                    }
                  )
                `,
                borderRadius: 'var(--mantine-radius-sm)',
                padding: "10px 16px",
                border: `2px solid ${
                  currentVote === "up" 
                    ? "rgba(76, 175, 80, 0.4)" 
                    : currentVote === "down" 
                      ? "rgba(244, 67, 54, 0.4)"
                      : "rgba(255, 255, 255, 0.3)"
                }`,
                backdropFilter: "blur(15px)",
                animation: scoreAnimation ? 'scoreChange 0.3s ease-in-out' : 'none',
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text 
                fw={700} 
                size="lg"
                style={{
                  color: currentVote === "up" 
                    ? "#4caf50" 
                    : currentVote === "down" 
                      ? "#f44336" 
                      : "rgba(255, 255, 255, 0.95)",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  fontSize: "18px",
                  letterSpacing: "0.5px",
                }}
              >
                {score > 0 ? `+${score}` : `${score}`}
              </Text>
            </Box>

            {/* Vote Controls */}
            <Flex gap="sm">
              <Box
                style={{
                  background: currentVote === "up"
                    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.1))"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))",
                  borderRadius: 'var(--mantine-radius-sm)',
                  padding: "var(--mantine-spacing-xs)",
                  border: `1px solid ${currentVote === "up" ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
              >
                <CatControl
                  name="ThumbsUp"
                  color="rgba(255, 255, 255, 0.95)"
                  fill={currentVote === "up" ? "#4caf50" : "none"}
                  onClick={() => handleVote("up", currentVote)}
                  // disabled={votePending}
                />
              </Box>
              
              <Box
                style={{
                  background: currentVote === "down"
                    ? "linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(244, 67, 54, 0.1))"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))",

                  borderRadius: 'var(--mantine-radius-sm)',
                  padding: "var(--mantine-spacing-xs)",
                  border: `1px solid ${currentVote === "down" ? 'rgba(244, 67, 54, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
              >
                <CatControl
                  name="ThumbsDown"
                  color="rgba(255, 255, 255, 0.95)"
                  fill={currentVote === "down" ? "#f44336" : "none"}
                  onClick={() => handleVote("down", currentVote)}
                  // disabled={votePending}
                />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}