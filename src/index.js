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
        return head.map(key=>obj[key])
    })

    // spread operator
    table.push(...res)
    console.log(table.toString())
}


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

