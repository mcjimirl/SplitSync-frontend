import { useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { icons8Url } from "../../utils/icons8";

type Props = {
  candidates: string[];
  alt: string;
  className?: string;
  imgClassName?: string;
};

/**
 * Renders Icons8 PNG with slug fallbacks; final fallback is a neutral icon tile.
 */
export default function Icons8Image({ candidates, alt, className = "", imgClassName = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    setIndex(0);
    setShowPlaceholder(false);
  }, [candidates.join("|")]);

  if (showPlaceholder || candidates.length === 0) {
    return (
      <div
        className={`grid place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 ${className}`}
      >
        <FiImage className="text-2xl" aria-hidden />
      </div>
    );
  }

  const slug = candidates[Math.min(index, candidates.length - 1)];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        key={slug}
        src={icons8Url(slug)}
        alt={alt}
        className={`h-full w-full object-contain p-1 ${imgClassName}`}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (index < candidates.length - 1) {
            setIndex((n) => n + 1);
          } else {
            setShowPlaceholder(true);
          }
        }}
      />
    </div>
  );
}
