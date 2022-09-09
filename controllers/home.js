module.exports = {
    getIndex: (req, res) => {
        res.render('login.hbs', {
            title: 'Login',
            layout: 'login',
        })
    }
}