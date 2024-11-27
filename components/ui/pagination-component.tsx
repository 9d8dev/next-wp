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
      siblingCount: 1, // Edit per requirement
    });
    
    return (
      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          <UI_PaginationItem>
            <PaginationPrevious
              inactive={currentPage === 1}
              href={`/posts?page=${Math.max(currentPage - 1, 1)}${
                category ? `&category=${category}` : ""
              }${author ? `&author=${author}` : ""}${
                tag ? `&tag=${tag}` : ""
              }`}
            />
          </UI_PaginationItem>
  
          {/* Page numbers */}
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === 'LEFT_ELLIPSIS' || pageNumber === 'RIGHT_ELLIPSIS') {
              return (
                <UI_PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </UI_PaginationItem>
              );
            }
  
            return (
              <UI_PaginationItem key={`page-${pageNumber}`}>
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
  
          {/* Next button */}
          <UI_PaginationItem>
            <PaginationNext
              inactive={currentPage === totalPages}
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