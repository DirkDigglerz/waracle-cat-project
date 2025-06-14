import { alpha, getGradient, lighten, Button as MantineButton, ButtonProps as MantineButtonProps, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useMemo } from "react";
import LucidIcon from "./LucidIcon";



type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  color?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: string | number;
} & Omit<MantineButtonProps, 'onClick' | 'children' | 'color'>;



export default function Button(props: ButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {onClick, disabled, children, color, icon, iconColor, iconSize, ...rest} = props;

  const {hovered, ref } = useHover();
  const theme = useMantineTheme();
  const mainColor = props.color || "rgba(77,77,77,0.8)"; // Default color if not provided
  const lightColor  = lighten(mainColor, 0.1); // Lightened color for hover effect
  const bgGradient = getGradient({
    deg: 135,
    from: mainColor,
    to: lightColor,
  }, theme)

  const realHover = useMemo(() => {
    return !props.disabled && hovered;
  }, [hovered, props.disabled]);

  return (
    <MantineButton
      ref={ref}
      size="xl"
      fz="xs"
      radius="sm"
      leftSection={
        props.icon ? (
          <LucidIcon
            name={props.icon}
            color={props.iconColor}
            size={props.iconSize}
          />
        ) : null
      }
      bg={!props.disabled ? bgGradient : "rgba(255, 255, 255, 0.1)"}
      onClick={() => {
        if (props.disabled) return;
        if (props.onClick) props.onClick();
      }}
      style={{
        cursor: props.disabled ? "not-allowed" : "pointer",
        padding: "1vh 5vh",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: !props.disabled ? realHover ? `0 0.5vh 2vh ${alpha(mainColor, 0.4)}` : `0 0.25vh 1vh ${alpha(lightColor, 0.4)}` : "none",
        transform: realHover ? "translateY(-3px) scale(1.05)" : "translateY(0) scale(1)",
        backdropFilter: "blur(0.1vh)",
      }}
      {...rest}    
    >
      {props.children}
    </MantineButton>


  )
}