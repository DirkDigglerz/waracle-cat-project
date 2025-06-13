import { Flex } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import * as Icons from 'lucide-react';
import { useEffect, useState } from 'react';

export type CatControlProps = {
  disabled?: boolean;
  name: keyof typeof Icons;
  fill?: string;
  hoverColor?: string;
  color?: string;
  onClick?: () => void;
};

export function CatControl(props: CatControlProps) {
  const {hovered, ref} = useHover();
  const IconComponent = Icons[props.name] as React.ComponentType<{
    size?: string | number;
    color?: string;
    fill?: string;
    
  }>;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    // if fill changes then temporarily set the scale to 1.1 and then back to 1
    if (props.fill) {
      setScale(1.1);
      const timer = setTimeout(() => setScale(1), 100);
      return () => clearTimeout(timer);
    }
  }, [props.fill]);

  if (!IconComponent) return null;

  return (
    <Flex
      ref={ref}
      justify="center"
      align="center"
      style={{
        cursor: props.disabled ? 'not-allowed' : props.onClick ? 'pointer' : 'default',
        pointerEvents: props.disabled ? 'none' : 'auto',
        transform: `scale(${scale})`,
        transition: 'all 0.1s ease',
      }}
      onClick={props.disabled ? undefined : props.onClick}
    >

      <IconComponent
        size={'2.5rem'}
        color={hovered && props.hoverColor ? props.hoverColor : props.color || 'rgba(255, 255, 255, 0.8)'}
        fill={props.fill || 'none'}
        
      />

    </Flex>
  );
}
