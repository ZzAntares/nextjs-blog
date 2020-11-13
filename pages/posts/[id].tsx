import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'

import Layout from '../../components/Layout'
import Date from '../../components/Date'
import utilStyles from '../../styles/utils.module.css'
import { getAllPostsIds, getPostData, PostData } from '../../lib/posts'

type Props = {
  post: PostData
}

const Post = ({ post }: Props) => {
  return (
    <Layout>

      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.haedingXl}>{post.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={post.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </Layout>
  )
}

export default Post

// To generate paths according to build time data
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostsIds()

  return {
    paths,
    fallback: false,
  }
}

// Function that runs at build time to generate 'props' for page component
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postId: string = Array.isArray(params?.id) ? params.id[0] : params.id
  const post: PostData = await getPostData(postId)

  return {
    props: {
      post
    }
  }
}
