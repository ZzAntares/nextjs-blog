import fs from 'fs'
import path from 'path'
import matter, { GrayMatterFile } from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

// TODO Later move to a consts module
const POSTS_DIRECTORY = path.join(process.cwd(), 'posts')

// TODO Later move this to a types/models module
export type PostData = {
  id: string
  title?: string
  contentHtml?: string
  date?: Date
}

type PostParams = {
  params: { id: string }
}

/**
 * Reads the filenames in the /posts directory and uses them to build post data.
 *
 * @returns A sorted list by date of posts.
 */
export function getSortedPostsData(): PostData[] {
  // Get files names in the /posts directory
  const fileNames: string[] = fs.readdirSync(POSTS_DIRECTORY)

  return fileNames
    .map((fileName) => {
      // Remove file extension
      const id = fileName.replace(/\.md$/, '')

      // Read markdown file contents as string
      const fullPath = path.join(POSTS_DIRECTORY, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const matterResult: GrayMatterFile<string> = matter(fileContents)

      return {
        id,
        ...matterResult.data,
      }
    })
    .sort((a: PostData, b: PostData) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
}

/**
 * Get a list of all post IDs as an object, as nextjs expects them. This is
 * useful to know all available paths (posts) that can be viewed.
 *
 * @returns List of all posts IDs as objects.
 */
export function getAllPostsIds(): PostParams[] {
  // Get filenames in this directory
  const fileNames: string[] = fs.readdirSync(POSTS_DIRECTORY)

  return fileNames.map((fileName: string) => {
    return {
      params: {
        // Remove extension to fileName
        // it needs the 'id' key because the dynamic path file is called [id].jsx
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

/**
 * Fetch data from a single post given its ID, which as of now this is the file
 * name without extension of the post in the /posts directory.
 *
 * @returns the post data associated with the given ID.
 */
export async function getPostData(id: string): Promise<PostData> {
  // The ID we choosed to be the file name without extension
  const fullPath = path.join(POSTS_DIRECTORY, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult: GrayMatterFile<string> = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}
