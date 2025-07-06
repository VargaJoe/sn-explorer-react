import { Repository } from '@sensenet/client-core'
import { ConstantContent } from '@sensenet/client-core'

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

// Export repository and methods
const sensenetService = {
  repository,
  loadChildren,
  getContent
}

export default sensenetService