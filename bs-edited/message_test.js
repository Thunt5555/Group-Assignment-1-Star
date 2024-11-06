const { sendMessage, showChatMenu } = require('./app.js');

// Mock Firebase dependencies
const auth = {
  currentUser: { email: 'test@test.com' }
};
const db = {}; 
const ref = jest.fn();
const set = jest.fn();
const onChildAdded = jest.fn();

global.auth = auth;
global.db = db;
global.ref = ref;
global.set = set;
global.onChildAdded = onChildAdded;

// Mock DOM manipulation functions
document.getElementById = jest.fn((id) => {
  if (id === "message-input") {
    return { value: '' }; // Mock message input
  }
  if (id === "messages") {
    return { innerHTML: '', scrollIntoView: jest.fn() };
  }
  if (id === "message-form" || id === "chatButton") {
    return { addEventListener: jest.fn() };
  }
  if (id === "chatMenu") {
    return { style: { display: 'none' } };
  }
  return null;
});

describe('sendMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sends message with authenticated user', () => {
    auth.currentUser.email = 'user@example.com';
    document.getElementById('message-input').value = 'Hello, world!';
    
    sendMessage({ preventDefault: jest.fn() });

    expect(ref).toHaveBeenCalledWith(db, expect.stringContaining("messages/"));
    expect(set).toHaveBeenCalledWith(expect.anything(), {
      username: 'test@test.com',
      message: 'Hello, world!'
    });
  });

  test('sends message with guest user', () => {
    auth.currentUser.email = null;
    document.getElementById('message-input').value = 'Hello, world!';
    
    sendMessage({ preventDefault: jest.fn() });

    expect(ref).toHaveBeenCalledWith(db, expect.stringContaining("messages/"));
    expect(set).toHaveBeenCalledWith(expect.anything(), {
      username: 'Guest',
      message: 'Hello, world!'
    });
  });
});

describe('showChatMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays chat menu and shows sent message', () => {
    auth.currentUser.email = 'test@test.com';
    const snapshot = { val: () => ({ username: 'test@test.com', message: 'Hi!' }) };

    onChildAdded.mockImplementation((ref, callback) => callback(snapshot));

    showChatMenu();

    expect(document.getElementById('chatMenu').style.display).toBe('block');
    expect(document.getElementById('messages').innerHTML).toContain('class="sent"');
    expect(document.getElementById('messages').innerHTML).toContain('user@example.com: Hi!');
  });

  test('displays chat menu and shows received message', () => {
    auth.currentUser.email = 'test@test.com';
    const snapshot = { val: () => ({ username: 'test1@test.com', message: 'Hello!' }) };

    onChildAdded.mockImplementation((ref, callback) => callback(snapshot));

    showChatMenu();

    expect(document.getElementById('chatMenu').style.display).toBe('block');
    expect(document.getElementById('messages').innerHTML).toContain('class="receive"');
    expect(document.getElementById('messages').innerHTML).toContain('anotherUser@example.com: Hello!');
  });
});
