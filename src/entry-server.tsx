import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { PageDataProvider } from '~/context/PageData'
import App from '~/App'

export function render(url: string, data: unknown = null): string {
  return renderToString(
    <PageDataProvider data={data}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </PageDataProvider>
  )
}
