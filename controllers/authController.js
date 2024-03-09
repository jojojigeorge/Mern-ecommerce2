import { comparePassword, hashPassword } from "../helpers/bcryptPassword.js"
import userModels from "../models/userModels.js"
import JWT from 'jsonwebtoken'
import orderModel from "../models/orderModel .js"

// fetch all user order
export const userOrderController=async(req,res)=>{
  try {
    const userorder=await orderModel.find({buyer:req.user._id}).populate('buyer',"name").sort({createdAt:-1})
    res.status(200).send({success:true,message:'fetched all user order',userorder})
  } catch (error) {
    res.status(500).send({success:false,message:'fetched all user order',error})
  }
} 

// fetch all  order in admin
export const allOrderController=async(req,res)=>{
  try {
    const allorder=await orderModel.find().populate('buyer',"name").sort({createdAt:-1})
    // res.json(userorder)
    res.status(200).send({success:true,message:'fetched all  order',allorder})
  } catch (error) {
    res.status(500).send({success:false,message:'fetched all  order ',error})
  }
} 

// update order status in admin
export const updateOrderstatusController=async(req,res)=>{
  try {
    const {orderId}=req.params
    const {status}=req.body
    const updatedorder=await orderModel.findByIdAndUpdate(orderId,{status:status},{ new: true })
    res.status(200).send({success:true,message:'successfully updated order status',updatedorder})
  } catch (error) {
    res.status(500).send({success:false,message:'error in updating order status'})
  }
}
const registerController =async(req,res)=>{
  try {
    const {name,email,phone,password,address,question}=req.body
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