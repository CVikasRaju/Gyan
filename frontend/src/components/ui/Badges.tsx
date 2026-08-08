import React, { createElement } from "react";
import { categoryChipClass, categoryIcon, qaBadgeClass, qaLabel } from "@/lib/categories";

export function CategoryChip({
  category,
  withIcon = true,
  className = "",
}: {
  category?: string | null;
  withIcon?: boolean;
  className?: string;
}) {
  return (
    <span className={`chip ${categoryChipClass(category)} ${className}`}>
      {withIcon &&
        createElement(categoryIcon(category), {
          size: 11,
          strokeWidth: 2,
          "aria-hidden": true,
        })}
      {category || "General"}
    </span>
  );
}

export function QaBadge({ status }: { status?: string | null }) {
  return (
    <span className={`qa-badge ${qaBadgeClass(status)}`} role="status">
      {qaLabel(status)}
    </span>
  );
}
