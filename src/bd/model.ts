import { Schema, model } from "mongoose";

export interface videoSchema{
    title:string;
    description:string;
    thumbnaiUrl?:string;
    watched:boolean;
    youtuber:string;
}

const FavVideoSchema = new Schema<videoSchema>({
     title:{
        type:String,
        required:true,
     },
     description:{
        type:String,
        required:true,
     },
     thumbnaiUrl:{
        type:String,
        default:"https://via.placeholder.com/1600x900.webp",
        required:false,
     },
     watched:{
        type:Boolean,
        default:false,
        required:true,
     },
     youtuber:{
        type:String,
        required:true,
     },
})

const FavModel = model("FavModel",FavVideoSchema);

export default FavModel;