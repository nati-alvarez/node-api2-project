const express = require("express");
const router = express.Router();

const db = require("../data/db");

router.get("/", (req, res)=>{
    db.find().then(posts=>{
        res.status(200).json(posts);
    }).catch(err=>{
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

router.post("/", (req, res)=>{
    const post = req.body;
    if(!post.title || ! post.contents){
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }

    db.insert(post).then(newPostId=>{
        res.status(201).json({id: newPostId.id, ...req.body});
    }).catch(err=>{
        res.status(500).json({ error: "There was an error while saving the post to the database"});
    });
});

router.get("/:id", (req, res)=>{
    db.findById(req.params.id).then(post=>{
        res.status(200).json(post[0]);
    }).catch(err=>{
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    })
})

module.exports = router;