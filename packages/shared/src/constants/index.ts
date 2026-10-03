export const PAGE_LIMITS = {
  default: 30,
  filmsList: 48,
  filmsSearch: 10,
  hobbyItems: 30,
  booksList: 48,
};
export const NEW_ITEM_ID = 'new';

export const SANITIZE_CONFIG = {
  allowedTags: [
    'div',
    'p',
    'b',
    'strong',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'i',
    'ul',
    'ol',
    'blockquote',
    'a',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https'],
  allowProtocolRelative: false,
};
