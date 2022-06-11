const { WebClient } = require("@slack/web-api")
require('dotenv').config()

const token=process.env.SLACK_TOKEN

const Slack=function(){
    this.web=new WebClient(token)
}

Slack.prototype.getChannelID=async function({channel}){
    const list=(await this.web.conversations.list()).channels
    return list.find((e)=>e.name===channel).id
}

Slack.prototype.sendText=async function({channel,text}){
    if(Array.isArray(text)){
        text=text.join('\n')
    }

    await this.web.chat.postMessage({
        channel,
        text
    })
}

Slack.prototype.sendFile=async function({channel,file_name,columns,data,initial_comment=''}){
    const file=[columns,...data].map(e=>e.join('\t')).join('\n')

    await this.web.files.upload({
        channels:channel,
        filename:file_name,
        initial_comment,
        file:new Buffer.from(file)
    })
}

Slack.prototype.toBold=function(string){
    return `*${string}*`
}

Slack.prototype.toItalic=function(string){
    return `_${string}_`
}

Slack.prototype.toStrikethrough=function(string){
    return `~${string}~`
}

Slack.prototype.toCode=function(string){
    return `\`${string}\``
}

Slack.prototype.toQuotes=function(array){
    return array.reduce((a,c)=>a+`>${c}\n`,'')
}

Slack.prototype.toCodeBlock=function(array){
    return `\`\`\`\n${array.reduce((a,c)=>a+`${c}\n`,'')}\`\`\``
}

Slack.prototype.toOrderedList=function(list){
    return list.reduce((a,c,i)=>a+`${i+1}. ${c}\n`,'')
}

Slack.prototype.toUnorderedList=function(list){
    return list.reduce((a,c)=>a+`- ${c}\n`,'')
}

Slack.prototype.toLink=function({name,url}){
    return `<${url}|${name}>`
}

Slack.prototype.toMention=async function(user_name){
    const users=await this.web.users.list()
    const user_id=users.members.find((e)=>e.real_name===user_name).id
    return `<@${user_id}>`
}
module.exports=Slack