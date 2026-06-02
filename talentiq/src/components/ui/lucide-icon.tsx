import dynamicIconImports from "lucide-react/dynamicIconImports";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

interface Props {
  name: IconName;
  size?: number;
  className?: string;
}

const LucideIcon = ({
  name,
  size = 20,
  className,
}: Props) => {
  return (
    <DynamicIcon
      name={name}
      size={size}
      className={className}
    />
  );
};

export default LucideIcon;