import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { Credentials, Provider } from '@aws-sdk/types'
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import _omit from 'lodash.omit'

export function buildUrl(config: AxiosRequestConfig): URL {
  if (!config.url) {
    throw new Error("URL is needed in the request's config.")
  }

  if (isAbsoluteURL(config.url)) {
    return new URL(config.url)
  }

  if (!config.baseURL) {
    throw new Error('Base URL is needed when using a relative URL.')
  }

  return new URL(combineUrls(config.baseURL, config.url))
}

export async function extractCredentials(
  credentials: Credentials | Provider<Credentials> = defaultProvider()
): Promise<Credentials> {
  if (typeof credentials === 'function') {
    return credentials()
  }

  return credentials
}

export function stripAxiosHeaders(headers: RawAxiosRequestHeaders = {}): Record<string, string> {
  return _omit(headers, ['common', 'delete', 'get', 'head', 'patch', 'post', 'put']) as Record<string, string>
}

function combineUrls(baseUrl: string, relativeUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${relativeUrl.replace(/^\/+/, '')}`
}

function isAbsoluteURL(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}
