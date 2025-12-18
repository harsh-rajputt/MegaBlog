import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function Home() {
  const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

 useEffect(() => {
    appwriteService
      .getAllPosts()
      .then((res) => setPosts(res?.documents || []))
      .finally(() => setLoading(false));
  }, []);

   if (loading) {
    return <div className="text-center py-10">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <Container>
        <h1 className="text-center text-2xl mt-10">
          No posts available
        </h1>
      </Container>
    );
  }

  return (
     <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.length === 0 ? (
            <h1 className="text-xl font-semibold mx-auto">
              No posts available
            </h1>
          ) : (
            posts.map((post) => (
              <div key={post.$id} >
                <PostCard {...post} />
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}

export default Home;
