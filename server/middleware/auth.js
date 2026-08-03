///middleware to check user id and has premium plan

// This is an Express middleware that:

// Checks who the user is

// Checks if the user has a premium plan

// Manages free usage for non - premium users
//add this module 
// Adds info to req so next routes can use it
import { clerkClient } from "@clerk/express";

export const auth = async (req,res,next)=>{
    try{
        const {userId,has}=await req.auth();
        const hasPremiumPlan = await has({ plan: 'premium' });
        const user=await clerkClient.users.getUser(userId)

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage=user.privateMetadata.free_usage;
        }
        else{
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }
        req.plan=hasPremiumPlan ? 'premium':'free';
        next()
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}
