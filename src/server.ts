'use strict';

import express from 'express';
import session from 'express-session';
import { errorLogger, logger } from 'express-winston';
import passport from 'passport';
import winston from 'winston';
import { PassportConfig } from './config/passport-config';
import { Home } from './controllers/home';
import { Login } from './controllers/login';
import { Songs } from './controllers/songs';

/**
 * The server.
 *
 * @class Server
 */
export class Server {
  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(port: number): Server {
    return new Server(port);
  }

  public app: express.Application;

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor(port: number) {
    this.app = express();
    this.app.use(express.static('views'));
    this.app.set('port', port);

    // necessary for passport.session
    this.app.use(session({ secret: Math.random().toString(36), resave: true, saveUninitialized: true }));
    new PassportConfig().setup(passport);
    this.app.use(passport.initialize());
    // alters the req object and adds an user object related to the session id of the session id send with the request
    this.app.use(passport.session());

    // mount logger
    this.app.use(logger({
      transports: [
        new winston.transports.Console({}),
      ],
    }));

    // add routes
    this.routes();

    // mount error logger - has to be done after adding the router
    this.app.use(errorLogger({
      transports: [
        new winston.transports.Console({}),
      ],
    }));

    // TODO add errorhandler middleware for 404
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    Home.create(router);
    Login.create(router, passport);
    Songs.create(router);

    // use router middleware
    this.app.use(router);
  }
}
