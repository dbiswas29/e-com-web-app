import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  // Virtual fields for relations
  cart?: Types.ObjectId;
  orders?: Types.ObjectId[];
  reviews?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual fields
UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Never return password in JSON
    return ret;
  },
});
