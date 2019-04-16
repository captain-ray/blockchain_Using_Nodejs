# 1 Create Blockchain using Nodejs



## 1.1 block structure

A block is composed of 'index', 'data'(transaction), 'previousHash', 'timestamp',  'nonce'(a random seed used for mining), 'currentHash'

```
block structure={
 'index',

 'data'(transaction),

 'previousHash',

 'timestamp', 

 'nonce'(a random seed used for mining),

 'currentHash',
}
```

So, a valid block will be like this:

![4](demo_images/4.png)



## 1.2 compute hash

using 'sha256' (Secure Hash Algorithm 256-bit) to generate hash.

```js
computeHash(index, prevHash, timestamp, data, nonce) {
        return crypto
            .createHash('sha256')
            .update(index + prevHash + timestamp + data + nonce)
            .digest('hex')
    }
```



## 1.3 generate a new block 

to make hash smaller, needs keep computing hash until the first 4 digits of hash are all '0'

```js
generateNewBlock() {
        let nonce = 0
        const index = 0
        const data = "Hello ray-chain"
        const prevHash = '0'
        let timestamp = 1555410312135
        let hash = this.computeHash(index, prevHash, timestamp, data, nonce)
        while (hash.slice(0, 2) != '00') {
            nonce += 1
            hash = this.computeHash(index, prevHash, timestamp, data, nonce)
        }
}
```

In this code snippet, we limit the first two digits should be ‘0’, which needs 397 computations

![1](demo_images/1.png)



To limit the first 3 digits should be ‘0’, the number of computation is 8173

![2](demo_images/2.png)



When increase to 4, the number increase to 96830

![3](demo_images/3.png)

 

## 1.4 genesis block

Using generateNewBlock() function to generate a genesis block (difficulty = 4 in this context, we want the first 4 digits of the hash should be '0')

```js
 generateNewBlock() {
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
```

the detail of genesis block shows below:

![4](demo_images/4.png)



so, we initialize the genesis block

```js
// use generateNewBlock() function to generate a genesis block
const genesisBlock = {
    index: 0,
    data: 'Hello ray-chain',
    prevHash: '0',
    timestamp: 1555410312135,
    nonce: 96830,
    hash: '0000f16aea4d1bcf2428ef5b988b7ffd2697c1d1f89ade5b93892d16a867c0a7'
}
```



## 1.5 check if block is valid

after generate a new block, to check this newly generated block is valid or not

requirements to meet:

1. index = index of last block + 1 

2. timestamp > timestamp of last block

3. prevHash =  hash of last block

4. comply with difficulty requirement (the first 4 digits should be '0')

```js
isValidBlock(newBlock) {
        const lastBlock = this.getLastBlock()
        /*
        Check
          1. index = index of last block + 1 
          2. timestamp > timestamp of last block
          3. prevHash =  hash of last block
          4. comply with difficulty requirement (the first 4 digits should be '0')
         */
        
        if (newBlock.index !== lastBlock.index + 1) {
            return false
        } else if (newBlock.timestamp <= lastBlock.timestamp) {
            return false
        } else if (newBlock.prevHash !== lastBlock.hash) {
            return false
        } else if (newBlock.hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
            return false
        }

        return true
    }
```

![5](demo_images/5.png)

once confirm that the new block is valid, it will be added to the chain

