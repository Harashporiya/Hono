import { Hono } from 'hono'
import { poweredBy } from "hono/powered-by"
import {logger} from "hono/logger"
import dbConnect from './bd/connect'
import FavModel from './bd/model'

const app = new Hono()

//middlewares
app.use(poweredBy())
app.use(logger())

dbConnect()
.then(()=>{
  // Get List
  app.get("/", async(c)=>{
  const documents = await FavModel.find()
  return c.json(documents.map((d)=>d.toObject()),200)
  })
   // Create document
   app.post('/', async(c)=>{
    const formData = await c.req.json();
    if(!formData.thumbnaiUrl) delete formData.thumbnaiUrl

    const favObject = new FavModel(formData)
    try{
      const document = await favObject.save()
      return c.json(document.toObject(), 201)

    }catch(error){
          return c.json(
            (error as any)?.message || "Internal Server Error", 500 
          )
    }

   })
  

   
})
.catch((error)=>{
  app.get("/*",(c)=>{
    return c.text(`Failed to MongoDb Connected ${error.message}`);
  })
})

app.onError((error,c)=>{
   return c.text(`App Error: ${error.message}`)
})

export default app
