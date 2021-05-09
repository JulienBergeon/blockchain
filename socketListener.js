const Block = require ('./Block')
const Blockchain = require('./Blockchain')

const socketListener = (socket, blockchain) => {
  socket.on('mine', (sender, receiver, qty) => {
    let block = new Block({sender, receiver, qty})
    blockchain.addNewBlock(block)
    console.info(`Block number ${block.index} just mined`)
  })

  socket.on('blockmined', (newChain) => {
    console.info(`Entrer dans second listener`)
    let blockchainparse = new Blockchain(null)
    blockchainparse.ParseChain(newChain)
    console.log(socket," ",blockchainparse)
    if ((blockchainparse.chain.length > blockchain.chain.length)) //&& (blockchainparse.checkChainValidity()))
    {
      blockchain.chain = blockchainparse.chain
      console.info(`Blockchain synchronized ok1`)
    }else{//Si meme taille la premiere ?
      if ((blockchainparse.chain.length === blockchain.chain.length) && (blockchainparse.chain[blockchainparse.chain.length - 1].timestamp < blockchain.chain[blockchain.chain.length - 1].timestamp)) //&& (blockchainparse.checkChainValidity()))
      {
        blockchain.chain = blockchainparse.chain
        console.info(`Blockchain synchronized ok2`)
      }
      console.info(`Blockchain ko`)
    }
    /*
    console.info(`Blockchain synchronized ko`)
    console.log("blockchainparse.length ", blockchainparse.length)
    console.log("blockchain.chain.length ", blockchain.chain.length)
    console.log("blockchainparse[blockchainparse.length - 1].timestamp ", blockchainparse[blockchainparse.length - 1].timestamp)
    console.log("blockchain.chain[blockchain.chain.length - 1].timestamp ", blockchain.chain[blockchain.chain.length - 1].timestamp)
    */
  })

  return socket
}

module.exports = socketListener

//Tests pas très fructueux
/*const SocketActions = require('./constants');

const Transaction = require('./models/transaction');
const Blockchain = require('./models/chain');

const socketListeners = (socket, chain) => {
  socket.on(SocketActions.ADD_TRANSACTION, (sender, receiver, amount) => {
    const transaction = new Transaction(sender, receiver, amount);
    chain.newTransaction(transaction);
    console.info(`Added transaction: ${JSON.stringify(transaction.getDetails(), null, '\t')}`);
  });

  socket.on(SocketActions.END_MINING, (newChain) => {
    console.log('End Mining encountered');
    process.env.BREAK = true;
    const blockChain = new Blockchain();
    blockChain.parseChain(newChain);
    if (blockChain.checkValidity() && blockChain.getLength() >= chain.getLength()) {
      chain.blocks = blockChain.blocks;
    }
  });

  return socket;
};

module.exports = socketListeners;*/