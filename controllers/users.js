const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
};

module.exports.register=async (req,res,next)=>{
    try{
    const {username,email,password}=req.body;
    const user= new User({email,username});
    const registerUser =await User.register(user,password);
    req.login(registerUser, function(err) {
        if (err) { return next(err); }
        req.flash('success','Welcome to YelpCamp');
        res.redirect('/campgrounds');
      });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
};

module.exports.userLogin =(req,res)=>{
    req.flash('success','Welcome Back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
};

module.exports.userLogout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};