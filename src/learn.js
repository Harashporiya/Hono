import { Hono } from "hono";
import {v4 as uuidv4} from "uuid"
import { stream, streamText, streamSSE } from 'hono/streaming'
let videos = []

const app = new Hono()

app.get('/',(c)=>{
    return c.html("<h1>Welcome to Hono</h1>")
})

app.post("/video", async(c)=>{
 const {videoName, channelName, duration} = await c.req.json()

 const newVideo = {
     id: uuidv4(),
    videoName,
    channelName,
    duration,
 }
 videos.push(newVideo)
 return c.json(newVideo);
})

// Read all (using stream)

app.get("/videos",(c)=>{
    return streamText(c, async(stream)=>{
        for(const video of videos){
            await stream.writeln(JSON.stringify(video))
            await stream.sleep(1000)
        }
    })
})

// Read by Id

app.get("/video/:id",(c)=>{
    const {id} = c.req.param();
    const video = videos.find((video)=> video.id === id)
    if(!video){
        return c.json({message: "Video not found"},404)
    }
    return c.json(video)
})
// Update

app.put("/video/:id", async(c)=>{
    const {id} = c.req.param();
    const index = videos.findIndex((video)=>video.id === id)
    if(index === -1){
        return c.json({message: "Video not found"},404)
    }
    const {videoName, channelName, duration} = await c.req.json()
    videos[index] = {...videos[index], videoName, channelName, duration}

    return c.json(videos[index]);
})

// deleted by id

app.delete("/video/:id", async(c)=>{
    const {id} = c.req.param()

     videos = videos.filter((video)=>video.id !== id)
     return c.json({message:"video deleted"});
})

// All Video deleted

app.delete("/videos", (c)=>{
    videos = []
    return c.json({message:"All videos deleted"})
})


export default app
