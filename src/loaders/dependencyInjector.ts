import { Container } from 'typedi';
import { LoggerInstance } from './logger';
import { IgApiClient } from 'instagram-private-api';

export default () => {
    try {

        const igClient = new IgApiClient();
        Container.set('igClient', igClient);
        Container.set('logger', LoggerInstance);
    }
    catch (e) {

        LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};