const Story = require('../models/Story')
const User = require('../models/User')

module.exports = {

    // @desc  Get all stores
    // @route GET /api/v1/stores
    // @access Public

    getMap: async (req, res, next) => {
        try {
            const stories = await Story.find( { status: 'public' } );

            return res.status(200).json({
                success: true,
                count: stories.length,
                data: stories
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },


    // @desc  Create a store
    // @route POST /api/v1/stores
    // @access Public

    addStory: async (req, res, next) => {
        try {
            req.body.user = req.user.id
            console.log(req.body)
            const story = await Story.create(req.body)
            return res.status(201).json({
                success: true,
                data: story
            });
        } catch (err) {
            console.error(err);
            if (err.code === 11000) {
                return res.status(400).json({ error: 'This store already exists' });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }
}