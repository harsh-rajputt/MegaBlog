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

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug,
      {
        title,
        slug,            // ✅ ensured slug is stored
        content,
        featuredImage,
        status,
        userId,
      }
    );
  }

  async updatePost(documentId, data) {
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      documentId,
      data
    );
  }

  async deletePost(documentId) {
    await this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      documentId
    );
    return true;
  }

  async getPost(documentId) {
    return await this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      documentId
    );
  }

  async getAllPosts() {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("status", "active")]
    );
  }

  // ================= FILES =================

  async uploadFile(file) {
    return await this.bucket.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file
    );
  }

  async deleteFile(fileId) {
    await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
    return true;
  }

  // ✅ FIXED
  getFilePreview(fileId) {
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
