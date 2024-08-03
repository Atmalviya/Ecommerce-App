import { Schema, model, Document, Types } from 'mongoose';

interface ICart extends Document {
  user: Types.ObjectId;
  products: { product: Types.ObjectId, quantity: number }[];
  shippingAddress: string;
}

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  shippingAddress: { type: String, required: true }
});

const Cart = model<ICart>('Cart', cartSchema);
export default Cart;
