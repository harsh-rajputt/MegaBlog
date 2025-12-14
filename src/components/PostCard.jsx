import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4 h-full flex flex-col">
        
        {/* Image container */}
        <div className="w-full h-48 mb-4 overflow-hidden rounded-xl">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold line-clamp-2">
          {title}
        </h2>

      </div>
    </Link>
  );
}

export default PostCard;
