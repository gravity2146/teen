import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import { LoggerInstance } from './logger';

export default async ({ expressApp }) => {

    // It returns the agenda instance because it's needed in the subsequent loaders
    await dependencyInjectorLoader();
    LoggerInstance.info('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp });
    LoggerInstance.info('✌️ Express loaded');
};