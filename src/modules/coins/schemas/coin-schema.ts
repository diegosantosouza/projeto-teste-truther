import { Document, Schema, model } from 'mongoose';
import { Coin } from '../entities/coins';
import { CoinsNameEnum } from '../entities/coins-name-enum';

function toJSON(this: any): object {
  const coin = this.toObject({ getters: true, virtuals: true });
  delete coin.__v;
  delete coin._id;
  return coin;
}

export interface CoinInterface extends Document, Coin {
  id: string;
}

const coinSchema = new Schema(
  {
    coinId: {
      type: String,
      required: true,
      index: true,
      enum: Object.values(CoinsNameEnum),
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    marketCap: {
      type: Number,
      required: true,
    },
    priceChangePercentage24h: {
      type: Number,
    },
    priceChangePercentage7d: {
      type: Number,
    },
    lowestPrice: {
      type: Number,
    },
    highestPrice: {
      type: Number,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

coinSchema.methods.toJSON = toJSON;

coinSchema.virtual('id').get(function (this: any) {
  return this._id.toString();
});

export const CoinSchema = model<CoinInterface>('Coin', coinSchema);
