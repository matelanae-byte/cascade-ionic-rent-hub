interface Props {
  text: string;
  /** Tailwind text-size classes, e.g. "text-lg sm:text-xl md:text-2xl" */
  sizeClass?: string;
  /** Additional classes (color, etc.) */
  className?: string;
}

/**
 * Adaptive text wordmark.
 * Splits the brand name on the first space:
 *   first word → bold, tight tracking
 *   rest       → light italic, wider tracking
 * If no space, renders the whole text bold.
 * Stays on a single line, scales fluidly.
 */
const BrandWordmark = ({ text, sizeClass = "text-xl sm:text-2xl md:text-3xl", className = "" }: Props) => {
  const trimmed = text.trim();
  const spaceIdx = trimmed.indexOf(" ");
  const first = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
  const rest = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1);

  return (
    <span
      className={`inline-flex items-baseline whitespace-nowrap leading-none select-none font-extrabold tracking-tight ${sizeClass} ${className}`}
    >
      <span>{first}</span>
      {rest && <span className="ml-1 sm:ml-1.5">{rest}</span>}
    </span>
  );
};

export default BrandWordmark;
