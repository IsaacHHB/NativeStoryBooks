const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')
const Story = require('../models/Story')

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard')
  }
  res.render('login', {
    title: 'Login',
    layout: 'login',
  })
}

exports.postLogin = (req, res, next) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })

  if (validationErrors.length) {
    req.flash('errors', validationErrors)
    return res.redirect('/login')
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      req.flash('errors', info)
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      req.flash('success', { msg: 'Success! You are logged in.' })
      res.redirect(req.session.returnTo || '/dashboard')//this was todos
    })
  })(req, res, next)
}

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect('/')
  })
}

exports.getRegister = (req, res) => {
  if (req.user) {
    return res.redirect('/login')
  }
  res.render('register', {
    title: 'Create Account',
    layout: 'login',
  })
}

exports.getDashboard = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.userName,
      _id: req.user._id,
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
}

exports.postRegister = (req, res, next) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })

  if (validationErrors.length) {
    req.flash('errors', validationErrors)
    return res.redirect('../register')
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    tribalAffiliation: req.body.tribalAffiliation
  })

  User.findOne({
    $or: [
      { email: req.body.email },
      { userName: req.body.userName }
    ]
  }, (err, existingUser) => {
    if (err) { return next(err) }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address or username already exists.' })
      return res.redirect('../register')
    }
    user.save((err) => {
      if (err) { return next(err) }
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        res.redirect('/dashboard')//this was todos
      })
    })
  })
}
// @desc    Show edit page
// @route   GET /edit/:id

exports.getEditProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id
    }).lean()

    if (!user) {
      return res.render('error/404')
    }
    if (user._id != req.user.id) {
      res.redirect('/dashboard')

    } else {
      res.render('profile/edit', {
        user,
        layout: 'login',
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }

}

// @desc    Update story
// @route   PUT /stories/edit/:id

exports.updateProfile = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).lean()

    if (!user) {
      return res.render('error/404')
    }
    if (user._id != req.user.id) {
      res.redirect('/dashboard')
    } else {
      user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
      })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
}