const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignore", "accepted", "rejected","interested"],
            message: `{VALUE} is incorrect status type`

        },
    },
},
{
    timestamps: true,
}
);
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});
connectionRequestSchema.pre('save', async function(next){
    const connectionRequest = this;
    //check if fromuserid and toUserId are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('cannot send connection request to yourself!');
    }
    next();
});
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;