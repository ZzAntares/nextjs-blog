import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // Get files names in the /posts directory
  const fileNames = fs.readdirSync(postsDirectory)

  const allPostsData = fileNames.map((fileName) => {
    // Remove file extension
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file contents as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    return {
      id,
      ...matterResult.data,
    }
  })

  // Sort posts by date

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostsIds() {
  // Get filenames in this directory
  const fileNames = fs.readdirSync(postsDirectory)

  // The function returns something like this
  // [
  //   {
  //     params: {
  //       id: 'first-file-name'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'second-file-name'
  //     }
  //   },
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        // Remove extension to fileName
        // it needs the 'id' key because the dynamic path file is called [id].jsx
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

// Get data from a single post given its ID
export async function getPostData(id) {
  // The ID we choosed to be the file name without extension
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

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
