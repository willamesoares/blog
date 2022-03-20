import { GraphQLClient, RequestDocument } from "graphql-request";

export const fetchCms = async <T>(
  query: RequestDocument,
  variables?: Record<string, unknown>,
  requestHeaders?: HeadersInit
): Promise<T> => {
  const graphcms = new GraphQLClient(process.env.GRAPH_CMS_URL as string, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_CMS_PAT}`,
    },
  });

  return graphcms.request(query, variables, requestHeaders);
};
