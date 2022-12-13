/* eslint-disable no-undefined */

import { awsSignInterceptor } from '../src'

describe('awsSignInterceptor', () => {
  it("signs the request and keep the request's config", async () => {
    const config = await awsSignInterceptor('ap-southeast-2', {
      credentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
      },
    })({
      url: 'https://example.com/users',
      method: 'POST',
      data: {
        name: 'John Doe',
        email: 'john-doe@example.com',
      },
      headers: { 'Content-Type': 'application/json' },
    })

    expect(config).toStrictEqual(
      expect.objectContaining({
        url: 'https://example.com/users',
        method: 'POST',
        data: {
          name: 'John Doe',
          email: 'john-doe@example.com',
        },
        headers: {
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
          Host: 'example.com',
          'X-Amz-Date': expect.any(String),
          'X-Amz-Security-Token': undefined,
        },
      })
    )
  })

  it('throws an error if no method is provided', async () => {
    await expect(
      awsSignInterceptor('ap-southeast-2', {
        credentials: {
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
        },
      })({ url: 'https://example.com' })
    ).rejects.toThrow("HTTP method is needed in the request's config.")
  })
})
