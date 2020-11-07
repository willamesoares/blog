import React from 'react'
import 'prismjs/themes/prism-okaidia.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import './src/styles/prismjs-overrides.css'

import ExperimentalFeaturesProvider from './src/context/experimentalFeatures'

export const wrapRootElement = ({ element }) => (
  <ExperimentalFeaturesProvider>
    {element}
  </ExperimentalFeaturesProvider>
)
