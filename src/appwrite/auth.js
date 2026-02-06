import conf from '../conf/conf.js'
import { Client, Account, ID } from 'appwrite'

class AuthService {
    client
    account

    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwrite_url)
            .setProject(conf.appwrite_projectID)

        this.account = new Account(this.client)
    }

    // Signup
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )

            if (userAccount) {
                // auto-login after signup
                return this.login({ email, password })
            }

            return userAccount
        } catch (error) {
            console.error('Appwrite :: createAccount :: error', error)
            throw error
        }
    }

    // Login
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.error('Appwrite :: login :: error', error)
            throw error
        }
    }

    // Get logged-in user
    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.log('Appwrite :: getCurrentUser :: error', error)
            return null
        }
    }

    // Logout
    async logout() {
        try {
            return await this.account.deleteSession('current')
        } catch (error) {
            console.log('Appwrite :: logout :: error', error)
        }
    }
}

const authService = new AuthService()
export default authService
