import { comparePassword, hashPassword } from "../helpers/bcryptPassword.js"
import userModels from "../models/userModels.js"
import JWT from 'jsonwebtoken'

const registerController =async(req,res)=>{
  try {
    const {name,email,phone,password,address,question}=req.body
    console.log('inside RegisterController ',name,password,question)
    // validation
    if(!name||!email||!phone||!password||!address){
        return res.send({error:'fill the required field'})
    }
    const existingUser=await userModels.findOne({email:email})
    // exisiting user checking
    if(existingUser){
        return res.status(200).send({
            success:true,
            message:'Alredy registered please login'
        })
    }
    // register new user
    const hashedPassword=await hashPassword(password)
    const user=await new userModels({name,email,phone,address,password:hashedPassword,question}).save()
    res.status(201).send({
        success:true,
        message:'user registered successfully',
        user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error
    });
  }
}
export default registerController 

// update user details
export const updateUserDetailsController =async(req,res)=>{
  try {

    const {name,phone,password,address}=req.body.userdata
    console.log('req.body in update profile',name,phone,password,address)
    let hashedPassword=''
    const existingUser=await userModels.findById(req.user._id)
    if(password&&password.length<6){
      return res.json({error:"password is required and 6 character long"})
    }
    if(password){
      hashedPassword=await hashPassword(password)
    }
    const updateduser=await userModels.findByIdAndUpdate(req.user._id,{
      name:name||existingUser.name,
      phone:phone||existingUser.phone,
      address:address||existingUser.address,
      password:hashedPassword||existingUser.password
    },{
      new:true
    })
    res.status(200).send({
        success:true,
        message:'user updated successfully',
        updateduser
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update user",
      error
    });
  }
}


export const loginController=async(req,res)=>{
  try {
    const {email,password}=req.body
    // console.log(email,password)
    if(!email||!password){
      return res.status(404).send({
        success:false,
        message:'Invalid email or password'

      })
    }
    const user=await userModels.findOne({email})
    if(!user){
      return res.status(404).send({
        success:false,
        message:'email is not registered'
      })
    }
      // console.log(password,user.password)
    const match=await comparePassword(password,user.password)
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "invalid password",
      });
    } else {
      // create token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.status(200).send({
        success: true,
        message: "login success",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role:user.role
        },
        token,
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'error in login',
      error
    })
  }
}

// test controller for testing
export const testController = (req, res) => {
  res.send("protected routes");
};

// forgotpassword controller
export const forgotPasswordController=async(req,res)=>{
  try {
    const {email,newpassword,question}=req.body
    if(!email||!newpassword||!question){
      res.status(404).send({success:false,message:'please complete the field'})
    }
    const user=await userModels.findOne({email,question})
    if(!user){
      res.status(404).send({ success:false,message:'invalid recovery question'})
    }else{
      const hash=await hashPassword(newpassword)
      await userModels.findByIdAndUpdate(user._id,{password:hash})
      res.status(200).send({success:true,message:"password updated",user})
    }
  } catch (error) {
      console.log(error)
      res.status(500).send({success:false,message:'something wrong in forgot password',error})
  }
}