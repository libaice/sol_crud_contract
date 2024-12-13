import {
    Connection,
    Keypair, PublicKey,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import solanaWeb3 from "@solana/web3.js";
import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@project-serum/anchor";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const KEYPAIR_PATH = path.resolve(os.homedir(), '.config/solana/id.json');

const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH)));
const wallet = new anchor.Wallet(Keypair.fromSecretKey(secretKey));
const keypair = Keypair.fromSecretKey(secretKey);
console.log("Wallet public key:", keypair.publicKey.toString());

let connection = new web3.Connection("https://rpc.testnet.soo.network/rpc");


async function getSolBalance(address) {
    let balance = await connection.getBalance(address);
    console.log("Balance:", balance / LAMPORTS_PER_SOL);
}

async function airdrop() {
    const sig = await connection.requestAirdrop(keypair.publicKey, 1000000000);
    await connection.confirmTransaction(sig);
}

async function createSolAddress() {
    const keyPair = solanaWeb3.Keypair.generate();
    console.log("Address:", keyPair.publicKey.toString());
    console.log("Secret key:", keyPair.secretKey);
}

async function getTxList() {
    const txList = await connection.getSignaturesForAddress(keypair.publicKey, {limit: 10});
    console.log("Tx list:", txList);
}




async function sendTx() {
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: "BiBw2QqPihgaDobXcvd7Pb8QpXL3sE5tfv4ubXVuZiZ5",
            lamports: web3.LAMPORTS_PER_SOL / 100,
        })
    );

    const sig = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
    );

    console.log("Tx sig:", sig);
}


async function sendInitializeTx() {
    const initializeTx = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
            fromPubkey: keypair.publicKey,
            newAccountPubkey: keypair.publicKey,
            lamports: web3.LAMPORTS_PER_SOL,
            space: 0,
            programId: new PublicKey("3B6KvMWKicZ62zE8DhViCHEoWMtZhcx4oZZKiRV2tVrd"),
        })
    );

    

}


async function main() {
    const programId = new PublicKey("3B6KvMWKicZ62zE8DhViCHEoWMtZhcx4oZZKiRV2tVrd");

    const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
    });


    try {
        // getSolBalance(keypair.publicKey);

        // createSolAddress() 

        // getTxList();

        sendTx();


    } catch (error) {
        console.error("Error:", error);
    }
}

main();
