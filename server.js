var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var hbs = require('hbs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/expressblog'); //database named expressblog

//require Post model
var Post = require('./models/post'); //collection name posts is always plural
//requring user model
var User = require('./models/user');
//requiring newly installed dependecenes for Auth branch
cookieParser = require('cookie-parser');
session = require('express-session');
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;


// middleware for auth
app.use(cookieParser());
app.use(session({
	secret: 'supersecretkey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// passport config - allows users to sign up-login-logout
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(express.static('public'));
app.set('view engine', 'hbs');

//configuring for bodyparser
app.use(bodyParser.urlencoded({
	extended: true
}));



//STATIC ROUTE
app.get('/', function(req, res) {
	res.render('index');
});

//GET ALL POSTS
app.get('/api/posts', function(req, res) {
	console.log("hello");
	// find all posts in db
	//TODO add comments to posts
	Post.find(function(err, allPosts) {
		res.json({
			posts: allPosts
		});
	});

});

//GETTING ONE POST
app.get('/api/posts/:id', function(req, res) {
	//getting post id from URL params  
	var postId = req.params.id;
	//finding post in db by id
	Post.findOne({
		_id: postId
	}, function(err, foundPost) {
		res.json(foundPost);
	});

});


//POSTING A STORY
app.post('/api/posts', function(req, res) {
	var newPost = new Post(req.body);

	// save new todo in db
	newPost.save(function(err, savedPost) {
		res.json(savedPost);
	});
});

//updating post
app.put('/api/posts/:id', function(req, res) {
	var PostId = req.params.id;
	//find post in db by id
	Post.findOne({
		_id: PostId
	}, function(err, foundPost) {
		//updating posts attributes
		foundPost.title = req.body.title;
		foundPost.story = req.body.story;
		//saving updated post in db
		foundPost.save(function(err, savedPost) {
			res.json(savedPost);
		});
	});

});

//deleting post
app.delete('/api/posts/:id', function(req, res) {
	var PostId = req.params.id;
	Post.findOneAndRemove({
		_id: PostId
	}, function(err, deletedPost) {
		res.json(deletedPost);
	});
});

//IMBEDDING
//get comments

app.get('/api/posts/:id/comments', function(req, res) {
	//getting post id from URL params  
	var PostId = req.params.id;
	//finding post in db by id
	Post.findOne({
		_id: PostId
	}, function(err, foundPost) {
		res.json(foundPost);
	});

});

//ADDING IMBEDDED COMMENT ROUTE
app.post('/api/posts/:id/comments', function(req, res) {
	var PostId = req.params.id;
	Post.findOne({
		_id: PostId
	}, function(err, foundPost) {
		//create new comment
		var newComment = new Comment(req.body);

		//saving comment adds it to the comments collection
		newComment.save();
		//give it to foundPost comments
		foundPost.comments.push(newComment);
		//save foundPost with new comment added
		foundPost.save();
		res.json(newComment);


	});
});


//SIGN UP ROUTE
app.get('/signup', function(req, res) {
	res.render('signup');
});


//AUTH -- if user is logged in, dont let them see signup view
app.get('/signup', function(req, res) {

	if (req.user) {
		res.redirect('/profile');
	} else {
		res.render('signup', {
			user: req.user
		});
	}
});

app.post('/signup', function(req, res) {
	User.register(new User({
			username: req.body.username
		}), req.body.password,
		function(err, newUser) {
			passport.authenticate('local')(req, res, function() {
				// res.send('signed up!!!');
				res.redirect('/profile');
			});
		}
	);
});



// ROUTE TO RENDER THE LOGIN VIEW - AUTH ROUTES
app.get('/login', function(req, res) {
	res.render('login');
});
//route to handle logging in existing users
app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/profile');
});

//is user logged in, dont let them see login view
app.get('/login, function', function(req, res) {

	if (req.user) {
		res.redirect('/profile');
	} else {
		res.render('login', {
			user: req.user
		});
	}
});



// log out user
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
//SHOW USER PROFILE PAGE
app.get('/profile', function(req, res) {
	res.render('profile', {
		user: req.user
	});
});

//only show profile is user is logged in
app.get('/profile, function', function(req, res) {

	if (req.user) {
		res.render('/profile', {
			user: req.user
		});
	} else {
		res.redirect('/login');
	}
});



// app.post('/signup', function (req, res) {
//   User.register(new User({ username: req.body.username }), req.body.password,
//     function (err, newUser) {
//       passport.authenticate('local')(req, res, function() {
//         // res.send('signed up!!!');
//         res.redirect('/profile');
//       });
//     }
//   );
// });

// // log in user
// app.post('/login', passport.authenticate('local'), function (req, res) {
//   // res.send('logged in!!!');
//   res.redirect('/profile');
// });



var server = app.listen(process.env.PORT || 3000, function() {
	console.log("WASABII");
});