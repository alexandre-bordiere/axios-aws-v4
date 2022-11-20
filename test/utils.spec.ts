import { buildUrl, extractCredentials, stripAxiosHeaders } from '../src/utils'

jest.mock('@aws-sdk/credential-provider-node', () => ({
  defaultProvider: jest.fn().mockResolvedValue({
    accessKeyId: 'accessKeyIdDefaultProvider',
    secretAccessKey: 'secretAccessKeyDefaultProvider',
  }),
}))

describe('utils', () => {
  describe('buildUrl', () => {
    it('builds the URL when the given "url" is absolute', () => {
      const { host, pathname, search } = buildUrl({
        url: 'https://example.com/users?id=1',
      })

      expect(host).toBe('example.com')
      expect(pathname).toBe('/users')
      expect(search).toBe('?id=1')
    })

    it('builds the URL when the given "url" is relative with a base URL', () => {
      const { host, pathname, search } = buildUrl({
        baseURL: 'https://example.com',
        url: '/users?id=1',
      })

      expect(host).toBe('example.com')
      expect(pathname).toBe('/users')
      expect(search).toBe('?id=1')
    })

    it('throws an error if the URL is relative and there is no base URL', () => {
      expect(() => buildUrl({ url: 'example.com' })).toThrow('Base URL is needed when using a relative URL.')
    })

    it('throws an error if there is no URL', () => {
      expect(() => buildUrl({})).toThrow("URL is needed in the request's config.")
    })
  })

  describe('extractCredentials', () => {
    it('uses the "defaultProvider" by default', async () => {
      await expect(extractCredentials()).resolves.toStrictEqual({
        accessKeyId: 'accessKeyIdDefaultProvider',
        secretAccessKey: 'secretAccessKeyDefaultProvider',
      })
    })

    it('works when a provider is given', async () => {
      await expect(
        extractCredentials(async () => ({
          accessKeyId: 'accessKeyIdProvider',
          secretAccessKey: 'secretAccessKeyProvider',
        }))
      ).resolves.toStrictEqual({
        accessKeyId: 'accessKeyIdProvider',
        secretAccessKey: 'secretAccessKeyProvider',
      })
    })

    it('works if credentials are given', async () => {
      await expect(
        extractCredentials({
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
        })
      ).resolves.toStrictEqual({
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
      })
    })
  })

  describe('stripAxiosHeaders', () => {
    it('works', () => {
      expect(
        stripAxiosHeaders({
          'Content-Type': 'application/json',
          common: {} as any,
          get: {} as any,
        })
      ).toStrictEqual({ 'Content-Type': 'application/json' })
    })

    it('works without any headers', () => {
      expect(stripAxiosHeaders()).toStrictEqual({})
    })
  })
})
