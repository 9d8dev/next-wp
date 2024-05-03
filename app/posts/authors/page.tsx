import { getAllAuthors } from "@/lib/wordpress";

export default async function Page() {
  const authors = await getAllAuthors();

  return (
    <div>
      <h1>All Authors</h1>
      <ul>
        {authors.map((author: any) => (
          <li key={author.id}>{author.name}</li>
        ))}
      </ul>
    </div>
  );
}
