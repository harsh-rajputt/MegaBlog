import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col">
         <div className="w-full h-56 overflow-hidden">
        <img
          src={appwriteService.getFilePreview(featuredImage)}
          alt={title}
          className="w-full h-full object-cover"
        />
        </div>

         <div className="p-4 flex-1 flex items-center justify-center">
          <h2 className="text-lg font-semibold text-center">
            {title}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
