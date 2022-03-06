'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.QuestionnaireManager = void 0;
const __1 = require('..');
const __2 = require('..');
class QuestionnaireManager {
    constructor(bot) {
        this._bot = bot;
    }
    async start(interaction, questionnaire) {
        const context = {
            questionnaire,
            revising: false,
            answers: []
        };
        for (let i = 0; i < questionnaire.questions.length; i++) {
            await this.askQuestion(interaction, context, i);
        }
        return context;
    }
    async revise(interaction, context) {
        context.revising = true;
        const message = await interaction.editReply({
            embeds: (0, __2.AplikoBuildEmbeds)({
                fields: context.questionnaire.questions.map((question, index) => {
                    return {
                        title: `(${index + 1}) ${question.question}`,
                        content: context.answers[index]
                    };
                })
            }),
            components: (0, __2.AplikoBuildComponentRows)(
                [
                    {
                        customId: 'questionnaire_revise_edit',
                        label: 'Edit one of your responses',
                        options: context.questionnaire.questions.map((question, index) => {
                            return {
                                title: question.question,
                                value: index.toString()
                            };
                        })
                    }
                ],
                [
                    {
                        customId: 'questionnaire_revise_confirm',
                        style: 'SUCCESS',
                        label: 'Confirm',
                        emoji: '✔️'
                    },
                    {
                        customId: 'questionnaire_revise_cancel',
                        style: 'DANGER',
                        label: 'Cancel',
                        emoji: '🗑'
                    }
                ]
            )
        });
        const value = await Promise.race([
            this.bot.collector.collectSelection({
                guildMemberResolvable: interaction.user.id,
                messageResolvable: message.id,
                componentId: 'questionnaire_revise_edit'
            }),
            this.bot.collector
                .collectButton({
                    guildMemberResolvable: interaction.user.id,
                    messageResolvable: message.id,
                    componentId: 'questionnaire_revise_confirm'
                })
                .then((value) => value),
            this.bot.collector
                .collectButton({
                    guildMemberResolvable: interaction.user.id,
                    messageResolvable: message.id,
                    componentId: 'questionnaire_revise_cancel'
                })
                .then((value) => value)
        ]);
        switch (value) {
            case 'questionnaire_revise_confirm': {
                return context;
            }
            case 'questionnaire_revise_cancel': {
                return Promise.reject();
            }
            default: {
                const selectedIndex = Number(value);
                if (selectedIndex == NaN) return this.revise(interaction, context);
                await this.askQuestion(interaction, context, selectedIndex);
                return this.revise(interaction, context);
            }
        }
    }
    async askQuestion(interaction, context, questionIndex, error) {
        const currentQuestion = context.questionnaire.questions[questionIndex];
        const isSelectQuestion = (0, __1.IsQuestionnaireSelectQuestion)(currentQuestion);
        const embeds = [
            {
                description: currentQuestion.question,
                fields: context.revising
                    ? [
                          {
                              title: 'Current',
                              content: context.answers[questionIndex]
                          }
                      ]
                    : undefined,
                style: currentQuestion.color ? __2.AplikoEmbedStyle.CUSTOM : undefined,
                customStyle: currentQuestion.color
            }
        ];
        if (error)
            embeds.unshift({
                style: __2.AplikoEmbedStyle.ERROR,
                description: error
            });
        const message = await interaction.editReply({
            embeds: (0, __2.AplikoBuildEmbeds)(...embeds),
            components: isSelectQuestion ? (0, __2.AplikoBuildComponentRows)([currentQuestion.selectMenu]) : []
        });
        const value = isSelectQuestion
            ? (
                  await this._bot.collector.collectSelection({
                      guildMemberResolvable: interaction.user.id,
                      messageResolvable: message.id,
                      componentId: currentQuestion.selectMenu.customId
                  })
              )[0]
            : (
                  await this._bot.collector.collectMessage({
                      userResolvable: interaction.user.id,
                      channelResolvable: interaction.channelId
                  })
              ).content;
        if (value.length > currentQuestion.maxResponseLength)
            return this.askQuestion(interaction, context, questionIndex, 'Your response was too long. If you need to write more, consider using a paste website.');
        context.answers[questionIndex] = value;
    }
    export(context) {
        const data = {};
        context.questionnaire.questions.forEach((question, index) => {
            data[question.question] = context.answers[index];
        });
        return data;
    }
    exportTyped(context) {
        const data = {};
        context.questionnaire.questions.forEach((question, index) => {
            if (!question.key) (0, __2.ThrowError)('Question incorrectly configured: missing key property. Report to an administrator.');
            data[question.key] = context.answers[index];
        });
        return data;
    }
    get bot() {
        return this._bot;
    }
}
exports.QuestionnaireManager = QuestionnaireManager;
