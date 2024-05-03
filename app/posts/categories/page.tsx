import { getAllCategories } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";
import BackButton from "@/components/back";

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>All Categories</h2>
          <div className="grid">
            {categories.map((category: any) => (
              <Link key={category.id} href={`categories/${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
