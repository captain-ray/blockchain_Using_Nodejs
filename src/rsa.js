let fs = require('fs')
let EC = require('elliptic').ec
let ec = new EC('secp256k1')
let keypair = ec.genKeyPair()

//using private key to get public key
function getPub(prv){
    return ec.keyFromPrivate(prv).getPublic('hex').toString()
}

/* 
1.check wallet.json file, if exists, read keys from json file and check consistency
2.if doesn't exist wallet.json file, create both public and private key
*/
function generateKeys() {
    const fileName = './ray-wallet.json'
    try {
        let res=JSON.parse(fs.readFileSync(fileName))
        if(res.prv&&res.pub&&getPub(res.prv)===res.pub){
            keypair=ec.keyFromPrivate(res.prv)
            return res
        }else{
            // throw new Error('key in json not valid')
        }
    } catch (error) {
        let res = {
            prv: keypair.getPrivate('hex').toString(),
            pub: keypair.getPublic('hex').toString(),
        }
        fs.writeFileSync(fileName,JSON.stringify(res))
        return res
    }
}


// use transaction+private key to generate signature
function sign({from,to,amount}){
    const bufferMsg=Buffer.from(`${from}-${to}-${amount}`)
    let signature=Buffer.from(keypair.sign(bufferMsg).toDER()).toString('hex')
    return signature
}


// verify using transaction + signature + public key
function verify({from,to,amount,signature},pub){
    const keypairTemp=ec.keyFromPublic(pub,'hex')
    const bufferMsg=Buffer.from(`${from}-${to}-${amount}`)
    return keypairTemp.verify(bufferMsg,signature)
}

let keys=generateKeys()

const trans={from:'Ray',to:'Satoshi',amount:1000}
const trans2={from:'Ray',to:'Satoshi',amount:199}
const signature=sign(trans)
trans.signature=signature
trans2.signature=signature
let isVerified1=verify(trans,keys.pub)
let isVerified2=verify(trans2,keys.pub)
console.log('verify transaction1:',isVerified1)
console.log('verify transaction2:',isVerified2)



