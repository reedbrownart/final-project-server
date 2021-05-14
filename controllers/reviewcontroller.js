const Express = require('express');
const router = Express.Router();
const validateJWT = require('../middleware/validate-session');
const { ArtModel } = require('../models');
const { UserModel } = require('../models');
const { ReviewModel } = require('../models');

////////////////////////////////////////////////////
// THIS IS A TEST
////////////////////////////////////////////////////

router.get('/test', (req, res) => {
    res.send('you have reached the review endpoint');
})

////////////////////////////////////////////////////
// THIS WILL STORE ALL THE DATA FOR AN ART PIECE
////////////////////////////////////////////////////

router.post('/create/:artID', validateJWT, async(req, res) => {
    const userID = req.user.id;
    const { artID } = req.params;

    const { rating, description } = req.body;

    try {
        const newReview = await ReviewModel.create({
            rating,
            description,
            artId: artID,
            userId: userID
        })

        res.status(201).json({
            message: "review posted",
            review: newReview
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to create review. Everyone loves a critic!",
            error: err
        })
    }
})

////////////////////////////////////////////////////
// THIS WILL ALLOW A USER TO UPDATE OR CHANGE AN ART PIECE
// (stretch goal) ALLOW USER TO UPDATE DYNAMICALLY WHILE VIEWING?
////////////////////////////////////////////////////

router.put('/update/:reviewID', async(req, res) => {
    const { rating, description } = req.body;
    let { reviewID } = req.params;

    const query = {
        where: {
            id: reviewID
        }
    };

    const newReview = {
        rating,
        description
    }

    try {
        const update = await ReviewModel.update(newReview, query);
        res.status(200).json(newReview);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

////////////////////////////////////////////////////
// THIS DELETES THE ART PIECE (EASY)
////////////////////////////////////////////////////

router.delete('/delete/:reviewID', validateJWT, async(req, res) => {
    let { reviewID } = req.params;
    let userID = req.user.id;

    console.log(userID);

    const review = await ReviewModel.findOne({
        where: {
            id: reviewID
        }
    })

    if (review.userId === userID) {
        try {
            const query = {
                where: {
                    id: reviewID
                }
            };

            await ReviewModel.destroy(query);
            res.status(200).json({ message: "review deleted" })
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    res.status(200).json({ message: 'you cant censor criticism, nazi!' })
})

////////////////////////////////////////////////////
// THIS ALLOW AN ADMIN TO DELETE AN ART PIECE
////////////////////////////////////////////////////

router.delete('/deleteasadmin/:reviewID', validateJWT, async(req, res) => {
    let { reviewID } = req.params;
    const userID = req.user.id;

    console.log(userID);

    const user = await UserModel.findOne({
        where: {
            id: userID
        }
    })

    if (user.isAdmin) {
        try {
            const query = {
                where: {
                    id: reviewID
                }
            };

            await ReviewModel.destroy(query);
            res.status(200).json({ message: "admin removed review" })
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    res.status(200).json({ message: 'you are not an admin' })
})

////////////////////////////////////////////////////
// THIS GRABS THE DATA AND RETURNS IT FOR CREATING AN ART PIECE ON THE FRONT END
////////////////////////////////////////////////////

router.get('/:reviewID', async(req, res) => {
    const { reviewID } = req.params;

    try {
        const review = await ReviewModel.findOne({
            where: {
                id: reviewID
            }
        })

        res.status(200).json(review);

    } catch (err) {
        res.status(500).json({
            message: "Failed to return review. You might have been cancelled...",
            error: err
        })
    }
})

////////////////////////////////////////////////////
// THIS RETURNS THE 10 MOST RECENT REVIEWS
////////////////////////////////////////////////////

router.get('/tenreviews/:artID', async(req, res) => {
    const { artID } = req.params;

    try {

        const reviews = await ReviewModel.findAll({
            where: { artId: artID },
            limit: 10,
            order: [
                ["createdAt", "DESC"]
            ]
        })

        res.status(200).json({ reviews: reviews })

    } catch (err) {
        res.status(500).json({
            message: "It appears you have just dropped all of your art in a puddle, rendering it worthless.",
            error: err
        })
    }
})

module.exports = router;