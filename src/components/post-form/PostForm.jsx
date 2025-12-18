import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    if (!userData?.$id) return alert("Login required");

    if (post) {
      const file = data.image?.[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

      const updated = await appwriteService.updatePost(post.$id, {
        title: data.title,
        content: data.content,
        status: data.status,
        featuredImage: file ? file.$id : post.featuredImage,
      });

      if (updated) navigate(`/post/${post.$id}`);
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);

      const created = await appwriteService.createPost({
        ...data,
        featuredImage: file.$id,
        userId: userData.$id,
      });

      if (created) navigate(`/post/${created.$id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 p-2">
        <Input className="mb-2" label="Title" {...register("title", { required: true })} />
        <RTE name="content" control={control} defaultValue={post?.content || ""} />
      </div>

      <div className="w-1/3 p-2">
        <Input className = "mb-2" type="file" {...register("image", {required: !post})} />
        {post && (
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            className="rounded-lg my-3"
          />
        )}
        <Select className = "mb-2" options={["active", "inactive"]} {...register("status")} />

        <Button className="w-full" type="submit">{post ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}
