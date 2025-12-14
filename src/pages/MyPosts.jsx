import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";

// 👉 change this import according to your auth setup
import { useSelector } from "react-redux";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    appwriteService
      .getPosts([
        Query.equal("userId", user.$id),
        Query.equal("status", "active"),
      ])
      .then((res) => setPosts(res?.documents || []))
      .catch(() => setPosts([]));
  }, [user]);

  return (
    <div className="w-full py-8">
      <Container>
        <h1 className="text-2xl font-bold mb-6">My Posts</h1>

        <div className="flex flex-wrap">
          {posts.length === 0 ? (
            <p className="text-center w-full">You haven't posted anything yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}

export default MyPosts;
