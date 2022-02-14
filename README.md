## 💥 Apliko: A TypeScript Discord.js framework

Apliko is a Discord.js framework aimed at ```making the work of professionals easier and faster```. It uses a collection of applications to accomplish common tasks in Discord bots. These include slash commands, channel controllers, questionnaires, and panels. 

## Use Apliko in your project
Apliko has not yet been published to NPM so you'll have to add a file dependency. Simply clone this repository into a new folder, and add this line to your depdendencies in package.json
```json
"apliko": "file:path/to/Apliko"
```

## Docs
Incomplete, but some information can be seen below

## Global Interaction Handlers
Creating a global interaction handler means you'll recieve ```all``` interactionCreate events. It's recommended for components that can exist in multiple places at the same time. To create a global interaction handler, you have to extend the InteractionHandler class and decorate your functions as callbacks.
```typescript
@RegisterCallbacks
export class MyInteractionHandler extends InteractionHandler {
    
    @ButtonCallback('my_button_id')
    public async handleMyButton(context: ButtonInteractionContext) {
        //context.interaction...
    }
    
}
```
You probably noticed that interactions are stored in a context. That's because Apliko enables you to persist data alongside a component id. This makes doing cool things like invite components that never expire and persist across restarts incredibly easy to make.<br/> <br/>This works by using an on-disk nosql database to store the real component id and data along with a uniquely generated string. That string replaces the components id when it's sent to the Discord API so that when a component interaction with that string is receieved, we can retrieve the real component id and attached data to pass along to the corresponding callback.
```typescript
    @ButtonCallback('my_button_id')
    public async handleMyButton(context: ButtonInteractionContext) {
        await context.interaction.reply({
            content: 'Click yes to accept',
            components: ComponentsToDJS(
                ActionRow
                    .new()
                    .components(
                        Button
                            .new()                            
                            .label('Yes')
                            .style(ButtonStyle.SUCCESS)
                            .id(CreateComponentInteractionData({
                                componentId: 'accept_invite',
                                data: [
                                    channelId: context.interaction.channelId
                                ]
                            })))
            )
        })
    }
    
    @ButtonCallback('accept_invite')
    public async handleAcceptInvite(context: ButtonInteractionContext) {
        const channelId = context.data.data[0] // I need to refactor this, I know lol
        // add to channel based on id.....
    }
```

## Modals
Sending modals in Apliko is just as quick and easy as the rest of its features. To send a modal you use the function InteractionReplyModal as shown below.
```typescript
@ButtonCallback('my_form_button')
public async openMyForm(context: ButtonInteractionContext) {
    await InteractionReplyModal(this.bot, context.interaction, // this.bot contains the REST instance
        Modal
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

Recieving modals makes use of our collector class. Just like collecting message components or messages, all you have to do is pass a key so Apliko can determine if the modal submited is the one your waiting for.
```typescript
//public async openMyForm(context:...
const formResponses = await this.bot.collector.collectForm({
    userId: context.interaction.user.id,
    channelId: context.interaction.channelId,
    modalId: 'my_form'
});
```
