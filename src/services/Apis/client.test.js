const mockRequestUse = jest.fn();
const mockResponseUse = jest.fn();
const mockApiInstance = jest.fn();
mockApiInstance.interceptors = { request: { use: mockRequestUse }, response: { use: mockResponseUse } };
const mockRefreshInstance = { post: jest.fn() };

jest.mock('axios', () => ({
  create: jest.fn()
    .mockReturnValueOnce(mockApiInstance)
    .mockReturnValueOnce(mockRefreshInstance),
}));

const clientModule = require('./client');

afterEach(() => {
  mockRefreshInstance.post.mockReset();
});

test('concurrent callers share one refresh request', async () => {
  mockRefreshInstance.post.mockResolvedValue({ data: { data: { accessToken: 'new-token' } } });
  const [first, second] = await Promise.all([clientModule.refreshAccessToken(), clientModule.refreshAccessToken()]);
  expect(mockRefreshInstance.post).toHaveBeenCalledTimes(1);
  expect(first.accessToken).toBe('new-token');
  expect(second.accessToken).toBe('new-token');
});

test('failed refresh reports session expiry and does not retry a retried request', async () => {
  const expired = jest.fn();
  clientModule.setSessionExpiredHandler(expired);
  mockRefreshInstance.post.mockRejectedValue(new Error('expired'));
  const responseErrorHandler = clientModule.handleResponseError;
  const original = { response: { status: 401 }, config: { url: '/analytics', headers: {} } };
  await expect(responseErrorHandler(original)).rejects.toBe(original);
  expect(expired).toHaveBeenCalledTimes(1);
  await expect(responseErrorHandler({ response: { status: 401 }, config: { url: '/analytics', __authRetried: true } })).rejects.toBeDefined();
  expect(mockRefreshInstance.post).toHaveBeenCalledTimes(1);
});
