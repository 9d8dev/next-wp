import { getAllCategories } from "@/lib/wordpress";

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1>All Categories</h1>
      <ul>
        {categories.map((category: any) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}
