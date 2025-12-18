import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!userData?.$id) return;

    appwriteService.getUserPosts(userData.$id).then((res) => {
      if (res) setPosts(res.documents);
    }).finally(() => setLoading(false));
  }, [userData]);

  if (loading) {
    return <div className="text-center py-10">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <Container>
        <h1 className="text-center text-2xl mt-10">
          No posts created yet
        </h1>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-wrap">
        {posts.map((post) => (
          <div key={post.$id} className="w-1/4 p-2">
            <PostCard {...post} />
          </div>
        ))}
      </div>
    </Container>
  );
}

export default MyPosts;
