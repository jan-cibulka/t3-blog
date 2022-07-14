import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";

function CreatePostPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();
  const { mutate, error } = trpc.useMutation(["posts.create-post"], {
    onSuccess: ({ id }) => {
      console.log("success");
      router.push(`/posts/${id}`);
    },
  });

  const onSubmit = async (data: CreatePostInput) => {
    mutate(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div>{error.message}</div>}
        <h1>Create Posts</h1>
        <br />
        <input
          type='text'
          placeholder='Your post title'
          {...register("title")}
        />
        <br />
        <textarea placeholder='Your post body' {...register("body")} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default CreatePostPage;
