const vorpal = require('vorpal')()
const Table=require('cli-table')
const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()

/* 
data structure will be like
[
    {index:0,data:'hello world'...},
    {index:1,data:'hello NodeJs'...},
]
*/
// format data into table
function formatLog(data){
    if(!Array.isArray(data)){
        data=[data]
    }
    const firstObject=data[0]
    head=Object.keys(firstObject)
    const table=new Table({
        head:head,
        colWidths:new Array(head.length).fill(15)
    })

    //tricky one, but very concise! Important!
    const res=data.map(obj=>{
        return head.map(key=>JSON.stringify(obj[key],null,1))
    })

    // spread operator
    table.push(...res)
    console.log(table.toString())
}

vorpal
    .command('detail <index>','show details of a block')
    .action(function(args,callback){
        const block=blockchain.blockchain[args.index]
        console.log(JSON.stringify(block,null,2))
        callback()
    })



vorpal
    .command('trans <from> <to> <amount>', 'transfer')
    .action(function(args,callback){
        let trans=blockchain.transfer(args.from,args.to,args.amount)
        formatLog(trans)
        callback()
    })


vorpal
    .command('chain', 'display the whole chain')
    .action(function (args, callback) {
        formatLog(blockchain.blockchain)
        callback()
    })

vorpal
    .command('mine', 'mining')
    .action(function (args, callback) {
        const newBlock=blockchain.mine()
        if(newBlock){
            formatLog(newBlock)
        }
        callback()
    })

console.log('Welcome to ray-chain!')
vorpal.exec('help')

vorpal
    .delimiter('ray-chain$')
    .show()

