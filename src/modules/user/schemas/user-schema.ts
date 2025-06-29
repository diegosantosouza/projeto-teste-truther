import { Document, Schema, model } from 'mongoose';
import { User, UserRole } from '@/modules/user/entities';

function toJSON(this: any): object {
  const user = this.toObject({ getters: true, virtuals: true });
  delete user.__v;
  delete user._id;
  return user;
}

export interface UserInterface extends Document, User {
  id: string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
      default: [UserRole.CLIENT],
      enum: Object.values(UserRole),
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

userSchema.methods.toJSON = toJSON;

userSchema.virtual('id').get(function (this: any) {
  return this._id.toString();
});

export const UserSchema = model<UserInterface>('User', userSchema);
