const express = require('express')
const router = express.Router()
const storiesController = require('../controllers/stories')
const { ensureAuth } = require('../middleware/auth')


router.get('/add', ensureAuth, storiesController.getAddStories)

router.post('/', ensureAuth, storiesController.postDashboard)

router.get('/', ensureAuth, storiesController.getStories)

// router.get('/map', ensureAuth, storiesController.getMap)

// router.post('/map/add', ensureAuth, storiesController.addStory)

router.get('/:id', ensureAuth, storiesController.getSingleStory)

router.get('/edit/:id', ensureAuth, storiesController.getEditPage)

router.put('/:id', ensureAuth, storiesController.updateStory)

router.delete('/:id', ensureAuth, storiesController.deleteStory)

router.get('/user/:userid', ensureAuth, storiesController.getUserStories)


//MAKE THE MAPS PUBLIC HTML!!!!! <---------------------------<-----------------------<---------------------





module.exports = router