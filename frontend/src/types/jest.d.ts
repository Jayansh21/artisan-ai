/// <reference types="jest" />

declare global {
  function test(name: string, fn: () => void | Promise<void>): void;
  function expect(actual: any): jest.Matchers<any>;
  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;
  function it(name: string, fn: () => void | Promise<void>): void;
}

export {};