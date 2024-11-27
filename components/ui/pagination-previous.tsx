// components/ui/pagination/PaginationPrevious.tsx

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PaginationPreviousProps {
  inactive?: boolean;
  href: string;
  className?: string;
}

const PaginationPrevious: React.FC<PaginationPreviousProps> = ({
  inactive = false,
  href,
  className,
}) => {
  if (inactive) {
    return (
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "default" }),
          "gap-1 pl-2.5 cursor-not-allowed opacity-50",
          className
        )}
        aria-disabled="true"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "gap-1 pl-2.5",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </Link>
  );
};

PaginationPrevious.displayName = "PaginationPrevious";

export default PaginationPrevious;
