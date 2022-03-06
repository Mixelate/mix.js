'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AplikoBot = exports.APLIKO_OPTIONS = void 0;
const rest_1 = require('@discordjs/rest');
const discord_js_1 = require('discord.js');
const events_1 = __importDefault(require('events'));
const _1 = require('.');
const CollectorManager_1 = require('./manager/CollectorManager');
const CommandManager_1 = require('./manager/CommandManager');
exports.APLIKO_OPTIONS = undefined;
class AplikoBot extends events_1.default {
    constructor(options) {
        super();
        exports.APLIKO_OPTIONS = options;
        this._options = options;
        this._client = new discord_js_1.Client({ intents: options.intents });
        this.client.on('ready', this.onReady.bind(this));
        this._rest = new rest_1.REST().setToken(this._options.token);
        this._commandManager = new CommandManager_1.CommandManager(this);
        this._panelManager = new _1.PanelManager(this);
        this._questionnaireManager = new _1.QuestionnaireManager(this);
        this._controllerManager = new _1.ControllerManager(this);
        this._collectorManager = new CollectorManager_1.CollectorManager(this);
        this.client.ws.on('INTERACTION_CREATE', (interaction) => {
            this.emit('interactionCreate', interaction);
        });
    }
    async login() {
        this.client.login(this._options.token);
        this.emit('ready');
    }
    async onReady() {
        console.log(`Logged in as ${this.client.user.username}`);
        this;
    }
    async fetchGuildMember(guildMemberResolvable, guildResolvable) {
        const guilds = (guildResolvable ? [await this.client.guilds.fetch({ guild: guildResolvable })] : (await this.client.guilds.fetch()).map((guild) => guild)).map((guild) =>
            this.client.guilds.resolve(guild.id)
        );
        for (const guild of guilds) {
            const resolvedMember = guild.members.resolve(await guild.members.fetch(guildMemberResolvable));
            if (resolvedMember) return resolvedMember;
        }
        throw `Couldn't resolve guild member.`;
    }
    get options() {
        return this._options;
    }
    get client() {
        return this._client;
    }
    get rest() {
        return this._rest;
    }
    get commands() {
        return this._commandManager;
    }
    get panels() {
        return this._panelManager;
    }
    get questionnaires() {
        return this._questionnaireManager;
    }
    get controllers() {
        return this._controllerManager;
    }
    get collector() {
        return this._collectorManager;
    }
}
exports.AplikoBot = AplikoBot;
