import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AppLayout from '~/components/AppLayout'
import Header from '~/components/Header'
import Posts from '~/pages/Posts'
import Post from '~/pages/Post'
import { POST_TYPE } from '~/constants'
import * as gtag from '~/utils/gtags'

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID as string | undefined

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (GA_TRACKING_ID) {
      gtag.pageview(location.pathname, GA_TRACKING_ID)
    }
  }, [location])

  return (
    <>
      {GA_TRACKING_ID && import.meta.env.PROD && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
              `,
            }}
          />
        </>
      )}
      <Header />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Posts type={POST_TYPE.TECH} />} />
          <Route
            path="/non-tech"
            element={<Posts type={POST_TYPE.NON_TECH} />}
          />
          <Route path="/post/:slug" element={<Post />} />
        </Routes>
      </AppLayout>
    </>
  )
}
