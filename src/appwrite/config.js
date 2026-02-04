import conf from '../conf/conf.js'
import { Client, ID, Databases, Storage, Query } from 'appwrite'

export class Service {
    client
    databases
    bucket

    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwrite_url)
            .setProject(conf.appwrite_projectID)

        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    // Create post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwrite_databaseID,
                conf.appwrite_collectionID,
                slug, // documentId
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log('Appwrite :: createPost :: error', error)
            throw error
        }
    }

    // Update post
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwrite_databaseID,
                conf.appwrite_collectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log('Appwrite :: updatePost :: error', error)
            throw error
        }
    }

    // Delete post
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwrite_databaseID,
                conf.appwrite_collectionID,
                slug
            )
            return true
        } catch (error) {
            console.log('Appwrite :: deletePost :: error', error)
            return false
        }
    }

    // Get single post
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwrite_databaseID,
                conf.appwrite_collectionID,
                slug
            )
        } catch (error) {
            console.log('Appwrite :: getPost :: error', error)
            return null
        }
    }

    // Get all active posts
    async getPosts(
        queries = [Query.equal('status', 'active')]
    ) {
        try {
            return await this.databases.listDocuments(
                conf.appwrite_databaseID,
                conf.appwrite_collectionID,
                queries
            )
        } catch (error) {
            console.log('Appwrite :: getPosts :: error', error)
            return null
        }
    }

    // Upload file to storage
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwrite_bucketID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log('Appwrite :: uploadFile :: error', error)
            return null
        }
    }

    // Delete file
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwrite_bucketID,
                fileId
            )
            return true
        } catch (error) {
            console.log('Appwrite :: deleteFile :: error', error)
            return false
        }
    }

    // Preview image
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwrite_bucketID,
            fileId
        )
    }
}

const service = new Service()
export default service
