import { Repository } from '@sensenet/client-core'
import { ConstantContent } from '@sensenet/client-core'
import axios from 'axios'

// Create and configure a Repository instance
const createRepository = () => {
  const repository = new Repository({
    repositoryUrl: 'https://insql-daily.test.sensenet.cloud',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'DisplayName', 'Icon', 'IsFolder'],
  })
  return repository
}

// Create repository instance
const repository = createRepository()

/**
 * Loads children of a content
 * @param {string} path - Path of the parent content
 * @returns {Promise} - Promise resolving to the children content items
 */
export const loadChildren = async (path = ConstantContent.PORTAL_ROOT.Path) => {
  try {
    // Use a robust query to fetch all children, including folders and files
    const result = await repository.loadCollection({
      path,
      oDataOptions: {
        select: [
          'Id',
          'Path',
          'Name',
          'DisplayName',
          'Description',
          'Icon',
          'Type',
          'IsFolder',
          'CreationDate',
          'ModificationDate',
          'Size',
        ],
        orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
        expand: ['Actions'],
        top: 100,
        // Add query to exclude system folders if needed
        // query: "TypeIs:Folder OR TypeIs:File",
      },
    })
    console.log('sensenetService.loadChildren result:', result)
    return result.d.results
  } catch (error) {
    console.error('Error loading children:', error)
    return []
  }
}

/**
 * Get content item by path
 * @param {string} path - Path of the content
 * @returns {Promise} - Promise resolving to the content item
 */
export const getContent = async (path: string) => {
  try {
    const result = await repository.load({
      idOrPath: path,
      oDataOptions: {
        select: ['Id', 'Path', 'Name', 'DisplayName', 'Description', 'Icon', 'Type', 'IsFolder'],
        expand: ['Actions'],
      },
    })
    return result.d
  } catch (error) {
    console.error('Error loading content:', error)
    return null
  }
}

// Add login, logout, getCurrentUser methods for authentication
const API_BASE_URL = process.env.REACT_APP_SN_API_URL || 'http://localhost:8080'

const login = async (username: string, password: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/odata/Authentication/Login`,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  )
  return response.data
}

const logout = async () => {
  await axios.post(`${API_BASE_URL}/odata/Authentication/Logout`, {}, { withCredentials: true })
}

const getCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/odata/CurrentUser`, { withCredentials: true })
  return response.data
}

const sensenetService = {
  repository,
  loadChildren,
  getContent,
  login,
  logout,
  getCurrentUser,
}

export default sensenetService