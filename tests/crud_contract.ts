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

    const currentCount = await program.account.crud.fetch(crudKeypair.publicKey)

    console.log("current count after initialization: ", currentCount);

    await program.methods.increment().accounts({
      crud: crudKeypair.publicKey,
    }).rpc();

    const newCount = await program.account.crud.fetch(crudKeypair.publicKey)

    console.log("new count after increment: ", newCount);


  });
});
