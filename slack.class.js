require('dotenv').config()

const { WebClient } = require("@slack/web-api")

const token = process.env.SLACK_TOKEN

class Slack2 {
    constructor() {
        this.web = new WebClient(token)
    }

    async getChannelID({ channel }) {
        const list = (await this.web.conversations.list()).channels
        return list.find((e) => e.name === channel).id
    }

    async sendText({ channel, text }) {
        if (Array.isArray(text)) {
            text = text.join('\n')
        }

        await this.web.chat.postMessage({
            channel,
            text
        })
    }

    async sendFile({ channel, file_name, columns, data, initial_comment = '' }) {
        const file = [columns, ...data].map(e => e.join('\t')).join('\n')

        await this.web.files.upload({
            channels: channel,
            filename: file_name,
            initial_comment,
            file: new Buffer.from(file)
        })
    }

    toBold(string) {
        return `*${string}*`
    }

    toItalic(string) {
        return `_${string}_`
    }

    toStrikethrough(string) {
        return `~${string}~`
    }

    toCode(string) {
        return `\`${string}\``
    }

    toQuotes(array) {
        return array.reduce((a, c) => a + `>${c}\n`, '')
    }

    toCodeBlock(array) {
        return `\`\`\`\n${array.reduce((a, c) => a + `${c}\n`, '')}\`\`\``
    }

    toOrderedList(list) {
        return list.reduce((a, c, i) => a + `${i + 1}. ${c}\n`, '')
    }

    toUnorderedList(list) {
        return list.reduce((a, c) => a + `- ${c}\n`, '')
    }

    toLink({ name, url }) {
        return `<${url}|${name}>`
    }

    async toMention(user_name) {
        const users = await this.web.users.list()
        const user_id = users.members.find((e) => e.real_name === user_name).id
        return `<@${user_id}>`
    }
}