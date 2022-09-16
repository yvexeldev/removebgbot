const FormData = require("form-data");
const axios = require("axios");
const { Telegraf } = require("telegraf");
const config = require("./config.json");

const bot = new Telegraf(config.BOT_TOKEN);

const removeBg = async function (url) {
    const formData = new FormData();
    formData.append("image_url", url);

    const res = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                "X-Api-Key": config.REMOVE_BG_TOKEN,
            },
            responseType: "arraybuffer",
        }
    );

    return res.data;
};

bot.command("start", (ctx) =>
    ctx.reply(
        `👋 Salom ${ctx.chat.first_name}, ushbu bot orqali siz rasmlaringizni orqa fonini Telegramdan chiqmagan holda kesib olihsingiz mumkin\n\n<a href="https://payme.uz/6244890efe5217f5071b429d">Dasturchini Qo'llab quvvatlash</a>`,
        {
            parse_mode: "HTML",
            disable_web_page_preview: true,
        }
    )
);

bot.on("photo", async (ctx) => {
    const file_id =
        ctx.update.message.photo[ctx.update.message.photo.length - 1].file_id;
    const file_path = (await ctx.telegram.getFile(file_id)).file_path;
    const url = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file_path}`;

    const photo = await removeBg(url);
    ctx.replyWithDocument(
        {
            source: photo,
            filename: "orqa_fonni_kes_bot.png",
        },
        {
            caption: "@orqa_fonni_kes_bot",
        }
    );
});

bot.launch();
