const passport = require("passport");
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const morgan = require("morgan");

const tenantID = "luconsultingb2c.onmicrosoft.com";  // Replace with your tenant ID
const clientID = "f40734c1-5990-47fc-91b5-deceebac0089s";  // Replace with your client ID
const policyName = "B2C_1_SiUpIn"; // Replace with your policy name

const options = {
    identityMetadata: `https://login.microsoftonline.com/${tenantID}/v2.0/.well-known/openid-configuration/`,
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: true,
    loggingLevel: 'info',
    passReqToCallback: false
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    const user = {
        id: token.oid,  // Assuming 'oid' (Object ID) is present in the token
        email: token.emails && token.emails[0],  // Extract the user's email
        name: token.name  // Extract the user's name
    };

    // Pass the user information to the next middleware
    return done(null, user, token);
});

// Initialize Passport and add the Bearer strategy
passport.use(bearerStrategy);

// Function to set up Morgan and initialize Passport
const setupAuth = (app) => {
    app.use(morgan('dev'));
    app.use(passport.initialize());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
};
const ensureAuthenticated = passport.authenticate('oauth-bearer', { session: false });
module.exports = {
    setupAuth,
    passport,
    ensureAuthenticated
};
