import { siteConfig } from '@/config/site';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || `${siteConfig.wordpressUrl}/graphql`;

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: { message: string }[];
}

// Simple GraphQL client optimized for Next.js Server Components
export async function graphqlFetch<T = any>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data: T }> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL Error');
  }

  return { data: json.data as T };
}

// Wrapper to match Apollo-like API
export const client = {
  query: async ({ query, variables }: { query: any; variables?: Record<string, unknown> }) => {
    // Extract query string from gql tag
    const queryString = query.loc?.source?.body || query;
    return graphqlFetch(queryString, variables);
  },
};
