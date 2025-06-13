import { ColorSchemeScript, Flex, mantineHtmlProps, MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import type { Metadata } from "next";
import "./globals.css";
import theme from "./theme";
import { Notifications } from "@mantine/notifications";
import Provider from "./_trpc/Provider";
import CloudScroller from "@/components/CloudScroll";

export const metadata: Metadata = {
  title: "Cat API App",
  keywords: ["Cat", "API", "Next.js", "Mantine", "React"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Name",
  openGraph: {
    title: "Cat API App",
    description: "A simple app to interact with The Cat API using Next.js and Mantine.",
    url: "https://yourwebsite.com",
    siteName: "Cat API App",
    images: [       
      {
        url: "https://yourwebsite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cat API App OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cat API App",

    description: "A simple app to interact with The Cat API using Next.js and Mantine.",
    images: ["https://yourwebsite.com/twitter-image.png"],
    creator: "@yourtwitterhandle",
  },
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
  description: "A simple app to interact with The Cat API using Next.js and Mantine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Provider>
          <MantineProvider theme={theme}>
            <Notifications/>


              <CloudScroller>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  w="100dvw"
                  mih="100dvh"
                  style={{
                    zIndex: -1,
                    scrollbarWidth: "none",
                  }}
                >
                  {children}
                </Flex>
              </CloudScroller>

          </MantineProvider>
        </Provider>
      </body>
    </html>
  );
}
