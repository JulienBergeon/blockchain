const Block = require('./Block')
const Transaction = require("./transaction");

class Blockchain{

    constructor(io){
        this.chain = [this.startGenesisBlock()]
        this.difficulty = 2;
        this.nodes = []//devrait etre stocké, car là on recréé à chaque fois
        this.io = io

        //Ajout test transac
        this.pendingTransactions = [];
        this.miningReward = 0;
        this.balance = 0;
    }

    startGenesisBlock(){
        return new Block("Initial Block in the Chain");
    }

    getLastBlock(){
        return this.chain[this.chain.length -1]
    }

    addNewBlock(newblock){
        newblock.precedingHash = this.getLastBlock().hash
        newblock.index = this.getLastBlock().index + 1
        newblock.timestamp = Date.now()
        newblock.proofOfWork(this.difficulty);
        this.chain.push(newblock);
        this.io.emit('blockmined', this.chain)//chanel blockmined, on lui renvoi toute la chaine
    }

    checkChainValidity()
    {
        console.log("Debut check validity")
        for(let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const precedingBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.computeHash()) return false;
            if(currentBlock.precedingHash !== precedingBlock.hash) return false;
        }
        console.log("Chain valid")
        return true;
    }

    ParseChain(chain)//en gros on recréé un block pour chaque block (on perdait le type de l'objet...)
    {
        this.chain = chain.map(block => {
            let newBlock = new Block(0)
            newBlock.ParseBlock(block)
            console.log(newBlock)
            return newBlock
        })

    }

    addNewNode(node){
        this.nodes.push(node)//Ajout du nouveau noeud
    }
}

module.exports = Blockchain