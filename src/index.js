const vorpal = require('vorpal')()
const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()

vorpal
    .command('chain', 'display the whole chain')
    .action(function (args, callback) {
        this.log(blockchain.blockchain)
        callback()
    })

vorpal
    .command('mine', 'mining')
    .action(function (args, callback) {
        const newBlock=blockchain.mine()
        if(newBlock){
            console.log(newBlock)
        }
        callback()
    })

console.log('Welcome to ray-chain!')
vorpal.exec('help')

vorpal
    .delimiter('ray-chain$')
    .show()

