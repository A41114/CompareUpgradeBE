if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require("passport-google-oauth20").Strategy;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));
} else {
  console.log("⚠️ Google OAuth chưa cấu hình → bỏ qua");
}