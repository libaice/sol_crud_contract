import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CrudContract } from "../target/types/crud_contract";
import { Keypair } from '@solana/web3.js'

describe("crud_contract", () => {

  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const payer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.CrudContract as Program<CrudContract>;
  const crudKeypair = Keypair.generate()

  it("Is initialized!", async () => {
    await program.methods.initialize().accounts({
      crud: crudKeypair.publicKey,
      payer: payer.publicKey,
    }).signers([crudKeypair]).rpc();

    // 1. current count
    const currentCount = await program.account.crud.fetch(crudKeypair.publicKey)

    console.log("current count after initialization: ", currentCount);

    // 2. count += 1
    await program.methods.increment().accounts({
      crud: crudKeypair.publicKey,
    }).rpc();

    let newCount = await program.account.crud.fetch(crudKeypair.publicKey)

    console.log("new count after increment: ", newCount);

    // 3. count += 1
    await program.methods.increment().accounts({
      crud: crudKeypair.publicKey,
    }).rpc();

    newCount = await program.account.crud.fetch(crudKeypair.publicKey)

    console.log("new count after increment: ", newCount);


    // 4. count -= 1
    await program.methods.decrement().accounts({
      crud: crudKeypair.publicKey,
    }).rpc();

    newCount = await program.account.crud.fetch(crudKeypair.publicKey)

    console.log("new count after decrement: ", newCount);

    // 5. set count value 
    await program.methods.set(44).accounts({
      crud: crudKeypair.publicKey
    }).rpc();

    newCount = await program.account.crud.fetch(crudKeypair.publicKey)

    console.log("new count after set: ", newCount);

    // 6. close account
    await program.methods.close().accounts({
      payer: payer.publicKey,
      crud: crudKeypair.publicKey
    }).rpc();

    console.log("account closed");

    const userAccount = await program.account.crud.fetchNullable(crudKeypair.publicKey)

    console.log("user account after close: ", userAccount);
  });

});
