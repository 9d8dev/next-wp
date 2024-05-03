import { getAllTags } from "@/lib/wordpress";

export default async function Page() {
  const tags = await getAllTags();

  return (
    <div>
      <h1>All Tags</h1>
      <ul>
        {tags.map((tag: any) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  );
}
