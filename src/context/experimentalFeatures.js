import React, { createContext } from 'react';
import qs from 'querystring';

import { getExperimentalFeaturesTokens } from '../utils/experimentalFeatures';

export const ExperimentalFeaturesContext = createContext();
const ExperimentalFeaturesProvider = (props) => {
  const queryString = window ? window.location.search : '';
  const queryParams = queryString[0] === '?' ?
    qs.parse(queryString.slice(1)) : qs.parse(queryString);
  const {
    comments: commentsToken
  } = getExperimentalFeaturesTokens();

  const hasCommentsEnabled = () => {
    const { comments } = queryParams;
    return commentsToken === comments;
  }

  return (
    <ExperimentalFeaturesContext.Provider value={{
      hasCommentsEnabled
    }}>
      {props.children}
    </ExperimentalFeaturesContext.Provider>
  )
}
export default ExperimentalFeaturesProvider;
