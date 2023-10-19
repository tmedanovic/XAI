import MessageResponse from './messageResponse';

export default interface ErrorResponse extends MessageResponse {
  stack?: string;
} 