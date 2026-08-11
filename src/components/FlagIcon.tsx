import * as Flags from "country-flag-icons/react/3x2";
import type { ReactElement } from "react";

interface FlagIconProps {
  alpha2: string | null | undefined;
  className?: string;
}

type FlagComponentMap = Record<string, (props: { className?: string; title?: string }) => ReactElement>;

const flagComponents = Flags as unknown as FlagComponentMap;

export default function FlagIcon({ alpha2, className }: FlagIconProps) {
  const code = alpha2?.toUpperCase();
  const Flag = code ? flagComponents[code] : undefined;

  if (!Flag) {
    return <span className={className ? `${className} flag-fallback` : "flag-fallback"}>🏳️</span>;
  }

  return <Flag className={className} title={code} />;
}
