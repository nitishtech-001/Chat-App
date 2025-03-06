import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true,
            minlength : 6
        },
        avatar : {
            type : String,
            default : "https://ik.imagekit.io/8x6aqmirh/ai-generated-8361907_640.jpg"
        }
    },
    {
        timestamps : true
    }
);

const User = mongoose.model("User",userSchema);

export default User;