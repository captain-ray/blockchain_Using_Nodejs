/**
 * @author Ray Cheng
 * @email ray644302280@gmail.com
 * @create date 2019-04-16 16:27:08
 * @modify date 2019-04-16 16:27:08
 * @desc [description]
 */

const crypto = require('crypto')


// use mine() function to generate a genesis block
const genesisBlock = {
    index: 0,
    data: 'Hello ray-chain',
    prevHash: '0',
    timestamp: 1555410312135,
    nonce: 96830,
    hash: '0000f16aea4d1bcf2428ef5b988b7ffd2697c1d1f89ade5b93892d16a867c0a7'
}

class Blockchain {
    constructor() {
        this.blockchain = [genesisBlock]
        this.data = []
        this.difficulty = 4 //we want the first 4 digits of the hash should be '0'

    }

    getLastBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }


    mine() {
        const newBlock = this.generateNewBlock()
        if (this.isValidBlock(newBlock) && this.isValidChain()) {
            console.log("Success:valid block!")
            this.blockchain.push(newBlock)
        } else {
            console.log("Error:invalid block!")
        }
    }

    // keep computing hash until the first 4 digits of hash are all '0'
    generateNewBlock() {
        let nonce = 0
        const index = this.blockchain.length
        const data = this.data
        const prevHash = this.getLastBlock().hash
        let timestamp = new Date().getTime()
        let hash = this.computeHash(index, prevHash, timestamp, data, nonce)
        // difficulty = 4 in this context, we want the first 4 digits of the hash should be '0'
        while (hash.slice(0, this.difficulty) != '0'.repeat(this.difficulty)) {
            nonce += 1
            hash = this.computeHash(index, prevHash, timestamp, data, nonce)
        }

        return {
            index,
            data,
            prevHash,
            timestamp,
            nonce,
            hash
        }
    }

    

    //using 'sha256' (Secure Hash Algorithm 256-bit) to generate hash
    computeHash(index, prevHash, timestamp, data, nonce) {
        return crypto
            .createHash('sha256')
            .update(index + prevHash + timestamp + data + nonce)
            .digest('hex')
    }

    //using 'sha256' (Secure Hash Algorithm 256-bit) to generate hash
    computeBlockHash({index, prevHash, timestamp, data, nonce}) {
        return crypto
            .createHash('sha256')
            .update(index + prevHash + timestamp + data + nonce)
            .digest('hex')
    }


    //check newly generated block is valid
    isValidBlock(newBlock, lastBlock = this.getLastBlock()) {
        /*
        Check
          1. index == index of last block + 1 
          2. timestamp > timestamp of last block
          3. prevHash ==  hash of last block
          4. comply with difficulty requirement (the first 4 digits should be '0')
          5. hash == recompute the hash of the block
         */

        if (newBlock.index !== lastBlock.index + 1) {
            return false
        } else if (newBlock.timestamp <= lastBlock.timestamp) {
            return false
        } else if (newBlock.prevHash !== lastBlock.hash) {
            return false
        } else if (newBlock.hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
            return false
        }else if(newBlock.hash!==this.computeBlockHash(newBlock)){ //everytime you check the block, should recompute the hash and compare it with the original hash
            return false
        }

        return true
    }

    //check if the newly updated blockchain is valid, avoid being tampered
    isValidChain(chain = this.blockchain) {
        //compare every single block with previous block using isValidBlock() function
        for (let i = chain.length - 1; i >= 1; i--) {
            if(!this.isValidBlock(chain[i],chain[i-1])){
                console.log('Invalid chain!')
                return false
            }
        }

        //simply compare the first block with genesis block
        if(JSON.stringify(chain[0])!==JSON.stringify(genesisBlock)){
            return false
        }
        
        return true
    }

}

let bc = new Blockchain()
bc.mine()
bc.blockchain[1].nonce = 20
bc.mine()
console.log(bc.blockchain)


