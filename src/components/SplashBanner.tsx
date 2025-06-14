"use client";

import { Box, Container, Flex, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Element, scroller } from "react-scroll";
import Button from "./Button";
import InfoPill from "./InfoPill";
import SlideInSection from "./SlideInSection";


export default function SplashBanner() {
  const router = useRouter(); 
  return (
    <Element name="home-banner">
      <Box
        w="100vw"
        mih="100vh"
        style={{
          minHeight: "100dvh",
          position: "relative",
          overflow: "hidden",
          backgroundSize: "400% 400%",
          animation: "gradientShift 20s ease infinite",
        }}
      >
        {/* Main content */}
        <Flex
          w="100vw"
          h="100vh"
          align="center"
          justify="center"
          pos="relative"
          style={{ zIndex: 2 }}
        >
          <Container size="xl" w="100%" >
            <Flex
              w="100%"
              h="100%"
              direction={{
                base: "column",
                md: "row",
              }}
              justify="center"
              align="center"
              gap="xl"
              // mt='lg'
              px="md"
            >
              {/* Logo Section */}
              <SlideInSection from="left">
                <Flex
                  direction="column"
                  align="center"
                  gap="md"
                  style={{
                    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
                  }}
                >
                  {/* Logo container with enhanced effects */}
                  <Box pos="relative">
                    {/* Glow effect */}
                    
                    {/* Logo with glassmorphism frame */}
                    <Box
                      p="xl"
                      mt={{
                        base: "1.5vh",
                        md: "0",
                      }}
                      style={{
                        background: `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.25) 0%, 
                          rgba(255, 255, 255, 0.1) 100%)`,
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "var(--mantine-radius-sm)",
                        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25),
                                   inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => router.push("/")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 35px 60px -12px rgba(0, 0, 0, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
                      }}
                    >
                      <Image
                        src="/catLogo.png"
                        alt="Cat Logo"
                        width={100}
                        height={100}
                        style={{
                          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Brand name */}
                  <Text
                    size="xl"
                    fw={700}
                    ta="center"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      letterSpacing: "0.5px",
                    }}
                  >
                    CatRater Pro
                  </Text>
                </Flex>
              </SlideInSection>

              {/* Content Section */}
              <SlideInSection from="right">
                <Flex
                  direction="column"
                  gap="xl"
                  align="center"
                  maw="500px"
                >
                  {/* Hero text */}
                  <Flex direction="column" gap="md" align="center">
                    <Text
                      visibleFrom="md"
                      size="3rem"
                      fw={800}
                      ta="center"
                      lh={1.2}
                      style={{
                        color: "rgba(255, 255, 255, 0.95)",
                        textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        background: `linear-gradient(135deg, 
                          rgba(255, 255, 255, 1) 0%, 
                          rgba(255, 255, 255, 0.8) 100%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Rate Your Cats
                    </Text>
                    
                    <Box
                      px="lg"
                      py="xs"
                      style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "var(--mantine-radius-sm)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Text
                        size="lg"
                        ta="center"
                        fw={500}
                        style={{
                          color: "rgba(255, 255, 255, 0.85)",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        The most purr-fect rating system ever created! 🐱
                      </Text>
                    </Box>

                    <Text
                      size="md"
                      ta="center"
                      lh={1.6}
                      maw="400px"
                      style={{
                        color: "rgba(255, 255, 255, 0.75)",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Upload, vote, and discover the most adorable cats in our community-driven gallery
                    </Text>
                  </Flex>

                  {/* Action buttons */}
                  <Flex
                    gap="md"
                    direction={{ base: "column", sm: "row" }}
                    w="100%"
                    justify="center"
                  >
                    <Button
                      icon="Upload"
                      color="#ff6b6b"
                      onClick={() => router.push("/upload")}
                    >
                      Upload Cat
                    </Button>
                    <Button
                      icon="Cat"
                      onClick={() => {
                        scroller.scrollTo("view-cats", { smooth: true, duration: 500 });
                      }}
                    >
                      View Cats
                    </Button>
                  </Flex>

                  {/* Stats or features */}
                  <Flex
                    gap="sm"
                    justify="center"
                    wrap="wrap"
                    mt="md"
                  >
                    {[
                      { icon: 'Heart', label: "Favorite System", color: "#ff6b6b" },
                      { icon: 'Star', label: "Rating System", color: "#ffd93d" },
                      { icon: 'Sparkles', label: "Beautiful UI", color: "#6bcf7f" },
                    ].map((feature, index) => (
                      <InfoPill 
                        key={index}
                        icon={feature.icon}
                        iconColor={feature.color}
                        label={feature.label}
                      />
                    ))}
                  </Flex>
                </Flex>
              </SlideInSection>
            </Flex>
          </Container>
        </Flex>

        {/* Scroll indicator */}
        <Box
          pos="absolute"
          bottom="2vh"
          visibleFrom="md"
          left="50%"
          style={{
            transform: "translateX(-50%)",
            animation: "bounce 2s infinite",
          }}
        >
          <Flex
            direction="column"
            align="center"
            gap="xs"
            style={{
              cursor: "pointer",
              opacity: 0.7,
              transition: "opacity 0.3s ease",
            }}
            onClick={() => {
              scroller.scrollTo("view-cats", { smooth: true, duration: 500 });
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
          >
            <Text
              size="sm"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              Scroll to explore
            </Text>
            <Box
              w="2px"
              h="30px"
              style={{
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: "1px",
              }}
            />
          </Flex>
        </Box>

        <style jsx>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-10px); }
            60% { transform: translateX(-50%) translateY(-5px); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Box>
    </Element>
  );
}