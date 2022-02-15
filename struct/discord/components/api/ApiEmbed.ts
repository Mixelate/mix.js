export interface ApiEmbed {
  title?: string;

  description?: string;

  url?: string;

  timestamp?: string; // TODO: ISO8601 Timestapm

  color?: `#${string}`;

  footer?: ApiEmbedFooter;

  image?: ApiEmbedImage;

  thumbnail?: ApiEmbedThumbnail;

  video?: ApiEmbedVideo;

  provider?: ApiEmbedProvider;

  author?: ApiEmbedAuthor;

  fields?: ApiEmbedField[];
}

export interface ApiEmbedFooter {}

export interface ApiEmbedImage {}

export interface ApiEmbedThumbnail {}

export interface ApiEmbedVideo {}

export interface ApiEmbedProvider {}

export interface ApiEmbedAuthor {}

export interface ApiEmbedField {}
