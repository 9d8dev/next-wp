import { getAllPosts } from "@/lib/wordpress";

export default async function TestConnection() {
  try {
    console.log('Attempting to connect to WordPress...');
    const posts = await getAllPosts();
    console.log('Successfully fetched posts:', posts.length);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">WordPress Connection Test</h1>
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-green-800">✅ Connection Successful!</h2>
          <p className="mt-2">Found {posts.length} posts</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('WordPress connection error:', error);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">WordPress Connection Test</h1>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-red-800">❌ Connection Failed</h2>
          <p className="mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <div className="mt-4">
            <h3 className="font-bold">Debug Information:</h3>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify({
                WORDPRESS_URL: process.env.WORDPRESS_URL,
                WORDPRESS_HOSTNAME: process.env.WORDPRESS_HOSTNAME,
                error: error instanceof Error ? {
                  name: error.name,
                  message: error.message,
                  stack: error.stack
                } : error
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
} 