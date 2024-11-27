// components/ui/pagination/PaginationNext.tsx

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PaginationNextProps {
  inactive?: boolean;
  href: string;
  className?: string;
}

const PaginationNext: React.FC<PaginationNextProps> = ({
  inactive = false,
  href,
  className,
}) => {
  if (inactive) {
    return (
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "default" }),
          "gap-1 pr-2.5 cursor-not-allowed opacity-50",
          className
        )}
        aria-disabled="true"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "gap-1 pr-2.5",
        className
      )}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
};

PaginationNext.displayName = "PaginationNext";

export default PaginationNext;
