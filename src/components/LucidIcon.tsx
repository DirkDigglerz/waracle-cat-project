import * as Icons from 'lucide-react';

export default function LucidIcon(props: Icons.LucideProps & { name: string }) {
  const { name, ...rest } = props;

  const Icon = Icons[name as keyof typeof Icons] as React.ComponentType<Icons.LucideProps> | undefined;

  if (!Icon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  };

  return <Icon {...rest} />;
}
