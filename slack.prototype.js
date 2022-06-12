require('dotenv').config()

const { WebClient } = require("@slack/web-api")

const token = process.env.SLACK_TOKEN_TEST

const Slack = function () {
    this.web = new WebClient(token)
}

Slack.prototype.getChannelID = async function ({ channel }) {
    const list = (await this.web.conversations.list()).channels
    return list.find((e) => e.name === channel).id
}

Slack.prototype.getUserID = async function ({ user_name }) {
    const users = await this.web.users.list()
    return users.members.find((e) => e.real_name === user_name).id
}

Slack.prototype.sendTextField = async function ({ channel, user_name, context }) {
    const fields = context.map(e => {
        return {
            type: 'mrkdwn',
            text: e
        }
    })
    if (channel) {
        const channel_id = await this.getChannelID({ channel })
        await this.web.chat.postMessage({
            channel: channel_id,
            blocks: [{
                type: 'section',
                fields
            }]
        })
    }
    if (user_name) {
        const user_id = await this.getUserID({ user_name })
        await this.web.chat.postMessage({
            channel: user_id,
            blocks: [{
                type: 'section',
                fields
            }]
        })
    }
}

Slack.prototype.sendText = async function ({ channel, user_name, context }) {
    if (Array.isArray(context)) {
        context = context.join('\n')
    }
    if (channel) {
        const channel_id = await this.getChannelID({ channel })
        await this.web.chat.postMessage({
            channel: channel_id,
            text:context
        })
    }
    if (user_name) {
        const user_id = await this.getUserID({ user_name })
        await this.web.chat.postMessage({
            channel: user_id,
            text:context
        })
    }

}

Slack.prototype.sendTsvFile = async function ({ channel, user_name, file_name, columns, data, initial_comment = '' }) {
    const file = [columns, ...data].map(e => e.join('\t')).join('\n')
    if (channel) {
        const channel_id = await this.getChannelID({ channel })
        await this.web.files.upload({
            channels: channel_id,
            filename: file_name,
            initial_comment,
            file: new Buffer.from(file),
            filetype: 'tsv'
        })
    }
    if (user_name) {
        const user_id = await this.getUserID({ user_name })
        await this.web.files.upload({
            channels: user_id,
            filename: file_name,
            initial_comment,
            file: new Buffer.from(file),
            filetype: 'tsv'
        })
    }

}

Slack.prototype.toBold = function (string) {
    return `*${string}*`
}

Slack.prototype.toItalic = function (string) {
    return `_${string}_`
}

Slack.prototype.toStrikethrough = function (string) {
    return `~${string}~`
}

Slack.prototype.toCode = function (string) {
    return `\`${string}\``
}

Slack.prototype.toQuotes = function (array) {
    return array.reduce((a, c) => a + `>${c}\n`, '')
}

Slack.prototype.toCodeBlock = function (array) {
    return `\`\`\`\n${array.reduce((a, c) => a + `${c}\n`, '')}\`\`\``
}

Slack.prototype.toOrderedList = function (list) {
    return list.reduce((a, c, i) => a + `${i + 1}.  ${c}\n`, '')
}

Slack.prototype.toUnorderedList = function (list) {
    return list.reduce((a, c) => a + `-  ${c}\n`, '')
}

Slack.prototype.toLink = function ({ context, url }) {
    return `<${url}|${context}>`
}

Slack.prototype.toMention = async function (user_name) {
    const user_id = await this.getUserID({ user_name })
    return `<@${user_id}>`
}
module.exports = Slack
