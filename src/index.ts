import {Context,Session} from 'koishi-core'

export const name='meeting-record'

export let apply=(ctx:Context) =>{
    ctx.command('meet')
        // .option('introduce','-i 添加会议介绍')
        // .option('subcon','-sc 添加会议部分总结')
        // .option('conclusion','-c 添加会议总结')
        .action(({session,options})=>{
            let id=session?.channel
        }
        )
}