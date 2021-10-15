import {Context,Session,Database,Channel,Tables} from 'koishi-core'
import {} from 'koishi-plugin-mysql'

declare module 'koishi-core'{
    interface Channel{
        isMeeting:number
    }
}

Channel.extend(()=>({isMeeting:0}))
Database.extend("koishi-plugin-mysql",({tables})=>{
    tables.channel.isMeeting='tinyint'
}
)

let channels=null

let dbUpdate=async (ctx:Context)=>{
    channels=await ctx.database.getAssignedChannels(['id','isMeeting'])
}

export const name='meeting-record'

export let apply=(ctx:Context) =>{
    ctx.command('meet')
        // .option('introduce','-i 添加会议介绍')
        // .option('subcon','-sc 添加会议部分总结')
        // .option('conclusion','-c 添加会议总结')
        .channelFields(['isMeeting']as any)
        .action(async ({session})=>{
            let {isMeeting} = await ctx.database.getChannel(session.bot.platform,session.channelId)
            isMeeting=1
            dbUpdate(ctx)
            ctx
        }
        )
}