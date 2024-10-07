import mongoose from "mongoose";
import { Db_Name } from "../constants.js";

const conectDb = async () => {
  try {
   
    const conectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${Db_Name}`);
    console.log(`Data Base conected successful ${conectionInstance.connection.host}`);
  } catch (error) {
    console.log(`Data Base conection eror "${error}"`);
  }
};
export default conectDb;
