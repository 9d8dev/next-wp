import Link from "next/link";
import { Section, Container, Prose } from "@/components/craft";
import BackButton from "@/components/back";

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
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>{title}</h2>
          {items.length > 0 ? (
            <ul className="grid">
              {items.map((item) => (
                <li key={item.id}>
                  <Link href={getItemHref(item)}>{getItemLabel(item)}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">{emptyMessage}</p>
          )}
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
