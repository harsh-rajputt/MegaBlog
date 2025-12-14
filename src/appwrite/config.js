import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // ================= POSTS =================

  // Create Post
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("createPost error", error);
      throw error;
    }
  }

  // Update Post
  async updatePost(slug, data) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        data
      );
    } catch (error) {
      console.log("updatePost error", error);
      throw error;
    }
  }

  // Delete Post
  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("deletePost error", error);
      return false;
    }
  }

  // Get Single Post
  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("getPost error", error);
      return null;
    }
  }

  // ✅ HOME → ALL ACTIVE POSTS (ALL USERS)
  async getAllPosts() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("status", "active")]
      );
    } catch (error) {
      console.log("getAllPosts error", error);
      return null;
    }
  }

  // ✅ MY POSTS → ONLY LOGGED-IN USER POSTS
  async getUserPosts(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("status", "active"),
        ]
      );
    } catch (error) {
      console.log("getUserPosts error", error);
      return null;
    }
  }

  // ================= FILES =================

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("uploadFile error", error);
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("deleteFile error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
