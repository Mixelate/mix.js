"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsToDJS = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../..");
function ComponentsToDJS(...actionRows) {
    const apiActionRows = actionRows.filter(actionRow => actionRow != undefined).map((actionRow) => actionRow.toJSON());
    const djsActionRows = [];
    for (const actionRow of apiActionRows) {
        const djsActionRow = new discord_js_1.MessageActionRow();
        for (const component of actionRow.components) {
            if ((0, __1.IsApiButton)(component)) {
                const djsButton = new discord_js_1.MessageButton();
                djsButton.setDisabled(component.disabled ? component.disabled : false);
                djsButton.setLabel(component.label);
                if ((0, __1.IsApiInteractButton)(component))
                    djsButton.setCustomId(component.custom_id);
                if ((0, __1.IsApiLinkButton)(component))
                    djsButton.setURL(component.url);
                if (component.emoji)
                    djsButton.setEmoji(component.emoji);
                switch (component.style) {
                    case __1.ButtonStyle.DANGER: {
                        djsButton.setStyle('DANGER');
                        break;
                    }
                    case __1.ButtonStyle.LINK: {
                        djsButton.setStyle('LINK');
                        break;
                    }
                    case __1.ButtonStyle.PRIMARY: {
                        djsButton.setStyle('PRIMARY');
                        break;
                    }
                    case __1.ButtonStyle.SECONDARY: {
                        djsButton.setStyle('SECONDARY');
                        break;
                    }
                    case __1.ButtonStyle.SUCCESS: {
                        djsButton.setStyle('SUCCESS');
                    }
                }
                djsActionRow.addComponents(djsButton);
            }
            if ((0, __1.IsApiDropdown)(component)) {
                const djsDropdown = new discord_js_1.MessageSelectMenu();
                djsDropdown.setCustomId(component.custom_id);
                djsDropdown.setPlaceholder(component.placeholder ? component.placeholder : 'Select an option');
                if ((0, __1.IsApiMultiSelectDropdown)(component)) {
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
exports.ComponentsToDJS = ComponentsToDJS;
