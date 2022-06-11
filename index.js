const Slack = require("./slack.prototype")

const request=async()=>{
    const SlackInstance=new Slack()
    const channel=await SlackInstance.getChannelID({channel:'testtest'})
    
    const text=[]
    const abc=['a','b','c','d','e']
    text.push(SlackInstance.toCodeBlock(abc))
    text.push(SlackInstance.toCode('씨빨'))
    text.push(SlackInstance.toQuotes(abc))
    text.push(SlackInstance.toOrderedList(abc))
    text.push(SlackInstance.toLink({name:'sibal',url:'https://www.youtube.com'}))
    text.push(await SlackInstance.toMention('정권진'))
    
    await SlackInstance.sendText({channel,text})

    const columns='a b c d e f g'.split(' ')
    const data=['1 2 3 4 5 6 7','7 6 5 4 3 2 1'].map(e=>e.split(' '))
    const initial_comment=SlackInstance.toCode("씨빨씨빨")
    const file_name='jrojsldkfjls'
    
    await SlackInstance.sendFile({channel,columns,initial_comment,file_name,data})

}
request()

