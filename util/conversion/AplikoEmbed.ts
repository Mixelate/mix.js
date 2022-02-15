import {
  ColorResolvable,
  Message,
  MessageEmbed,
  MessageEmbedThumbnail,
} from "discord.js";
import { APLIKO_OPTIONS } from "../../Bot";
import { ThrowError } from "../Errors";

/**
 * builder pattern is annoying, let's fix it @discord.js LOL
 */

export const AplikoEmbedPrimaryColor: ColorResolvable = "#65a7e6";
export const AplikoEmbedSuccessColor: ColorResolvable = "#44ff44";
export const AplikoEmbedErrorColor: ColorResolvable = "#ff4444";
export const AplikoEmbedTwoColumnRows: boolean = true;

export const AplikoEmbedMaxAuthorNameSize = 256;
export const aplikoEmbedMaxTitleSize = 256;
export const AplikoEmbedMaxDescriptionSize = 2048;
export const AplikoEmbedMaxFields = 25;
export const AplikoEmbedMaxFieldTitleSize = 256;
export const AplikoEmbedMaxFieldContentSize = 1024;
export const AplikoEmbedMaxFooterContentSize = 2048;

export enum AplikoEmbedStyle {
  PRIMARY = 1, // Thanks TypeScript, for compliation errors for enums starting at 0 but compiling them to start at 0
  SUCCESS = 2,
  ERROR = 3,
  CUSTOM = 4,
}

export interface AplikoEmbedFooter {
  content: string;
  imageUrl?: string;
}

export interface AplikoEmbedAuthor {
  name: string;
  imageUrl?: string;
  url?: string;
}

export interface AplikoEmbedField {
  title: string;
  content: string;
  inline?: boolean;
}

export interface AplikoEmbed {
  style?: AplikoEmbedStyle;
  customStyle?: ColorResolvable;
  author?: AplikoEmbedAuthor;
  title?: string;
  description?: string;
  footer?: AplikoEmbedFooter;
  thumbnail?: MessageEmbedThumbnail | string;
  fields?: AplikoEmbedField[];
}

export function AplikoBuildEmbeds(
  ...aplikoEmbeds: AplikoEmbed[]
): MessageEmbed[] {
  const messageEmbeds: MessageEmbed[] = [];

  for (const aplikoEmbed of aplikoEmbeds) {
    const messageEmbed = new MessageEmbed();

    // Set embed color based on style
    switch (aplikoEmbed.style) {
      case AplikoEmbedStyle.SUCCESS: {
        messageEmbed.setColor(AplikoEmbedSuccessColor);
        break;
      }

      case AplikoEmbedStyle.ERROR: {
        messageEmbed.setColor(AplikoEmbedErrorColor);
        break;
      }

      case AplikoEmbedStyle.CUSTOM: {
        messageEmbed.setColor(
          aplikoEmbed.customStyle
            ? aplikoEmbed.customStyle
            : AplikoEmbedPrimaryColor
        );
        break;
      }

      default: {
        if (APLIKO_OPTIONS?.apprearance?.embedPrimaryColor)
          messageEmbed.setColor(APLIKO_OPTIONS.apprearance.embedPrimaryColor);
        else messageEmbed.setColor(AplikoEmbedPrimaryColor);
      }
    }

    // Set author
    if (aplikoEmbed.author) {
      if (aplikoEmbed.author.name.length > AplikoEmbedMaxAuthorNameSize)
        ThrowError("Embed author name is too long");

      messageEmbed.setAuthor({
        name: aplikoEmbed.author.name,
        iconURL: aplikoEmbed.author.imageUrl,
        url: aplikoEmbed.author.url,
      });
    }

    // Set title
    if (aplikoEmbed.title) {
      if (aplikoEmbed.title.length > aplikoEmbedMaxTitleSize)
        ThrowError("Embed title is too long");

      messageEmbed.setTitle(aplikoEmbed.title);
    }

    // Set description
    if (aplikoEmbed.description) {
      if (aplikoEmbed.description.length > AplikoEmbedMaxDescriptionSize)
        ThrowError("Embed description is too long");

      messageEmbed.setDescription(aplikoEmbed.description);
    }

    // Set footer
    if (aplikoEmbed.footer) {
      if (aplikoEmbed.footer.content.length > AplikoEmbedMaxFooterContentSize)
        ThrowError("Embed footer is too long");

      messageEmbed.setFooter({
        text: aplikoEmbed.footer.content,
        iconURL: aplikoEmbed.footer.imageUrl,
      });
    }

    // Set thumbnail
    if (aplikoEmbed.thumbnail)
      messageEmbed.thumbnail = isMessageEmbedThumbnail(aplikoEmbed.thumbnail)
        ? aplikoEmbed.thumbnail
        : { url: aplikoEmbed.thumbnail };

    // Add fields
    if (aplikoEmbed.fields && aplikoEmbed.fields.length > 0) {
      if (aplikoEmbed.fields.length > AplikoEmbedMaxFields)
        ThrowError("Embed has too many fields");

      for (const aplikoEmbedField of aplikoEmbed.fields) {
        if (aplikoEmbedField.title.length > AplikoEmbedMaxFieldTitleSize)
          ThrowError("Embed field title is too long");

        if (aplikoEmbedField.content.length > AplikoEmbedMaxFieldContentSize)
          ThrowError("Embged field content is too long");

        messageEmbed.addField(
          aplikoEmbedField.title,
          aplikoEmbedField.content,
          aplikoEmbedField.inline ? aplikoEmbedField.inline : false
        );

        if (
          AplikoEmbedTwoColumnRows &&
          aplikoEmbedField.inline &&
          (messageEmbed.fields.length % 4 === 0 ||
            messageEmbed.fields.length === 1)
        )
          messageEmbed.addField(
            "\u200b", // Invis space
            "\u200b", // Invis space
            true
          );
      }
    }

    messageEmbeds.push(messageEmbed);
  }

  return messageEmbeds;
}

function isMessageEmbedThumbnail(
  thumbnail: any
): thumbnail is MessageEmbedThumbnail {
  try {
    return "url" in thumbnail;
  } catch (_) {}

  return false;
}
