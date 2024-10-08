export default interface Product {
  id: number;
  attributes: {
    title: string;
    price: number;
    highlight: {
      title: string;
      value: string;
    };
    description: string;
    content: string;
    featured: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    category: string;
    feature_image: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
          formats: {
            medium: {
              url: string;
            };
            small: {
              url: string;
            };
            large: {
              url: string;
            };
          };
        };
      };
    };
  };
}
