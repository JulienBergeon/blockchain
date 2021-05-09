const SHA256 = require('crypto-js/sha256');
class Block{
    constructor(data){
     this.index = 0;
     this.timestamp = "-2209075200000";
     this.data = data;
     this.precedingHash = "0";
     this.hash = this.computeHash()
     this.nonce = 0
    }
    computeHash(){
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    
    ParseBlock(block)
    {
        this.index = block.index
        this.timestamp = block.timestamp
        console.log(this.timestamp, " ", block.timestamp)
        this.data = block.data
        this.precedingHash = block.precedingHash
        this.hash = block.hash
        this.nonce = block.nonce
    }

    proofOfWork(difficulty = 1)
    {
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.computeHash();
        }
    }
}
module.exports = Block