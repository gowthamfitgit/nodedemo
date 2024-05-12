import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth2';

// model to add if user not exist is db

    passport.use(new GoogleStrategy({
        clientID:    process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: "http://localhost:2002/user/google/callback",
        passReqToCallback   : true
      },
      function(request, accessToken, refreshToken, profile, done) {

        // Note :: save user to db if needed
        return done(null,profile._json);
   
      }
    ));
    
    passport.serializeUser((user,done)=>{
        done(null,user)
    })
    
    passport.deserializeUser((user,done)=>{
        done(null,user)
    })



