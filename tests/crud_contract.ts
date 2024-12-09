import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CrudContract } from "../target/types/crud_contract";
import {Keypair} from '@solana/web3.js'

describe("crud_contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env()
  const program = anchor.workspace.CrudContract as Program<CrudContract>;
  const payer = provider.wallet as anchor.Wallet
  const crudKeypair = Keypair.generate()

  it("Is initialized!", async () => {
    await program.methods
    .initialize()
    .accounts({
      crud: crudKeypair.publicKey,
      payer: payer.publicKey,
    })
    .signers([crudKeypair])
    .rpc()

  // const currentCount = await program.account.crud.fetch(crudKeypair.publicKey)

  // expect(currentCount.count).toEqual(0)
  });
});
