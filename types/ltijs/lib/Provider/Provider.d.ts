import { Request, Response, Express, NextFunction } from 'express';
import { GradeService } from './Services/GradeService';
import { DeepLinkingService } from './Services/DeepLinking';
import { Database, DatabaseOptions } from '../Utils/Database';
import { NamesAndRolesService } from './Services/NamesAndRoles';
import { PlatformConfig } from './../Utils/Platform';
import { IdToken } from '../IdToken';
import { Platform } from '../Utils/Platform';

export interface ServerAddonFunction {
    (app: Express): void;
}

export interface DeploymentOptions {
    port?: number;
    silent?: boolean;
    serverless?: boolean;
}

export interface CookieOptions {
    secure?: boolean;
    sameSite?: string;
    domain?: string;
}

export interface SSLOptions {
    key: string;
    cert: string;
}

export interface ProviderOptions {
    appRoute?: string;
    loginRoute?: string;
    sessionTimeoutRoute?: string;
    invalidTokenRoute?: string;
    keysetRoute?: string;
    https?: boolean;
    ssl?: SSLOptions;
    staticPath?: string;
    logger?: boolean;
    cors?: boolean;
    serverAddon?: ServerAddonFunction;
    cookies?: CookieOptions;
    tokenMaxAge?: number;
    devMode?: boolean;
}

interface ConnectionCallback {
    (connection: IdToken, request: Request, response: Response, next: NextFunction): Promise<Response | void>;
}

interface ErrorCallback {
    (req: Request, res: Response): Promise<Response | void>;
}

export interface RedirectOptions {
    newResource?: boolean;
    ignoreRoot?: boolean;
}

export class Provider {
    readonly app: Express;

    readonly Database: Database;
    readonly Grade: GradeService;
    readonly DeepLinking: DeepLinkingService;
    readonly NamesAndRoles: NamesAndRolesService;

    static setup(encryptionKey: string, database: DatabaseOptions, options?: ProviderOptions): Provider;

    deploy(options?: DeploymentOptions): Promise<true | undefined>;

    close(): Promise<boolean>;

    onConnect(_connectCallback: ConnectionCallback): true;

    onDeepLinking(_connectCallback: ConnectionCallback): true;

    onInvalidToken(_invalidTokenCallback: ErrorCallback): true;

    onSessionTimeout(_sessionTimeoutCallback: ErrorCallback): true;

    loginRoute(): string;

    appRoute(): string;

    sessionTimeoutRoute(): string;

    invalidTokenRoute(): string;

    keysetRoute(): string;

    whitelist(...urls: Array<string | { route: string; method: string }>): true;

    registerPlatform(config: PlatformConfig): Promise<Platform | false>;

    getPlatform(url: string): Promise<Array<Platform> | false>;

    getPlatform(url: string, clientId: string): Promise<Platform | false>;

    deletePlatform(url: string, clientId: string): Promise<boolean>;

    getAllPlatforms(): Promise<Platform[] | false>;

    redirect(response: Response, path: string, options?: RedirectOptions): void;
}
