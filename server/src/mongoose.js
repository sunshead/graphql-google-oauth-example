const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.promise = global.Promise;

mongoose.connect('mongodb://localhost/graphql-social-auth', {
  useNewUrlParser: true,
});
mongoose.set('debug', true);

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  social: {
    googleProvider: {
      id: String,
      token: String,
    },
  },
});

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  
  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    'secret' // should be in env
  );
};

UserSchema.statics.upsertGoogleUser = async function({
     accessToken,
     refreshToken,
     profile,
   }) {
  const user = await this.findOne({ 'social.googleProvider.id': profile.id });
  
  if (!user) {
    return await User.create({
      name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
      email: profile.emails[0].value,
      'social.googleProvider': {
        id: profile.id,
        token: accessToken,
      },
    });
  }
  return user;
};

mongoose.model('User', UserSchema);