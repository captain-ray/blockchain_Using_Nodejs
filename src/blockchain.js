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
        this.blockchain = []
        this.data = []
        this.difficulty = 4
        //     const hash = this.computeHash(0, '0', 1555410312135, 'Hello ray-chain', 1)
        //     console.log(hash)
        // }

    }

    mine() {
        let nonce = 0
        const index = 0
        const data = "Hello ray-chain"
        const prevHash = '0'
        let timestamp = 1555410312135
        let hash = this.computeHash(index, prevHash, timestamp, data, nonce)
        // difficulty = 4 in this context, we want the first 4 digits of the hash should be '0'
        while (hash.slice(0, this.difficulty) != '0'.repeat(this.difficulty)) {
            nonce += 1
            hash = this.computeHash(index, prevHash, timestamp, data, nonce)
        }
        console.log('mine over', {
            index,
            data,
            prevHash,
            timestamp,
            nonce,
            hash
        })
    }

    generateNewBlock() {

    }
    
    //using 'sha256' (Secure Hash Algorithm 256-bit) to generate hash
    computeHash(index, prevHash, timestamp, data, nonce) {
        return crypto
            .createHash('sha256')
            .update(index + prevHash + timestamp + data + nonce)
            .digest('hex')
    }

}

let bc = new Blockchain()
bc.mine()

