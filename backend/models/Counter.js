import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },   // e.g. "booking", "notification"
  sequenceValue: { type: Number, default: 0 },
});

// Atomic increment using findOneAndUpdate with $inc
counterSchema.statics.getNextSequence = async function (name) {
  const result = await this.findOneAndUpdate(
    { _id: name },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return result.sequenceValue;
};

const Counter = mongoose.model('Counter', counterSchema);
export default Counter;