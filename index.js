const Slack2 = require("./slack.class")
const Slack = require("./slack.prototype")

const request = async () => {
    const SlackInstance = new Slack()
    const channel = 'testtest'
    const user_name = '정권진'

    const context = []
    const abc = ['a', 'b', 'c', 'd', 'e']
    await SlackInstance.sendText({ channel, user_name, context: abc })
    await SlackInstance.sendTextField({ channel, user_name, context: abc })

    context.push(SlackInstance.toCodeBlock(abc))
    context.push(SlackInstance.toCode('hello'))
    context.push(SlackInstance.toQuotes(abc))
    context.push(SlackInstance.toOrderedList(abc))
    context.push(SlackInstance.toLink({ context: 'byebye', url: 'https://www.youtube.com' }))
    context.push(await SlackInstance.toMention('정권진'))

    await SlackInstance.sendText({ channel, user_name, context })

    const columns = 'a b c d e f g'.split(' ')
    const data = ['1 2 3 4 5 6 7', '7 6 5 4 3 2 1'].map(e => e.split(' '))
    const initial_comment = SlackInstance.toCode("hello world")
    const file_name = 'file name'

    await SlackInstance.sendTsvFile({ channel, user_name, columns, initial_comment, file_name, data })

}
request()

