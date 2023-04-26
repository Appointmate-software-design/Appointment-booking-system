// __mocks__/firebaseMock.js
import firebaseMock from 'firebase-mock';

const mockAuth = new firebaseMock.MockAuthentication();
const mockDatabase = new firebaseMock.MockFirebase();

const mockSdk = new firebaseMock.MockFirebaseSdk(
  // Use null for RTDB to prevent unnecessary overhead
  null,
  () => mockAuth,
  () => mockDatabase
);

export default mockSdk;
