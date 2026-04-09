import React from 'react';
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Provide React globally to fix "React is not defined" errors in tests
globalThis.React = React;

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  localStorage.clear();
});
