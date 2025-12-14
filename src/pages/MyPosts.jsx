import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function MyPosts() {
  const user = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    appwriteService
      .getUserPosts(user.$id)
      .then((res) => setPosts(res?.documents || []))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading your posts...</div>;
  }

  return (
    <div className="w-full py-8">
      <Container>
        <h1 className="text-2xl font-bold mb-6 text-center">My Posts</h1>

        <div className="flex flex-wrap">
          {posts.length === 0 ? (
            <h2 className="mx-auto text-lg">
              You haven’t posted anything yet.
            </h2>
          ) : (
            posts.map((post) => (
              <div key={post.$id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
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
