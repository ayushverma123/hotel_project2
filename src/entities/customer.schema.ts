import mongoose, { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
export interface Customer extends Document {
   
   
    firstName: string,
    lastName: string,
    email: string,
    mobileNo: number,
    date_of_birth: Date;
    gender: string,
    password: string;
    name: string;
    HOTEL_NAME: string;
    
}

export const CustomerSchema: Schema = new Schema({

    
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: Number, required: true },
    date_of_birth: { type: Date, required: true},
    gender: { type: String, required: true },
    password: {type: String, required: true},
    name: { type: String, required: true },
    HOTEL_NAME: { type: String, required: true},
});


CustomerSchema.pre<Customer>('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
  
    this.password = hashedPassword;
    next();
  });

export const Customer = mongoose.model<Customer>('Customer', CustomerSchema);