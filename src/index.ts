import {Context,Session} from 'koishi-core'

export const name='meeting-record'

function isChannel({session}){
    if(!session.channel){
        return '请在群聊中使用此命令！'
    }
}
export let apply=(ctx:Context) =>{
    ctx.command('meet')
        .check(isChannel)
}