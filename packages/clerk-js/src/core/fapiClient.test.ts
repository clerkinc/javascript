import createFapiClient from './fapiClient';
import type { Clerk } from '@clerk/types';

const fapiClient = createFapiClient({
  frontendApi: 'clerk.example.com',
  version: '42.0.0',
  session: {
    id: 'deadbeef',
  },
} as Clerk);

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve<RecursivePartial<Response>>({
    headers: {
      get: jest.fn(() => 'sess_43'),
    },
    json: () => Promise.resolve({ foo: 42 }),
  }),
);

const oldWindowLocation = window.location;

beforeAll(() => {
  // @ts-ignore
  delete window?.location;

  // @ts-ignore
  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),
      href: {
        configurable: true,
        writable: true,
        value: 'http://test.host',
      },
    },
  );

  window.Clerk = {
    // @ts-ignore
    session: {
      id: 'sess_1qq9oy5GiNHxdR2XWU6gG6mIcBX',
    },
  };
});

beforeEach(() => {
  // @ts-ignore
  global.fetch.mockClear();
});

afterAll(() => {
  window.location = oldWindowLocation;
  delete window.Clerk;
});

describe('buildUrl(options)', () => {
  it('returns the full frontend API URL', () => {
    expect(fapiClient.buildUrl({ path: '/foo' }).href).toBe(
      'https://clerk.example.com/v1/foo?_clerk_js_version=42.0.0',
    );
  });

  it('adds _clerk_session_id as a query parameter if provided and path does not start with client', () => {
    expect(
      fapiClient.buildUrl({ path: '/foo', sessionId: 'sess_42' }).href,
    ).toBe(
      'https://clerk.example.com/v1/foo?_clerk_js_version=42.0.0&_clerk_session_id=sess_42',
    );
    expect(
      fapiClient.buildUrl({ path: '/client/foo', sessionId: 'sess_42' }).href,
    ).toBe('https://clerk.example.com/v1/client/foo?_clerk_js_version=42.0.0');
  });

  const cases = [
    ['PUT', '_method=PUT'],
    ['PATCH', '_method=PATCH'],
    ['DELETE', '_method=DELETE'],
  ];

  it.each(cases)(
    'adds _method as a query parameter when request method is %p',
    (method, result) => {
      expect(fapiClient.buildUrl({ path: '/foo', method }).href).toMatch(
        result,
      );
    },
  );
});

describe('request', () => {
  it('invokes global.fetch', async () => {
    window.location.href = 'http://clerk.example.com';

    await fapiClient.request({
      path: '/foo',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://clerk.example.com/v1/foo?_clerk_js_version=42.0.0&_clerk_session_id=deadbeef',
      expect.objectContaining({
        credentials: 'include',
        method: 'GET',
        path: '/foo',
      }),
    );
  });

  describe('for production instances', () => {
    it.todo(
      'does not append the __dev_session cookie value to the query string',
    );
    it.todo(
      'does not set the __dev_session cookie from the response Clerk-Cookie header',
    );
  });

  describe('for staging or development instances', () => {
    it.todo('appends the __dev_session cookie value to the query string');
    it.todo(
      'sets the __dev_session cookie from the response Clerk-Cookie header',
    );
  });
});
