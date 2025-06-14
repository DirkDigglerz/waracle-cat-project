import { Flex, Text } from "@mantine/core";
import LucidIcon from "./LucidIcon";

type InfoPillProps = {
  icon: string;
  iconColor?: string;
  label: string;
}


export default function InfoPill(props: InfoPillProps) {

  return (
    <Flex
      align="center"
      gap="xs"
      px="md"
      py="xs"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(2vh)",
        boxShadow: 'inset 0 0 2.5vh rgba(255, 255, 255, 0.2)',
        borderRadius: "var(--mantine-radius-sm)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <LucidIcon
        name={props.icon}
        color={props.iconColor || "rgba(255, 255, 255, 0.8)"}
        size="1.7vh"
      />
      <Text
        size="sm"
        fw={500}
        style={{
          color: "rgba(255, 255, 255, 0.8)",
        }}
      >
        {props.label}
      </Text>
    </Flex>
  )
}
