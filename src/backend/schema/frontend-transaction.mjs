import mongoose from 'mongoose';
import ScTransactionType from './sc-transaction-state-enum.mjs';

export const frontendTransactionSchema = mongoose.Schema(
  {
    ownerAddress: {
      type: String,
      required: true
    },
    transactionType: {
      type: String,
      enum: Object.values(ScTransactionType),
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    txHash: {
      type: String,
      required: true
    }
  },
  {
    collection: 'frontendTransaction',
    timestamps: true
  }
);

const FrontendTransaction = mongoose.model(
  'FrontendTransaction',
  frontendTransactionSchema,
  'FrontendTransaction'
);
export default FrontendTransaction;
