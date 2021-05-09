class Transaction{ //Ajout test transac
    constructor(from, to, qty){
        this.from = from;//Sender
        this.to = to;//Receiver
        this.qty = qty;//Qty
    }
}

module.exports = Transaction;