import {
    Connection,
    Keypair,PublicKey,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
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

connection.getSlot().then(slot => console.log("Current slot:", slot)).catch(err => console.error(err));

async function main() {
    const programId = new PublicKey("3B6KvMWKicZ62zE8DhViCHEoWMtZhcx4oZZKiRV2tVrd");

    const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
    });

    const idl = JSON.parse(fs.readFileSync('../target/idl/crud_contract.json', 'utf8'));
    const program = new anchor.Program(idl, programId, provider);
    try {
        // Call the initialize function
        const tx = await program.methods
            .initialize()
            .rpc();

        console.log("Transaction signature:", tx);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
