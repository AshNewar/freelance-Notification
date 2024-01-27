import * as connection from '@notifications/queues/connection';
import amqp from 'amqplib';
import { authEmailMessageConsumer, orderEmailMessageConsumer } from '@notifications/queues/email_consumer';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@ashnewar/helper-library');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authEmailMessageConsumer method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0});
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await authEmailMessageConsumer(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('freelance-email-notification', 'direct',{ durable: true });
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'freelance-email-notification', 'auth-email');
    });
  });

  describe('orderEmailMessageConsumer method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0});
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await orderEmailMessageConsumer(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('freelance-order-notification', 'direct',{ durable: true });
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'freelance-order-notification', 'order-email');
    });
  });
});