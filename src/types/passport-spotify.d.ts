import passport = require('passport')
import express = require('express')

export interface AuthenticateOptions extends passport.AuthenticateOptions {
    authType?: string;
}

export interface StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL: string;

    scopeSeparator?: string;
    enableProof?: boolean;
    profileFields?: string[];
}

export type VerifyCallback = (err?: Error | null, user?: object, info?: object) => void;

export type VerifyFunction =
    (accessToken: string, refreshToken: string, expires_in: object, profile: passport.Profile, done: VerifyCallback) => void;

export class Strategy extends passport.Strategy {    
    constructor(options: StrategyOption, verify: VerifyFunction);

    name: string;
    authenticate(req: express.Request, options?: object): void;
}

