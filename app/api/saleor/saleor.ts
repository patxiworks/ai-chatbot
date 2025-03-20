// src/api/saleor.ts
import { GraphQLClient, gql } from 'graphql-request';

const SALEOR_API_URL = 'http://localhost:8000/graphql';
const client = new GraphQLClient(SALEOR_API_URL, {
  headers: { Authorization: `Bearer HBbfy1FaUzIGwfUPhOx5KWpBxwm02x` },
});

export const PRODUCT_QUERY = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
      id
      name
      description
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
          stop {
            gross {
              amount
              currency
            }
          }
        }
      }
    }
  }
`;

export async function fetchProductDetails(productId: string) {
  return await client.request(PRODUCT_QUERY, { id: productId });
}
