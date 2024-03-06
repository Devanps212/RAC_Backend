import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    description : {
        type: String,
        default:'',
    },
    isListed : {
        type: Boolean,
        default : true
    }
})

export const categoryModel = mongoose.model("Category", categorySchema)
export type categoryModelType = typeof categoryModel