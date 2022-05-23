import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema({
    token:{type: String},
    tag:{type: String},
    duration:{type: String},
    plan:{type: String}
})

export default mongoose.model('Tag', tagSchema)