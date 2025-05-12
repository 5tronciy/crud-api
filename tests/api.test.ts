import { Server } from 'http';
import { AddressInfo } from 'net';
import { createApp } from '../src/app';

describe('API Tests', () => {
  let server: Server;
  let baseUrl: string;
  let createdUserId: string;

  beforeAll(() => {
    server = createApp(0);
    const address = server.address() as AddressInfo;
    baseUrl = `http://localhost:${address.port}`;
  });

  afterAll(() => {
    server.close();
  });

  const makeRequest = async (method: string, path: string, body?: any) => {
    const port = (server.address() as AddressInfo).port;
    const url = `http://localhost:${port}${path}`;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    };

    try {
      const response = await fetch(url, options);

      const contentLength = response.headers.get('content-length');
      const hasContent = contentLength && parseInt(contentLength) > 0;

      const data = hasContent ? await response.json() : null;

      return {
        statusCode: response.status,
        data
      };
    } catch (error) {
      throw error;
    }
  };

  test('Scenario 1: Full CRUD flow', async () => {
    const getInitialResponse: any = await makeRequest('GET', '/api/users');
    expect(getInitialResponse.statusCode).toBe(200);
    expect(Array.isArray(getInitialResponse.data)).toBe(true);
    expect(getInitialResponse.data.length).toBe(0);

    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['coding', 'reading']
    };
    const createResponse: any = await makeRequest('POST', '/api/users', newUser);
    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.data.username).toBe(newUser.username);
    expect(createResponse.data.age).toBe(newUser.age);
    expect(createResponse.data.hobbies).toEqual(newUser.hobbies);
    expect(typeof createResponse.data.id).toBe('string');

    createdUserId = createResponse.data.id;

    const getUserResponse: any = await makeRequest('GET', `/api/users/${createdUserId}`);
    expect(getUserResponse.statusCode).toBe(200);
    expect(getUserResponse.data.id).toBe(createdUserId);
    expect(getUserResponse.data.username).toBe(newUser.username);

    const updatedUser = {
      username: 'Jane Doe',
      age: 31,
      hobbies: ['coding', 'traveling']
    };
    const updateResponse: any = await makeRequest('PUT', `/api/users/${createdUserId}`, updatedUser);
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.data.id).toBe(createdUserId);
    expect(updateResponse.data.username).toBe(updatedUser.username);
    expect(updateResponse.data.age).toBe(updatedUser.age);
    expect(updateResponse.data.hobbies).toEqual(updatedUser.hobbies);

    const deleteResponse: any = await makeRequest('DELETE', `/api/users/${createdUserId}`);
    expect(deleteResponse.statusCode).toBe(204);

    const getDeletedUserResponse: any = await makeRequest('GET', `/api/users/${createdUserId}`);
    expect(getDeletedUserResponse.statusCode).toBe(404);
  });

  test('Scenario 2: Invalid user ID', async () => {
    const getInvalidResponse: any = await makeRequest('GET', '/api/users/invalid-uuid');
    expect(getInvalidResponse.statusCode).toBe(400);

    const updateData = { username: 'Test User' };
    const updateInvalidResponse: any = await makeRequest('PUT', '/api/users/invalid-uuid', updateData);
    expect(updateInvalidResponse.statusCode).toBe(400);

    const deleteInvalidResponse: any = await makeRequest('DELETE', '/api/users/invalid-uuid');
    expect(deleteInvalidResponse.statusCode).toBe(400);
  });

  test('Scenario 3: Invalid request data', async () => {
    const invalidUser = { username: 'Missing Fields' };
    const createInvalidResponse: any = await makeRequest('POST', '/api/users', invalidUser);
    expect(createInvalidResponse.statusCode).toBe(400);

    const wrongTypeUser = {
      username: 'Wrong Types',
      age: '30',
      hobbies: ['reading']
    };
    const createWrongTypeResponse: any = await makeRequest('POST', '/api/users', wrongTypeUser);
    expect(createWrongTypeResponse.statusCode).toBe(400);
  });
});