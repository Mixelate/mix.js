import { EmojiIdentifierResolvable, EmojiResolvable, MessageActionRow, MessageActionRowComponentResolvable, MessageButton, MessageButtonStyleResolvable, MessageComponent, MessageSelectMenu, Options } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { ThrowError } from "../Errors";

export interface AplikoBaseButton {
    emoji?: EmojiIdentifierResolvable,
    label: string
}

export interface AplikoInteractButton extends AplikoBaseButton {
    customId: string
    style: Exclude<MessageButtonStyleResolvable, 'LINK' | MessageButtonStyles>
    disabled: boolean
}

export function isAplikoInteractButton(aplikoComponent: AplikoComponent): aplikoComponent is AplikoInteractButton {
    return 'customId' in aplikoComponent && 'style' in aplikoComponent
}

export interface AplikoLinkButton extends AplikoBaseButton {
    url: string
}

export function isAplikoLinkButton(aplikoComponent: AplikoComponent): aplikoComponent is AplikoLinkButton {
    return 'url' in aplikoComponent
}

export interface AplikoDropdown {
    customId: string
    label: string
    options: AplikoDropdownOption[]
    min?: number
    max?: number
}

export interface AplikoDropdownOption {
    title: string,
    emoji?: EmojiIdentifierResolvable,
    description?: string,
    value: string
    default?: boolean
}

export function isAplikoDropdown(aplikoComponent: AplikoComponent): aplikoComponent is AplikoDropdown {
    return 'options' in aplikoComponent
}

export type AplikoComponent = AplikoInteractButton | AplikoLinkButton | AplikoDropdown

export function AplikoBuildComponent(aplikoComponent: AplikoComponent): MessageComponent | undefined {
    if (isAplikoInteractButton(aplikoComponent)) {
        const messageButton = new MessageButton()
            .setCustomId(aplikoComponent.customId)
            .setStyle(aplikoComponent.style)
            .setLabel(aplikoComponent.label)
            .setDisabled(aplikoComponent.disabled ? aplikoComponent.disabled : false)

        if (aplikoComponent.emoji)
            messageButton.setEmoji(aplikoComponent.emoji)

        return messageButton as MessageComponent
    }

    if (isAplikoLinkButton(aplikoComponent)) {
        const messageButton = new MessageButton()
            .setURL(aplikoComponent.url)
            .setStyle('LINK')
            .setLabel(aplikoComponent.label)

        if (aplikoComponent.emoji)
            messageButton.setEmoji(aplikoComponent.emoji)

        return messageButton as MessageComponent
    }

    if (isAplikoDropdown(aplikoComponent)) {
        const messageSelect = new MessageSelectMenu()
            .setCustomId(aplikoComponent.customId)
            .setPlaceholder(aplikoComponent.label)
            .setOptions(aplikoComponent.options.map(option => {
                return {
                    label: option.title,
                    description: option.description,
                    value: option.value,
                    default: option.default,
                    emoji: option.emoji
                }
            }))

        if (aplikoComponent.min)
            messageSelect.setMinValues(aplikoComponent.min)

        if (aplikoComponent.max)
            messageSelect.setMaxValues(aplikoComponent.max)

        return messageSelect as MessageComponent
    }

    return undefined
}

export function AplikoBuildComponentRows(...componentRows: AplikoComponent[][]): MessageActionRow[] {
    const compiledRows: MessageActionRow[] = []

    componentRows.forEach((row, rowIdx) => {
        const compiledRow = new MessageActionRow()

        row.forEach((component, componentIdx) => {
            const compiledComponent = AplikoBuildComponent(component) ??
                ThrowError(`Invalid component data at [${rowIdx}][${componentIdx}]`)

            compiledRow.addComponents(compiledComponent as MessageActionRowComponentResolvable)
        })

        compiledRows.push(compiledRow)
    })

    return compiledRows
}