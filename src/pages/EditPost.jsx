import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return navigate("/");
    appwriteService.getPost(slug).then(setPost).finally(() => setLoading(false));
  }, [slug, navigate]);

   if (loading) {
    return <div className="text-center py-10">Loading posts...</div>;
  }

  return post ? (
    <Container className="py-8">
      <PostForm post={post} />
    </Container>
  ) : null;
}

export default EditPost;
