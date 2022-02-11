"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJs = require("crypto-js");
class Block {
    constructor(id, hash, previousHash, data, timestamp) {
        this.id = id;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}
Block.calculateBlockHash = (id, previousHash, data, timestamp) => CryptoJs.SHA256(id + previousHash + data + timestamp).toString();
Block.validateStructure = (block) => typeof block.id === 'number' &&
    typeof block.hash === 'string' &&
    typeof block.previousHash === 'string' &&
    typeof block.data === 'string' &&
    typeof block.timestamp === 'number';
const genesisBlock = new Block(0, '20222022#00', '', 'Secret-00', 1);
let blockChain = [genesisBlock];
const getBlockChain = () => blockChain;
const getLastBlock = () => blockChain[blockChain.length - 1];
const getTimestamp = () => Math.round(new Date().getTime() / 1000);
const getHashForBlock = (block) => Block.calculateBlockHash(block.id, block.previousHash, block.data, block.timestamp);
const isBlockValid = (candidateBlock, lastBlock) => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    }
    else if (lastBlock.id + 1 !== candidateBlock.id) {
        return false;
    }
    else if (lastBlock.hash !== candidateBlock.previousHash) {
        return false;
    }
    else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }
    else {
        return true;
    }
};
const addBlock = (candidateBlock) => {
    if (isBlockValid(candidateBlock, getLastBlock())) {
        blockChain.push(candidateBlock);
    }
};
const createNewBlock = (data) => {
    const lastBlock = getLastBlock();
    const newId = lastBlock.id + 1;
    const newPreviousHash = lastBlock.hash;
    const newTimestamp = getTimestamp();
    const newHash = Block.calculateBlockHash(newId, newPreviousHash, data, newTimestamp);
    const newBlock = new Block(newId, newHash, newPreviousHash, data, newTimestamp);
    addBlock(newBlock);
};
createNewBlock('Secret-01');
createNewBlock('Secret-02');
createNewBlock('Secret-03');
createNewBlock('Secret-04');
console.log(getBlockChain());
//# sourceMappingURL=blockChain.js.map