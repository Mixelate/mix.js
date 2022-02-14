## 💥 Apliko: A TypeScript Discord.js framework

Apliko is a Discord.js framework aimed at ```making the work of professionals easier and faster```. It uses a collection of applications to accomplish common tasks in Discord bots. These include slash commands, channel controllers, questionnaires, and panels. 

## Use Apliko in your project
Apliko has not yet been published to NPM so you'll have to add a file dependency. Simply clone this repository into a new folder, and add this line to your depdendencies in package.json
```json
"apliko": "file:path/to/Apliko"
```

## Modals
Sending modals in Apliko is just as quick and easy as the rest of its features. To send a modal you use the function InteractionReplyModal as shown below.
```typescript
@ButtonCallback('my_form_button')
public async openMyForm(context: ButtonInteractionContext) {
    await InteractionReplyModal(this.bot, context.interaction, // this.bot contains the REST instance
        ModalInteraction
            .new()
            .id('my_form')
            .title('My Form')
            .components(
                TextField
                    .new()
                    .customId('my_form_field')
                    .title('Field')
                    .placeholder('This is placeholder text!')
                    .style(TextFieldStyle.SHORT))
    );
}
```

Receiving modals makes use of our collector class. Just like collecting message components or messages, all you have to do is pass a key so Apliko can determine if the modal submited was the one your waiting for.
```typescript
//public async openMyForm(context:...
const formResponses = await this.bot.collector.collectForm({
    userId: context.interaction.user.id,
    channelId: context.interaction.channelId,
    modalId: 'my_form'
});
```

## Docs
Coming soon...

## Plans
While Apliko is currently a Discord.js framework, we hope to remove Discord.js from our dependencies in the future so we can implement new Discord API features as soon as they come out, and continue improving the work flow of bot developers.
