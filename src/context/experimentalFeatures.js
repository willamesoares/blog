import React, { createContext } from 'react';
import qs from 'querystring';

import { getExperimentalFeaturesTokens } from '../utils/experimentalFeatures';

export const ExperimentalFeaturesContext = createContext();
const ExperimentalFeaturesProvider = props => {
  const queryString = (window ? window.location.search : '').slice(1);
  const queryParams = qs.parse(queryString);
  const { comments } = queryParams;
  const { comments: commentsToken } = getExperimentalFeaturesTokens();

  return (
    <ExperimentalFeaturesContext.Provider
      value={{
        features: {
          comments: comments === commentsToken
        }
      }}
    >
      {props.children}
    </ExperimentalFeaturesContext.Provider>
  );
};
export default ExperimentalFeaturesProvider;
