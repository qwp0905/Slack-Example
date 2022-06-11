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

Slack.prototype.sendTextField = async function ({ channel, text }) {
    const fields = text.map(e => {
        return {
            type: 'mrkdwn',
            text: e
        }
    })
    await this.web.chat.postMessage({
        channel,
        blocks: [{
            type: 'section',
            fields
        }]
    })
}

Slack.prototype.sendText = async function ({ channel, text }) {
    if (Array.isArray(text)) {
        text = text.join('\n')
    }

    await this.web.chat.postMessage({
        channel,
        text
    })
}

Slack.prototype.sendTsvFile = async function ({ channel, file_name, columns, data, initial_comment = '' }) {
    const file = [columns, ...data].map(e => e.join('\t')).join('\n')

    await this.web.files.upload({
        channels: channel,
        filename: file_name,
        initial_comment,
        file: new Buffer.from(file),
        filetype: 'tsv'
    })
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
    return list.reduce((a, c, i) => a + `${i + 1}. ${c}\n`, '')
}

Slack.prototype.toUnorderedList = function (list) {
    return list.reduce((a, c) => a + `- ${c}\n`, '')
}

Slack.prototype.toLink = function ({ name, url }) {
    return `<${url}|${name}>`
}

Slack.prototype.toMention = async function (user_name) {
    const users = await this.web.users.list()
    const user_id = users.members.find((e) => e.real_name === user_name).id
    return `<@${user_id}>`
}
module.exports = Slack