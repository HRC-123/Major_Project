import mongoose from "mongoose";

const deptSchema = new mongoose.Schema({
    branch:{
        type: String,
        required:true
    }
})

export const departments = mongoose.model("departments", deptSchema);