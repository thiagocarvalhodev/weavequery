const app = require('../src/index');

test('sayHello returns greeting', () => {
    expect(app.sayHello('Node')).toBe('Hello, Node!');
}); 