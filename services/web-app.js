require("dotenv").config();
let Express = require("express");
let session = require("express-session");

let Seneca = require("seneca");
let Web = require("seneca-web");
let seneca = Seneca();

let ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

let path = require("path");
let bodyparser = require("body-parser");

// Set up seneca for microservices
let senecaWebConfig = {
  context: Express(),
  adapter: require("seneca-web-adapter-express"),
  options: { parseBody: false, includeRequest: true, includeResponse: true },
};

// Tell seneca where othe microservices are located
seneca
  .use(Web, senecaWebConfig)
  .client({ port: "10201", pin: "role:restaurant" })
  .client({ port: "10202", pin: "role:cart" })
  .client({ port: "10203", pin: "role:payment" })
  .client({ port: "10204", pin: "role:order" });

// Set up express
seneca.ready(() => {
  const app = seneca.export("web/context")();

  app.use(Express.static("public"));
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded());

  app.set("views", path.join(__dirname, "../public/views"));
  app.set("view engine", "pug");

  const oktaSettings = {
    clientId: process.env.OKTA_CLIENTID,
    clientSecret: process.env.OKTA_CLIENTSECRET,
    url: process.env.OKTA_URL_BASE,
    appBaseUrl: process.env.OKTA_APP_BASE_URL,
  };

  const oidc = new ExpressOIDC({
    issuer: oktaSettings.url + "/oauth2/default",
    client_id: oktaSettings.clientId,
    client_secret: oktaSettings.clientSecret,
    appBaseUrl: oktaSettings.appBaseUrl,
    scope: "openid profile",
    routes: {
      login: {
        path: "/users/login",
      },
      callback: {
        path: "/authorization-code/callback",
        defaultRedirect: "/",
      },
    },
  });

  app.use(
    session({
      secret:
        "ladhnsfolnjaerovklnoisag093q4jgpijbfimdposjg5904mbgomcpasjdg'pomp;m",
      resave: true,
      saveUninitialized: false,
    })
  );

  app.use(oidc.router);
});
