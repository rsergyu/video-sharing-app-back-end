import express from 'express'
import { addVideo, addView, deleteVideo, getByTag, getVideo, random, search, sub, trend, updateVideo } from '../controllers/video.js'
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

//Create video
router.post("/", verifyToken, addVideo)

//Update video
router.put("/:id", verifyToken, updateVideo)

//Delete video
router.delete("/:id", verifyToken, deleteVideo )
//get video
router.get("/find/:id", getVideo )
//increse video views
router.put("/view/:id", addView)
//get trends
router.get("/trend", trend )
//get random
router.get("/random", random )
//get subscribed channel video
router.get("/sub", verifyToken, sub )
//get video by tags
router.get("/tags", getByTag )
//search
router.get("/search", search )

export default router;