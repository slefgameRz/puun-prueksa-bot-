const { Command } = require("visa2discord");
const db = require('quick.db')
const { MessageEmbed } = require("discord.js")

module.exports = class AddCommand extends Command {
  constructor(client) {
    super(client, {
      name: "add",
      description: "เพิ่มการตอบกลับ",
      cooldown: 5,
      command: {
        enabled: true, //booleen
        usage: "<command> <reply>",
        category: "tags",
        botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "USE_EXTERNAL_EMOJIS"],
        userPermissions: ["ADMINISTRATOR"],
        minArgsCount: 2,
      },
      slashCommand: {
        enabled: true, //booleen
        userPermissions: ["ADMINISTRATOR"],
        options: [
          {
            name: "command",
            description: "คำที่จะเรียกคำสั่ง", 
            type: "STRING", // USER | STRING | CHANNEL | ROLE | INTEGER
            required: true, //booleen
          },
          {
            name: "reply",
            description: "คำที่จะเกิดขึ้นเมื่อสั่งการ", 
            type: "STRING", // USER | STRING | CHANNEL | ROLE | INTEGER
            required: true, //booleen
          }
        ],
      },
      contextMenu: {
        enabled: false, //booleen
      },
    });
  }


  async messageRun(message, args) {

  let cmd = args[0]
  let reply = args.slice(1).join(" ")

  const old = db.get(`reply_${message.guild.id}_${cmd}`)

  if(old !== null) {
     return sendEmbed(message, `ตอบกลับแบบกำหนดเอง / แท็กมีอยู่แล้ว`, "RED")
  }

db.set(`reply_${message.guild.id}_${cmd}`, reply)
await sendEmbed(message, `เพิ่มคําพูด \`${cmd}\` เเละตอบกลับด้วย \`${reply}\``, "GREEN")
  }

  async interactionRun(interaction, options) {
  let cmd = options.getString("command")
  let reply = options.getString("reply")

  const old = db.get(`reply_${interaction.guild.id}_${cmd}`)

  if(old !== null) {
     return sendFollowUp(interaction, `ตอบกลับแบบกำหนดเอง / แท็กมีอยู่แล้`, "RED")
  }

db.set(`reply_${interaction.guild.id}_${cmd}`, reply)
await sendFollowUp(interaction, `เพิ่มคําพูด \`${cmd}\` เเละตอบกลับด้วย \`${reply}\``, "GREEN")

  }
};

async function sendEmbed(msg, desc, color) {
  const embed = new MessageEmbed()
  .setDescription(desc)
  .setColor(color)

msg.reply({ embeds: [embed] })


}
async function sendFollowUp(int, desc, color) {
  const embed = new MessageEmbed()
  .setDescription(desc)
  .setColor(color)

int.followUp({ embeds: [embed] })


}
