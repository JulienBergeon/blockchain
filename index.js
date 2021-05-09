const fetch = require('node-fetch')
const socketListener = require('./socketListener')
const express = require('express')
const Block = require('./Block');
const Blockchain = require('./Blockchain');

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
const http = require('http').createServer(app) //Biblio http
const io = require ('socket.io')(http)
const client = require('socket.io-client')

const blockchain = new Blockchain(io);

app.get('/blocks', (req,res) => {
    res.json(blockchain.chain)
})
/* //Ancien post
app.post('/mine', (req,res) => {
    console.log(req.body)
    blockchain.addNewBlock(new Block(req.body))
    res.redirect('/blocks')
})*/

//Nouveau post, pour faire miner à tout le monde en meme temps
app.post('/mine', (req,res) => {
    const {sender, receiver, qty} = req.body
    io.emit('mine', sender, receiver, qty, Date.now())
    res.redirect('/blocks')
})

app.post('/nodes', (req,res) => {
    const {host, port} = req.body //on recupere host et port qu'on passe dans body
    const {callback} = req.query
    const node = `http://${host}:${port}`//adresse du client
    const socketNode = socketListener(client(node), blockchain)//creation du noeud
    blockchain.addNewNode(socketNode)//on ajoute notre noeud

    //Version facile de reciprocité :
    if(callback === 'true'){
        console.info(`Node ${node} added via callback`) //info, log, warn, err en focntion du besoin
        res.json({status: 'Added node', node: node, callback: true})
    }else{
        fetch(`${node}/nodes?callback=true`, {//on aurait pu verifier qu'il existe pas deja (moins efficace quand bcp de noeuds)
            method: 'POST',
            headers: { //toujours un header dans post, donc header generique :
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({host: req.hostname, port: PORT})//En gros, on lui dit qu'on a ajouté, ajoute moi aussi
        })
        console.info(`Node ${node} added via callback`)
        res.json({status: 'Added node', node: node, callback: false})
    }
})

app.get('/nodes', (req,res) => {
    res.json({count: blockchain.nodes.length})
    console.log(blockchain.nodes)
    //SET PORT=3001
})

io.on('connection', (socket) => {
    console.info(`Socket connected ${socket.id}`)
    socket.on('disconnect', () => {
        console.info(`Socket disconnected ${socket.id}`)
    })
})

blockchain.addNewNode(socketListener(client(`http://localhost:${PORT}`), blockchain))

http.listen(PORT, () => {
    console.log('listening on port', PORT)
})

app.get('/transactions', (req,res) => {
    res.json(blockchain.pendingTransactions)
})