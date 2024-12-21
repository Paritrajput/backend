import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://parit9389669826:idkiz85RjrAnykK7@cluster0.vvtlb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("db successfully connected");
  } catch (err) {
    throw console.error("db connection problem", err);
  }
};
export default connectdb;
