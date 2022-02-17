## 💥 Apliko: A TypeScript Discord.js framework

Apliko is a Discord.js framework aimed at `making the work of professionals easier and faster`. It uses a collection of applications to accomplish common tasks in Discord bots. These include slash commands, channel controllers, questionnaires, and panels.

## Use Apliko in your project

Apliko has not yet been published to NPM so you'll have to add a file dependency. Simply clone this repository into a new folder, and add this line to your depdendencies in package.json

```json
"apliko": "file:path/to/Apliko"
```

## Todo: 
- Finish rewriting interactions so you can send responses using class members instead of global util functions
- Compare commands to existing commands so they don't edit if none are needed, removing the 'this command is outdated' error
- Clean up codebase, looks like 7 people coming from 7 different backgrounds have been working on this lma

## Getting Started

Here's some code to get your simple bot up and running

```typescript
import { AplikoBot } from 'apliko';

const bot = new AplikoBot(
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    token: '<YOUR_BOT_TOKEN>'
);

bot.client.on('ready', async () => {
    // Do something
});

bot.login();
```

Simple enough, right? Well you may find yourself in a situation where you'd like to add some properties in the AplikoBot class since it gets passed as a parameter to all other Apliko classes like: a connection to a database, a websocket connection, or maybe a payment gateway. While there's many ways to go about adding these properties I recommend using basic class inheritance to mix your properties into existing Apliko classes. Here's an example of a slash command using my own AplikoBot class.

```typescript
export class InheritBot extends AplikoBot {

    private _database: Database;

    public constructor() {
        super(
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_VOICE_STATES,
            ],
            token: 'YOUR_BOT_TOKEN'
        );

        this._database = new Database();
        this.commands.registerCommands(new MySlashCommand(this));
    }

    public get database() {
        return this._database;
    }

}

export class InheritSlashCommand extends SlashCommand {

    private _myBot: InheritBot;

    constructor(myBot: InheritBot) {
        super(myBot); // Pass myBot to the SlashCommand constructor since it extends AplikoBot
        this._myBot = myBot; // Store myBot in a separate variable so we save the types
    }

    // Override the getter for AplikoBot to return InheritBot instead
    override get bot(): MyBot {
        return this._myBot
    }

}

@DefineCommand
@NameCommand('rnchannel')
@DescribeCommand('Rename a channel')
export class MySlashCommand extends InheritSlashCommand {

    // channel and newName command options are automatically detected, more on that later ;)
    @CommandExecutor
    public async execute(interaction: CommandInteraction, channel: TextChannel, newName: string) {
        // Rename the channel...
    }

}
```

## Global Interaction Handlers

Creating a global interaction handler means you'll recieve `all` interactionCreate events. It's recommended for components that can exist in multiple places at the same time. To create a global interaction handler, you have to extend the InteractionHandler class and decorate your functions as callbacks.

```typescript
@RegisterCallbacks
export class MyInteractionHandler extends InteractionHandler {
  @ButtonCallback("my_button_id")
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
  modalId: "my_form",
});
```
