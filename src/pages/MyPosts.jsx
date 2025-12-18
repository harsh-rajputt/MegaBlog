import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!userData?.$id) return;

    appwriteService.getUserPosts(userData.$id).then((res) => {
      if (res?.documents) {
        setPosts(res.documents);
      }
    });
  }, [userData]);

  if (!posts.length) {
    return (
      <Container className="py-8 text-center">
        <h1 className="text-2xl font-bold">
          You haven’t created any posts yet
        </h1>
      </Container>
    );
  }

  return (
    <Container className="py-8">
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
