import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
    {
        code : {
            type : String,
            required : true,
        },
        startDate : {
            type : Date ,
            required : true,
        },
        endDate : {
            type : Date,
            required : true,
        },
        discount : {
            type : Number ,
            required : true,
            default : 0,
        },
        user : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
    },
    {
        timestamps : true
    }
);

//Virtuals
//Is coupon expired
CouponSchema.virtual("isExpired").get(function(){
    return this.endDate < Date.now();
});

//Validation to schema 
//User cannot add end date which is before start date
CouponSchema.pre("validate",function(next){
    if(this.endDate < this.startDate){
        next(new Error("End date cannot be before start date"));
    }
    next();
});

//Start date cannot be less than todays date
CouponSchema.pre("validate",function(next){
    if(this.startDate < Date.now()){
        next(new Error("Start date cannot be before today's date"));
    }
    next();
});

//Discount cannot be less than 0 and more than 100
CouponSchema.pre("validate",function(next){
    if(this.discount <= 0 || this.discount > 100){
        next(new Error("Discount should be in between 0 and 100"));
    }
    next();
});


const Coupon = mongoose.model("Coupons",CouponSchema);
export default Coupon;
