const Express = require('express');
const router = Express.Router();
const validateJWT = require('../middleware/validate-session');
const { ArtModel } = require('../models');

////////////////////////////////////////////////////
// THIS IS A TEST
////////////////////////////////////////////////////

router.get('/arttest', (req, res) => {
    res.send('you have reached the art endpoint');
})

////////////////////////////////////////////////////
// THIS WILL STORE ALL THE DATA FOR AN ART PIECE
////////////////////////////////////////////////////

router.post('/create', validateJWT, async (req, res) => {
    const userID = req.user.id;
    
    console.log(userID);

    const {title, images, audio} = req.body;

    try {
        const newArt = await ArtModel.create({
            title,
            images,
            audio,
            userId: userID
        })

        res.status(201).json({
            message: "art created!",
            art: newArt
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to create art. Maybe you should try coding!",
            error: err
        })
    }
})

////////////////////////////////////////////////////
// THIS WILL ALLOW A USER TO UPDATE OR CHANGE AN ART PIECE
// (stretch goal) ALLOW USER TO UPDATE DYNAMICALLY WHILE VIEWING?
////////////////////////////////////////////////////

router.put('/update/:artID', async(req, res) => {
    const {title, images, audio} = req.body;
    let { artID } = req.params;

    const query = {
        where: {
            id: artID
        }
    };

    const newArt = {
        title,
        images,
        audio
    }

    try {
        const update = await ArtModel.update(newArt, query);
        res.status(200).json(newArt);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

////////////////////////////////////////////////////
// THIS DELETES THE ART PIECE (EASY)
////////////////////////////////////////////////////

router.delete('/delete/:artID', async (req, res) => {
    let { artID } = req.params;

    try {
        const query = {
            where: {
                id: artID
            }
        };

        await ArtModel.destroy(query);
        res.status(200).json({message: "art destroyed"})
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

////////////////////////////////////////////////////
// THIS GRABS THE DATA AND RETURNS IT FOR CREATING AN ART PIECE ON THE FRONT END
////////////////////////////////////////////////////

router.get('/:artID', async (req, res) => {
    const { artID } = req.params;

    try {
        const art = await ArtModel.findOne({
            where: {
                id: artID
            }
        })

        res.status(200).json(art);

    } catch (err) {
        res.status(500).json({
            message: "Failed to return art. You should probably stay away from galleries and NFTs",
            error: err
        })
    }
})

////////////////////////////////////////////////////
// THIS RETURNS THE TITLES, ARTIST'S NAME, AND LINKS FOR EACH ART PIECE
////////////////////////////////////////////////////

router.get('/', async (req, res) => {
    try {
        // const arts = await ArtModel.findAll();

        // const newestArtIndex = arts.length;
        // const tenArtsAgo = newestArtIndex - 10;

        // const returnArray = [];

        // for (i = tenArtsAgo; i < newestArtIndex; i++) {
        //     returnArray.push(arts[i])
        // }

        const arts = await ArtModel.findAll({
            limit: 10,
            order: [["createdAt", "DESC"]]
        })

        console.log('did we survive the await?');

        res.status(200).json({arts: arts})
        
    } catch (err) {
        res.status(500).json({
            message: "It appears you have just dropped all of your art in a puddle, rendering it worthless.",
            error: err
        })
    }
})

module.exports = router;