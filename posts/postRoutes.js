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
        if(!post) return res.status(404).json({ message: "The post with the specified ID does not exist." });
        res.status(200).json(post[0]);
    }).catch(err=>{
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
})

router.put("/:id", (req, res)=>{
    const changes = req.body;
    if(!changes.title || !changes.contents){
       return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }

    db.update(req.params.id, changes).then(postsUpdated=>{
        if(postsUpdated === 0){
            return res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
        res.status(200).json({id: req.params.id, ...changes});
    }).catch(err=>{
        res.status(500).json({ error: "The post information could not be modified." });
    })
});

router.delete("/:id", (req, res)=>{
    db.findById(req.params.id).then(post=>{
        const postToBeDeleted = post[0];
        if(!postToBeDeleted) return res.status(404).json({ message: "The post with the specified ID does not exist." });
        db.remove(postToBeDeleted.id).then(itemsDeleted=>{
            res.status(200).json(postToBeDeleted);
        }).catch(err=>{
            res.status(500).json({ error: "The post could not be removed" });
        })
    }).catch(err=>{
        
    })
})

router.get("/:id/comments", (req, res)=>{
    db.findById(req.params.id).then(post=>{
        post = post[0]
        if(!post) return res.status(404).json({ message: "The post with the specified ID does not exist." });
        
        db.findPostComments(post.id).then(comments=>{
            res.status(200).json(comments);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({ error: "The comments information could not be retrieved." });
        })
    }).catch(err=>{
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
})

router.post("/:id/comments", (req, res)=>{
    const comment = req.body;

    if(!comment.text) return res.status(400).json({ errorMessage: "Please provide text for the comment." });

    db.findById(req.params.id).then(post=>{
        post = post[0]
        if(!post) return res.status(404).json({ message: "The post with the specified ID does not exist." });
        
        comment.post_id = post.id;
        db.insertComment(comment).then(commentId=>{
            res.status(201).json({id: commentId.id, ...comment});
        }).catch(err=>{
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the comment to the database"});
        });
    }).catch(err=>{
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
})

module.exports = router;