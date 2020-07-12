/**
 * Created by les on 6/21/20.
 */

const Telegraf = require('telegraf');

const request = require('./poll_request');
const config = require('./config');
const dbActions = require('./db/actions')

const bot = new Telegraf(process.env.BOT_TOKEN);

async function pollRequest(ctx, index) {
    const {source, question, options, correct_option_id} = request[index];
    await ctx.replyWithPhoto({source}, {disable_notification: true});
    await ctx.replyWithQuiz(question, options, {is_anonymous: false, disable_notification: false, correct_option_id});
}

bot.start( async botCtx => {
  let index = 0;

  await pollRequest(botCtx, index++);

  bot.on('poll_answer', async ctx => {
    await dbActions.chat.save({...ctx.pollAnswer, date: new Date, requestIndex: index});
    await botCtx.reply('Ждем следующего вопроса ...')
    await new Promise(resolve => setTimeout(() => resolve(), config.pollRequestDelay));
    await pollRequest(botCtx, index);
    if (++index === request.length) {
      index = 0;
    }
  });
})

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.launch();
