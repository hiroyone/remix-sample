import { useTransition, useActionData, Form, redirect } from "remix";
import type { ActionFunction } from "remix";
import { createPost } from "~/post";
import invariant from "tiny-invariant";

export let action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 2000));
  let formData = await request.formData();

  let title = formData.get("title");
  let slug = formData.get("slug");
  let markdown = formData.get("markdown");

  let errors = {} as { title: boolean; slug: boolean; markdown: boolean };
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function NewPost() {
  let errors = useActionData();
  let transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug && <em>Slug is required</em>}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
