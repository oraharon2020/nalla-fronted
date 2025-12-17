import { gql } from '@apollo/client';

// Get all product categories
export const GET_CATEGORIES = gql`
  query GetCategories {
    productCategories(first: 50, where: { hideEmpty: true }) {
      nodes {
        id
        databaseId
        name
        slug
        description
        image {
          sourceUrl
          altText
        }
        count
      }
    }
  }
`;

// Get products with filters
export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int = 12
    $after: String
    $categorySlug: String
    $orderBy: [ProductsOrderbyInput]
  ) {
    products(
      first: $first
      after: $after
      where: { category: $categorySlug, orderby: $orderBy }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on SimpleProduct {
          id
          databaseId
          name
          slug
          price
          regularPrice
          salePrice
          onSale
          image {
            sourceUrl
            altText
          }
          galleryImages {
            nodes {
              sourceUrl
              altText
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
        ... on VariableProduct {
          id
          databaseId
          name
          slug
          price
          regularPrice
          salePrice
          onSale
          image {
            sourceUrl
            altText
          }
          galleryImages {
            nodes {
              sourceUrl
              altText
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
          variations {
            nodes {
              id
              databaseId
              name
              price
              regularPrice
              salePrice
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Get single product by slug
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      ... on SimpleProduct {
        id
        databaseId
        name
        slug
        description
        shortDescription
        price
        regularPrice
        salePrice
        onSale
        sku
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        attributes {
          nodes {
            name
            options
          }
        }
        related {
          nodes {
            ... on SimpleProduct {
              id
              databaseId
              name
              slug
              price
              regularPrice
              salePrice
              onSale
              image {
                sourceUrl
                altText
              }
            }
            ... on VariableProduct {
              id
              databaseId
              name
              slug
              price
              regularPrice
              salePrice
              onSale
              image {
                sourceUrl
                altText
              }
            }
          }
        }
      }
      ... on VariableProduct {
        id
        databaseId
        name
        slug
        description
        shortDescription
        price
        regularPrice
        salePrice
        onSale
        sku
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        attributes {
          nodes {
            name
            options
          }
        }
        variations {
          nodes {
            id
            databaseId
            name
            price
            regularPrice
            salePrice
            attributes {
              nodes {
                name
                value
              }
            }
            image {
              sourceUrl
              altText
            }
          }
        }
        related {
          nodes {
            ... on SimpleProduct {
              id
              databaseId
              name
              slug
              price
              regularPrice
              salePrice
              onSale
              image {
                sourceUrl
                altText
              }
            }
            ... on VariableProduct {
              id
              databaseId
              name
              slug
              price
              regularPrice
              salePrice
              onSale
              image {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  }
`;

// Get featured products
export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($first: Int = 8) {
    products(first: $first, where: { featured: true }) {
      nodes {
        ... on SimpleProduct {
          id
          databaseId
          name
          slug
          price
          regularPrice
          salePrice
          onSale
          image {
            sourceUrl
            altText
          }
        }
        ... on VariableProduct {
          id
          databaseId
          name
          slug
          price
          regularPrice
          salePrice
          onSale
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// Search products
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $first: Int = 12) {
    products(first: $first, where: { search: $search }) {
      nodes {
        ... on SimpleProduct {
          id
          databaseId
          name
          slug
          price
          regularPrice
          salePrice
          onSale
          image {
            sourceUrl
            altText
          }
        }
        ... on VariableProduct {
          id
          databaseId
          name
          slug
          price
          regularPrice
          salePrice
          onSale
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// Get single category by slug
export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      image {
        sourceUrl
        altText
      }
      count
    }
  }
`;
