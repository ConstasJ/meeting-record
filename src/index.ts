import {Context,Session,Database,Channel,Tables} from 'koishi-core'
import {} from 'koishi-plugin-mysql'

declare module 'koishi-core'{
    interface Channel{
        isMeeting:number
    }
}
interface CQNode {
    type: 'node'
    data: {
      id: number
    } | {
      name: string
      uin: number
      content: string
    }
  }

Channel.extend(()=>({isMeeting:0}))
Database.extend("koishi-plugin-mysql",({tables})=>{
    tables.channel.isMeeting='tinyint'
}
)

let cqnodes:CQNode[]=null

async function record(session:Session,next){
    if(!session.channelId) return next()
    try{
        let isMeeting = (await session.database.getChannel(session.bot.platform,session.channelId)).isMeeting
        if(isMeeting=1){
            if(session.bot.platform=='onebot'){
                let tcqnode:CQNode
                tcqnode.data={id:Number(session.messageId)}
                cqnodes.push(tcqnode)
            }
            else{
                session.send("Don't support other platforms now!")
            }
        }
    }
    catch(e){
        return next()
    }
    return next()
}

export const name='meeting-record'

export let apply=(ctx:Context) =>{
    ctx.on('connect',()=>{
        ctx.middleware(record,true)
        ctx.command('meet')
            // .option('introduce','-i 添加会议介绍')
            // .option('subcon','-sc 添加会议部分总结')
            // .option('conclusion','-c 添加会议总结')
            .channelFields(['isMeeting']as any)
            .action(async ({session})=>{
                let isMeeting = (await ctx.database.getChannel(session.bot.platform,session.channelId)).isMeeting
                isMeeting=1
                return '开始记录！'
            })
            .subcommand('stop')
                .action(async ({session})=>{
                    let isMeeting = (await ctx.database.getChannel(session.bot.platform,session.channelId)).isMeeting
                    isMeeting=0
                    session.send('结束记录！')
                    if(session.bot.platform === 'onebot'){
                        let obidfull = (await session.database.getChannel(session.bot.platform,session.channelId)).id
                        let obid=obidfull.slice(6)
                        //@ts-expect-error
                        session.bot.$sendGroupForwardMsg(obid,cqnodes) as any
                        return
                    }
                })
    })
}