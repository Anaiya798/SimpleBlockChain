import * as CryptoJs from 'crypto-js';

class Block {
    public id: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (
        id: number, 
        previousHash: string,
        data: string, 
        timestamp: number
        ): string => CryptoJs.SHA256(id + previousHash + data + timestamp).toString();

    static validateStructure = (block: Block): boolean => 
        typeof block.id === 'number' && 
        typeof block.hash === 'string' &&
        typeof block.previousHash === 'string' &&
        typeof block.data === 'string' &&
        typeof block.timestamp === 'number';
    
    constructor(id: number, hash: string, previousHash: string, data: string, timestamp: number)  {
        this.id = id;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, '20222022#00', '', 'Secret-00', 1);

let blockChain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockChain;

const getLastBlock = (): Block => blockChain[blockChain.length - 1];

const getTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const getHashForBlock = (block: Block): string => Block.calculateBlockHash(block.id, block.previousHash, block.data, block.timestamp);

const isBlockValid = (candidateBlock: Block, lastBlock: Block): boolean => {
    if(!Block.validateStructure(candidateBlock)) {
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

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLastBlock())){
        blockChain.push(candidateBlock);
    }
}

const createNewBlock = (data: string): void => {
    const lastBlock: Block = getLastBlock();
    const newId: number = lastBlock.id + 1;
    const newPreviousHash: string = lastBlock.hash;
    const newTimestamp: number = getTimestamp();
    const newHash: string = Block.calculateBlockHash(newId, newPreviousHash, data, newTimestamp);
    const newBlock: Block = new Block(newId, newHash, newPreviousHash, data, newTimestamp);
    addBlock(newBlock);

};

createNewBlock('Secret-01');
createNewBlock('Secret-02');
createNewBlock('Secret-03');
createNewBlock('Secret-04');

console.log(getBlockChain());

