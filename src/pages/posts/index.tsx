import { trpc } from "../../utils/trpc";
import Error from "next/error";
function PostListingPage() {
  const { data, isLoading } = trpc.useQuery(["posts.posts"]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <Error statusCode={404}></Error>;
  }
  return (
    <div>
      {data.map((post) => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default PostListingPage;
