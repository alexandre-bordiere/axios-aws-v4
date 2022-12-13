import { Credentials, Provider } from '@aws-sdk/types'
import { sign } from 'aws4'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { buildUrl, extractCredentials, stripAxiosHeaders } from './utils'

export interface Options {
  credentials?: Credentials | Provider<Credentials>
  service?: string
}

export function awsSignInterceptor(
  region: string,
  { credentials, service = 'execute-api' }: Options = {}
): (c: AxiosRequestConfig) => Promise<AxiosRequestConfig> {
  return async config => {
    const url = buildUrl(config)
    const resolvedCredentials = await extractCredentials(credentials)

    if (!config.method) {
      throw new Error("HTTP method is needed in the request's config.")
    }

    const signed = sign(
      {
        body: JSON.stringify(config.data || '{}'),
        headers: stripAxiosHeaders(config.headers),
        host: url.host,
        method: config.method.toUpperCase(),
        path: url.pathname + url.search,
        region,
        service,
      },
      resolvedCredentials
    )

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: signed.headers?.Authorization,
        Host: signed.headers?.Host,
        'X-Amz-Date': signed.headers?.['X-Amz-Date'],
        'X-Amz-Security-Token': signed.headers?.['X-Amz-Security-Token'],
      },
    }
  }
}

export function makeSignedRequest<TRequest, TResponse>(
  config: AxiosRequestConfig<TRequest>,
  region: string,
  options?: Options
): Promise<AxiosResponse<TResponse>> {
  const client = axios.create()

  client.interceptors.request.use(awsSignInterceptor(region, options))

  return client.request(config)
}
