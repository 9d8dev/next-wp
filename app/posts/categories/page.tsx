import { getAllCategories } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <Main>
      <Section>
        <Container>
          <h2>All Categories</h2>
          <div className="grid">
            {categories.map((category: any) => (
              <Link key={category.id} href={`categories/${category.id}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
