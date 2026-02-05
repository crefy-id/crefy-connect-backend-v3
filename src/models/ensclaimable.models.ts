import { Document, Schema, model } from "mongoose";

interface IENSClaimable extends Document {
  rootName: string; // Reference to the root ENS (e.g., "myplatform.eth")
  subname: string; // e.g., "user123" (part before the root)
  claimedEnsName: string; // Full claimed ENS name (e.g., "user123.myplatform.eth")
  contractAddress: string; // The contract address created by the factory
}

const ENSClaimableSchema = new Schema<IENSClaimable>(
  {
    rootName: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => v.endsWith(".eth"),
        message: "Root name must end with .eth",
      },
    },
    subname: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) =>
          !v.includes(".") && !v.includes(" ") && v.length > 0,
        message: "Subname cannot contain dots, spaces, and must not be empty",
      },
    },
    claimedEnsName: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => v.endsWith(".eth"),
        message: "Claimed ENS name must end with .eth",
      },
    },
    contractAddress: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v),
        message: "Invalid Ethereum address",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index to ensure unique subnames per root
ENSClaimableSchema.index({ rootName: 1, subname: 1 }, { unique: true });

// Index for quick lookup by contract address
ENSClaimableSchema.index({ contractAddress: 1 });

export const ENSClaimable = model<IENSClaimable>(
  "ENSClaimable",
  ENSClaimableSchema
);
