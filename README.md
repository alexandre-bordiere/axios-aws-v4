# axios-aws-v4

## Installation

```
npm i @alexandre-bordiere/axios-aws-v4
```

## Usage

### For the default Axios instance

```ts
import axios from 'axios'
import { awsSignInterceptor } from '@alexandre-bordiere/axios-aws-v4'

axios.interceptors.request.use(awsSignInterceptor('ap-southeast-2', { service: 'execute-api' }))

// Moving forward, all requests done with the default Axios instance will be signed.
axios.get('https://example.com')
```

### For a specific Axios instance

```ts
import axios from 'axios'
import { awsSignInterceptor } from '@alexandre-bordiere/axios-aws-v4'

const http = axios.create({ baseURL: 'https://example.com' })

http.interceptors.request.use(awsSignInterceptor('ap-southeast-2'))

// Only this specific Axios instance will make signed requests.
http.get('https://example.com')
```

### Using the `makeSignedRequest` function

If you only need to make a single signed request, you can use the `makeSignedRequest` function. It creates an axios instance with the interceptor attached to it.

```ts
import { makeSignedRequest } from '@alexandre-bordiere/axios-aws-v4'

interface User {
  id: string
  name: string
  email: string
}

async function createUser(): Promise<User> {
  const { data } = makeSignedRequest<Omit<User, 'id'>, User>(
    {
      url: 'https://example.com/users',
      method: 'POST',
      data: {
        name: 'John Doe',
        email: 'john-doe@example.com'
      },
      headers: {
        'Content-Type': 'application/json' // Do not forget to add this header if you are sending JSON data
      }
      // The rest of your axios config...
    },
    'ap-southeast-2',
    { credentials: {} }
  )

  return data;
}
```

## Tests

You can run the tests using the following command:

```
npm test
```
