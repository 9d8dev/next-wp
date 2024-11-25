// lib/utils/pagination.ts

export type PaginationItem = number | 'LEFT_ELLIPSIS' | 'RIGHT_ELLIPSIS';

interface PaginationRangeProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number; // Number of pages to show on each side of current page
}

export function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
}: PaginationRangeProps): PaginationItem[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  // If the total number of pages is less than the page numbers we want to show, return the range [1..totalPages]
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  const paginationRange: PaginationItem[] = [];

  paginationRange.push(firstPageIndex);

  if (shouldShowLeftEllipsis) {
    paginationRange.push('LEFT_ELLIPSIS');
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) {
      paginationRange.push(i);
    }
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    paginationRange.push(i);
  }

  if (shouldShowRightEllipsis) {
    paginationRange.push('RIGHT_ELLIPSIS');
  } else {
    for (let i = rightSiblingIndex + 1; i < lastPageIndex; i++) {
      paginationRange.push(i);
    }
  }

  paginationRange.push(lastPageIndex);

  return paginationRange;
}
