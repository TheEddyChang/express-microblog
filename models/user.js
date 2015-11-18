//requiring mongoose and passport-local-mongoose
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');
//defining UserSchema
var UserSchema = new Schema({
  username: String,
  password: String
});
//adding passportLocalMongoose - takes care of hashing/salting plain-text password
UserSchema.plugin(passportLocalMongoose);
//creating user model and exporting it
var User = mongoose.model('User', UserSchema);
module.exports = User;