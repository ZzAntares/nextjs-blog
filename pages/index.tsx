import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import Layout, { siteTitle } from '../components/Layout'
import Date from '../components/Date'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData, PostData } from '../lib/posts'

type Props = {
  posts: PostData[]
}

// The component now receives props object set by 'getStaticProps' defined below
export default function Home({ posts }: Props) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hi, this is a <b>demo</b> to see how NextJS works, maybe could be used
          for my custom app.
        </p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {posts.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

// Use 'getServerSideProps' to run at request time instead which receives a 'context' containing request data
export const getStaticProps: GetStaticProps = async () => {
  // This function runs at build time
  const posts: PostData[] = getSortedPostsData()

  return {
    props: {
      posts,
    },
  }
}
