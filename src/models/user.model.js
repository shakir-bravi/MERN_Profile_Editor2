import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema( 
    {
        name:{
            type: String,
            trim:true,
            lowercase: true ,
        },
        username:{
            type: String,
            trim:true,
            lowercase: true ,
        },
        cast:{
            type: String,
            trim:true,
            lowercase: true ,
        },
        fullname:{
            type: String,
            trim:true,
            lowercase: true ,
        },
        avatar:{
            type:String
        },
        coverImage :{
            type:String
        },
        watchHistory :[
            {
                type:String
            }
        ],
        refreshToken:{
            type:String
        },
        email:{
            type: String,
            trim:true,
            loweercase: true ,
        },
        password:{
            type:String
        },
        confirmPassword:{
            type:String
        }

        // name , username , cast ,   
        // fullname = name + cast
        // email , avatar  , coverImage ,
        //  watchHistory , password , 
        // confirmPasswords , refreshToken 


     }
     ,{timestamps:true}) ;

     //  Model Save hone se pehle ~ .pre("save") fullname k andar name aur cast lagane hai
     //  Model Save hone se pehle ~ .pre("save") Password ko hash karna hai 

     userSchema.pre("save" , async function (next) {
        if(!( this.isModified("password") || this.isModified("confirmPassword"))) next() ; 

        this.password = await  bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword  , 10)
        next()


        
     })
userSchema.pre("save" , async function (next) {
    if(this.name && this.cast){
        this.fullname = `${this.name}_${this.cast}`
        next()
    }
    next()
    
})

    // create a compare mehtod
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.isConfirmPasswordCorrect = async function (confirmPassword) {
    return await bcrypt.compare(confirmPassword , this.confirmPassword)
    
}
    // create a access token generator and refreshtoken

userSchema.methods.generateAccessToken = function () {
return   jwt.sign( 
    {
        _id : this._id,
        email : this.email,
        fullname :this.fullname
    },
process.env.ACCESS_TOKEN_SECRET 
     ,
      {
        expiresIn :process.env.ACCESS_TOKEN_EXPIRY
      }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign( {
        _id  : this._id
    },

    process.env.REFRESH_TOKEN_SECRET  ,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
    }
)
    
}
export const User = mongoose.model("User" , userSchema)