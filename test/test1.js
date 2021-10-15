const {mocha, MockedApp} =require('koishi-test-utils')

const {}
const app=new MockedApp()
const session=app.createSession('user',123)

test('printplatform',async ()=>{
    session.shouldHaveResponse('','')
})
