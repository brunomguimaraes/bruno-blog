"use client";

type Props = {
  as?: "h1" | "h2" | "h3" | "span";
  children: string;
  className?: string;
  onClick?: () => void;
};

export default function GlitchText({ as = "h1", children, className, onClick }: Props) {
  const Tag = as;
  return (
    <Tag
      className={"glitch " + (className ?? "")}
      data-text={children}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
