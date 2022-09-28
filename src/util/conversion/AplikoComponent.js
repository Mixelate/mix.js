"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AplikoBuildComponentRows = exports.AplikoBuildComponent = exports.isAplikoDropdown = exports.isAplikoLinkButton = exports.isAplikoInteractButton = void 0;
const discord_js_1 = require("discord.js");
const Errors_1 = require("../Errors");
function isAplikoInteractButton(aplikoComponent) {
    return 'customId' in aplikoComponent && 'style' in aplikoComponent;
}
exports.isAplikoInteractButton = isAplikoInteractButton;
function isAplikoLinkButton(aplikoComponent) {
    return 'url' in aplikoComponent;
}
exports.isAplikoLinkButton = isAplikoLinkButton;
function isAplikoDropdown(aplikoComponent) {
    return 'options' in aplikoComponent;
}
exports.isAplikoDropdown = isAplikoDropdown;
function AplikoBuildComponent(aplikoComponent) {
    if (isAplikoInteractButton(aplikoComponent)) {
        const messageButton = new discord_js_1.MessageButton()
            .setCustomId(aplikoComponent.customId)
            .setStyle(aplikoComponent.style)
            .setLabel(aplikoComponent.label)
            .setDisabled(aplikoComponent.disabled ? aplikoComponent.disabled : false);
        if (aplikoComponent.emoji)
            messageButton.setEmoji(aplikoComponent.emoji);
        return messageButton;
    }
    if (isAplikoLinkButton(aplikoComponent)) {
        const messageButton = new discord_js_1.MessageButton().setURL(aplikoComponent.url).setStyle('LINK').setLabel(aplikoComponent.label);
        if (aplikoComponent.emoji)
            messageButton.setEmoji(aplikoComponent.emoji);
        return messageButton;
    }
    if (isAplikoDropdown(aplikoComponent)) {
        const messageSelect = new discord_js_1.MessageSelectMenu()
            .setCustomId(aplikoComponent.customId)
            .setPlaceholder(aplikoComponent.label || 'Pick an option')
            .setOptions(aplikoComponent.options.map((option) => {
            return {
                label: option.title,
                description: option.description,
                value: option.value,
                default: option.default,
                emoji: option.emoji
            };
        }));
        if (aplikoComponent.min)
            messageSelect.setMinValues(aplikoComponent.min);
        if (aplikoComponent.max)
            messageSelect.setMaxValues(aplikoComponent.max);
        return messageSelect;
    }
    return undefined;
}
exports.AplikoBuildComponent = AplikoBuildComponent;
function AplikoBuildComponentRows(...componentRows) {
    const compiledRows = [];
    componentRows.forEach((row, rowIdx) => {
        if (row.length == 0)
            return;
        const compiledRow = new discord_js_1.MessageActionRow();
        row.forEach((component, componentIdx) => {
            const compiledComponent = AplikoBuildComponent(component) ?? (0, Errors_1.ThrowError)(`Invalid component data at [${rowIdx}][${componentIdx}]`);
            compiledRow.addComponents(compiledComponent);
        });
        compiledRows.push(compiledRow);
    });
    return compiledRows;
}
exports.AplikoBuildComponentRows = AplikoBuildComponentRows;
