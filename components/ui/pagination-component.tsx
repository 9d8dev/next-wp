// components/ui/pagination/PaginationComponent.tsx

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem as UI_PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getPaginationRange, PaginationItem as RangePaginationItem } from "@/lib/pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  category?: string;
  author?: string;
  tag?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  category,
  author,
  tag,
}) => {
  const paginationRange: RangePaginationItem[] = getPaginationRange({
    currentPage,
    totalPages,
    siblingCount: 1, // Adjust as needed
  });

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <UI_PaginationItem>
          <PaginationPrevious
            className={currentPage === 1 ? "pointer-events-none text-muted" : ""}
            href={`/posts?page=${Math.max(currentPage - 1, 1)}${
              category ? `&category=${category}` : ""
            }${author ? `&author=${author}` : ""}${
              tag ? `&tag=${tag}` : ""
            }`}
          />
        </UI_PaginationItem>

        {/* Page Numbers and Ellipses */}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === 'LEFT_ELLIPSIS' || pageNumber === 'RIGHT_ELLIPSIS') {
            return (
              <UI_PaginationItem key={index}>
                <PaginationEllipsis />
              </UI_PaginationItem>
            );
          }

          return (
            <UI_PaginationItem key={pageNumber}>
              <PaginationLink
                href={`/posts?page=${pageNumber}${
                  category ? `&category=${category}` : ""
                }${author ? `&author=${author}` : ""}${
                  tag ? `&tag=${tag}` : ""
                }`}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </UI_PaginationItem>
          );
        })}

        {/* Next Button */}
        <UI_PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages ? "pointer-events-none text-muted" : ""
            }
            href={`/posts?page=${Math.min(currentPage + 1, totalPages)}${
              category ? `&category=${category}` : ""
            }${author ? `&author=${author}` : ""}${
              tag ? `&tag=${tag}` : ""
            }`}
          />
        </UI_PaginationItem> 
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
