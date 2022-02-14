import { REST } from "@discordjs/rest"
import { BitFieldResolvable, Client, ColorResolvable, IntentsString } from "discord.js"
import EventEmitter from "events"
import { ControllerManager, PanelManager, QuestionnaireManager } from "./manager"
import { CollectorManager } from "./manager/CollectorManager"
import { CommandManager } from "./manager/CommandManager"

export let APLIKO_OPTIONS: AplikoBotOptions | undefined = undefined

export class AplikoBot extends EventEmitter {

    private _options: AplikoBotOptions
    private _client: Client
    private _rest: REST
    private _commandManager: CommandManager
    private _panelManager: PanelManager
    private _questionnaireManager: QuestionnaireManager
    private _controllerManager: ControllerManager
    private _collectorManager: CollectorManager

    public constructor(options: AplikoBotOptions) {
        super()
        APLIKO_OPTIONS = options

        this._options = options
        this._client = new Client({ intents: options.intents })
        this._rest = new REST().setToken(this._options.token)
        this._commandManager = new CommandManager(this)
        this._panelManager = new PanelManager(this)
        this._questionnaireManager = new QuestionnaireManager(this)
        this._controllerManager = new ControllerManager(this)
        this._collectorManager = new CollectorManager(this)

        this.client.on('ready', this.onReady.bind(this))
    }

    public async login() {
        this.client.login(this._options.token)
    }

    private async onReady() {
        console.log(`Logged in as ${this.client.user!.username}`)
    }

    public get client(): Client {
        return this._client
    }

    public get rest() {
        return this._rest;
    }

    public get commands(): CommandManager {
        return this._commandManager
    }

    public get panels(): PanelManager {
        return this._panelManager
    }

    public get questionnaires(): QuestionnaireManager {
        return this._questionnaireManager
    }

    public get controllers(): ControllerManager {
        return this._controllerManager
    }

    public get collector(): CollectorManager {
        return this._collectorManager
    }

}

// TODO: Add more options from BaseClient
export interface AplikoBotOptions {
    token: string
    intents: BitFieldResolvable<IntentsString, number>
    apprearance?: {
        embedPrimaryColor?: ColorResolvable
    }
}