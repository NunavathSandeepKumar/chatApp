const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        pic: {
            type: String,
            default: "https://www.gravatar.com/avatar/?d=mp"
        },
        refreshTokens: [{ type: String }]
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password);
}

userSchema.pre('save',async function(next){
    if(!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password,salt)
})
const User = mongoose.model("User", userSchema)

module.exports = User;
