import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "", // ✅ FIXED
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    if (!userData) return;

    // ================= UPDATE =================
    if (post) {
      let featuredImage = post.featuredImage;

      if (data.image?.[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
          featuredImage = file.$id;
        }
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage,
      });

      if (dbPost) navigate(`/post/${dbPost.slug}`);
      return;
    }

    // ================= CREATE =================
    const file = await appwriteService.uploadFile(data.image[0]);
    if (!file) return;

    const dbPost = await appwriteService.createPost({
      ...data,
      featuredImage: file.$id,
      userId: userData.$id,
    });

    if (dbPost) navigate(`/post/${dbPost.slug}`);
  };

  // ✅ Auto-generate slug ONLY in create mode
  const slugTransform = useCallback((value) => {
    return value
      ?.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]+/g, "-")
      .replace(/\s/g, "-");
  }, []);

  useEffect(() => {
    if (post) return;

    const sub = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title));
      }
    });

    return () => sub.unsubscribe();
  }, [watch, slugTransform, setValue, post]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input label="Title" {...register("title", { required: true })} />
        <Input label="Slug" {...register("slug", { required: true })} />
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input type="file" {...register("image", { required: !post })} />

        {post && (
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            className="rounded-lg my-3"
          />
        )}

        <Select
          options={["active", "inactive"]}
          {...register("status")}
        />

        <Button className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
