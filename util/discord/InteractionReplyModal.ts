import { Routes } from "discord-api-types/v9";
import { AplikoBot } from "../../Bot";
import { ModalInteraction } from "../../struct/discord/interactions/builder";

export async function InteractionReplyModal(bot: AplikoBot, modalInteraction: ModalInteraction) {
    await bot.rest.post(
        Routes.interactionCallback(modalInteraction.interactionId, modalInteraction.interactionToken),
        {
            'body': {
                'type': 9,
                'data': {
                    'type': '5',
                    ...modalInteraction.toJSON()
                }
            }
        }
    )
}