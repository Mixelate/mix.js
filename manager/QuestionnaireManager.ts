import { AplikoBot } from "../Bot";
import {
  IsQuestionnaireSelectQuestion,
  Questionnaire,
  QuestionnaireContext,
} from "../struct/apliko/questionnaire";
import {
  AplikoBuildComponentRows,
  AplikoBuildEmbeds,
  AplikoDropdown,
  AplikoDropdownOption,
  AplikoEmbed,
  AplikoEmbedField,
  AplikoEmbedStyle,
  AplikoInteractButton,
  RepliableInteraction,
  ThrowError,
} from "../util";

export class QuestionnaireManager {
  private _bot: AplikoBot;

  constructor(bot: AplikoBot) {
    this._bot = bot;
  }

  public async start(
    interaction: RepliableInteraction,
    questionnaire: Questionnaire
  ): Promise<QuestionnaireContext> {
    const context = {
      questionnaire,
      revising: false,
      answers: [],
    };

    for (let i = 0; i < questionnaire.questions.length; i++) {
      await this.askQuestion(interaction, context, i);
    }

    return context;
  }

  public async revise(
    interaction: RepliableInteraction,
    context: QuestionnaireContext
  ): Promise<QuestionnaireContext> {
    context.revising = true;

    const message = await interaction.editReply({
      embeds: AplikoBuildEmbeds({
        fields: context.questionnaire.questions.map((question, index) => {
          return <AplikoEmbedField>{
            title: `(${index + 1}) ${question.question}`,
            content: context.answers[index],
          };
        }),
      }),
      components: AplikoBuildComponentRows(
        [
          <AplikoDropdown>{
            customId: "questionnaire_revise_edit",
            label: "Edit one of your responses",
            options: context.questionnaire.questions.map((question, index) => {
              return <AplikoDropdownOption>{
                title: question.question,
                value: index.toString(),
              };
            }),
          },
        ],
        [
          <AplikoInteractButton>{
            customId: "questionnaire_revise_confirm",
            style: "SUCCESS",
            label: "Confirm",
            emoji: "✔️",
          },
          <AplikoInteractButton>{
            customId: "questionnaire_revise_cancel",
            style: "DANGER",
            label: "Cancel",
            emoji: "🗑",
          },
        ]
      ),
    });

    const value = await Promise.race([
      this.bot.collector.collectSelection({
        guildMemberResolvable: interaction.user.id,
        messageResolvable: message.id,
        componentId: "questionnaire_revise_edit",
      }),
      this.bot.collector
        .collectButton({
          guildMemberResolvable: interaction.user.id,
          messageResolvable: message.id,
          componentId: "questionnaire_revise_confirm",
        })
        .then((value) => value),
      this.bot.collector
        .collectButton({
          guildMemberResolvable: interaction.user.id,
          messageResolvable: message.id,
          componentId: "questionnaire_revise_cancel",
        })
        .then((value) => value),
    ]);

    switch (value) {
      case "questionnaire_revise_confirm": {
        return context;
      }

      case "questionnaire_revise_cancel": {
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

  public async askQuestion(
    interaction: RepliableInteraction,
    context: QuestionnaireContext,
    questionIndex: number,
    error?: string
  ) {
    const currentQuestion = context.questionnaire.questions[questionIndex];
    const isSelectQuestion = IsQuestionnaireSelectQuestion(currentQuestion);

    const embeds: AplikoEmbed[] = [
      {
        description: currentQuestion.question,
        fields: context.revising
          ? [
              {
                title: "Current",
                content: context.answers[questionIndex],
              },
            ]
          : undefined,
        style: currentQuestion.color ? AplikoEmbedStyle.CUSTOM : undefined,
        customStyle: currentQuestion.color,
      },
    ];

    if (error)
      embeds.unshift({
        style: AplikoEmbedStyle.ERROR,
        description: error,
      });

    const message = await interaction.editReply({
      embeds: AplikoBuildEmbeds(...embeds),
      components: isSelectQuestion
        ? AplikoBuildComponentRows([currentQuestion.selectMenu])
        : [],
    });

    const value = isSelectQuestion
      ? (
          await this._bot.collector.collectSelection({
            guildMemberResolvable: interaction.user.id,
            messageResolvable: message.id,
            componentId: currentQuestion.selectMenu.customId,
          })
        )[0]
      : (
          await this._bot.collector.collectMessage({
            userResolvable: interaction.user.id,
            channelResolvable: interaction.channelId,
          })
        ).content;

    if (value.length > currentQuestion.maxResponseLength)
      return this.askQuestion(
        interaction,
        context,
        questionIndex,
        "Your response was too long. If you need to write more, consider using a paste website."
      );

    context.answers[questionIndex] = value;
  }

  public export(context: QuestionnaireContext): any {
    const data = {};

    context.questionnaire.questions.forEach((question, index) => {
      data[question.question] = context.answers[index];
    });

    return data;
  }

  public exportTyped<T>(context: QuestionnaireContext): any {
    const data: any = {};

    context.questionnaire.questions.forEach((question, index) => {
      if (!question.key)
        ThrowError(
          "Question incorrectly configured: missing key property. Report to an administrator."
          );

      data[question.key] = context.answers[index];
    });

    return data as T;
  }
  
  get bot() {
    return this._bot;
  }

}