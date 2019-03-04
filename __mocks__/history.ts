export const historyMock = {
    push: jest.fn(),
    listen: jest.fn(),
    location: {}
};

export const createMemoryHistory = () => historyMock;
