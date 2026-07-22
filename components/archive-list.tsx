import Link from "next/link";
import BackButton from "@/components/back";
import { decodeHtml } from "@/lib/metadata";

interface ArchiveListProps<T> {
  title: string;
  items: T[];
  getItemHref: (item: T) => string;
  getItemLabel: (item: T) => string;
  emptyMessage: string;
}

export function ArchiveList<T extends { id: number | string }>({
  title,
  items,
  getItemHref,
  getItemLabel,
  emptyMessage,
}: ArchiveListProps<T>) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
      <header className="border-b-2 border-ink pb-4">
        <p className="kicker text-brown">Index</p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
          {title}
        </h1>
      </header>

      {items.length > 0 ? (
        <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="border-b border-line">
              <Link
                href={getItemHref(item)}
                className="group flex items-center justify-between gap-3 py-3 font-display text-lg transition-colors hover:text-saffron-deep"
              >
                <span>{decodeHtml(getItemLabel(item))}</span>
                <span
                  aria-hidden
                  className="text-saffron opacity-0 transition-opacity group-hover:opacity-100"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-brown">{emptyMessage}</p>
      )}

      <div className="mt-12">
        <BackButton />
      </div>
    </div>
  );
}
