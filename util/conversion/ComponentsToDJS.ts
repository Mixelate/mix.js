import { MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js";
import { ApiButton, ApiComponent, ButtonStyle, ComponentType, IsApiButton, IsApiDropdown, IsApiInteractButton, IsApiLinkButton, IsApiMultiSelectDropdown, IsApiTextField } from "../../struct";
import { ActionRow } from "../../struct/discord/components/builder/ActionRow";

export function ComponentsToDJS(...actionRows: ActionRow[]): MessageActionRow[] {
    const apiActionRows = actionRows.map(actionRow => actionRow.toJSON());
    const djsActionRows: MessageActionRow[] = [];

    for (const actionRow of apiActionRows) {
        const djsActionRow = new MessageActionRow();

        for (const component of actionRow.components) {
            if (IsApiButton(component)) {
                const djsButton = new MessageButton();

                djsButton.setDisabled(component.disabled ? component.disabled : false);
                djsButton.setLabel(component.label)

                if (IsApiInteractButton(component))
                    djsButton.setCustomId(component.custom_id)

                if (IsApiLinkButton(component))
                    djsButton.setURL(component.url)

                if (component.emoji)
                    djsButton.setEmoji(component.emoji);

                switch (component.style) {
                    case ButtonStyle.DANGER: {
                        djsButton.setStyle('DANGER');
                        break;
                    }

                    case ButtonStyle.LINK: {
                        djsButton.setStyle('LINK')
                        break;
                    }

                    case ButtonStyle.PRIMARY: {
                        djsButton.setStyle('PRIMARY')
                        break;
                    }

                    case ButtonStyle.SECONDARY: {
                        djsButton.setStyle('SECONDARY')
                        break;
                    }

                    case ButtonStyle.SUCCESS: {
                        djsButton.setStyle('SUCCESS')
                    }
                }

                djsActionRow.addComponents(djsButton)
            }

            if (IsApiDropdown(component)) {
                const djsDropdown = new MessageSelectMenu();
                djsDropdown.setCustomId(component.custom_id);
                djsDropdown.setPlaceholder(component.placeholder ? component.placeholder : 'Select an option');

                if (IsApiMultiSelectDropdown(component)) {
                    djsDropdown.setMinValues(component.min_values ? component.min_values : 1);
                    djsDropdown.setMaxValues(component.max_values == 'MAX' ? component.options.length : component.max_values);
                }

                for (const option of component.options) {
                    djsDropdown.addOptions({
                        label: option.label,
                        value: option.value ? option.value : option.label,
                        description: option.description,
                        emoji: option.emoji,
                        default: option.default ? option.default : false
                    });
                }

                djsActionRow.addComponents(djsDropdown);
            }

            // TODO: Text field
        }

        djsActionRows.push(djsActionRow);
    }

    return djsActionRows;
}