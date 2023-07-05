import type { Auth } from '@website/database';

declare global {
  /// <reference types="lucia-auth" />
  namespace Lucia {
    type Auth = import('./src/index.js').Auth;
    type UserAttributes = Omit<Auth.User, 'id'>;
  }
}
