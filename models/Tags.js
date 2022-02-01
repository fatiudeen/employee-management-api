import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema({
    token:{type: String}
})

export default mongoose.model('Tag', tagSchema)