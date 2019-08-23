import mergeConfig from 'axios/lib/core/mergeConfig.js';
import { WITH_BODY_METHODS } from './constants.js';

export const isWithBody = methodName => WITH_BODY_METHODS
  .includes(String(methodName).toLowerCase());

export const mapWithBodyArgsToConfig = (method, [
  url,
  data,
  axiosConfig = {},
]) => ({
  method,
  url,
  data,
  ...axiosConfig,
});

export const mapWithoutBodyArgsToConfig = (method, [
  url,
  axiosConfig = {},
]) => ({
  method,
  url,
  ...axiosConfig,
});

export const createBoundMethod = (
  methodName,
  innerMethods,
  baseConfig
) => {
  const argsMapper = isWithBody(methodName)
    ? mapWithBodyArgsToConfig
    : mapWithoutBodyArgsToConfig;
  const mapArgsToConfig = methodName === 'request'
    ? (name, args) => args
    : argsMapper;

  const boundMethod = (...args) => {
    // get actual method from mutable object
    const originalMethod = innerMethods[methodName];

    return originalMethod(mergeConfig(
      baseConfig,
      mapArgsToConfig(methodName, args)
    ));
  };

  return boundMethod;
};
