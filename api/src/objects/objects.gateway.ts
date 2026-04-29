import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ObjectsGateway {
  private readonly logger = new Logger(ObjectsGateway.name);

  @WebSocketServer()
  server: Server;

  emitObjectCreated(obj: any) {
    this.logger.log(`Emitting object:created event`);
    this.server.emit('object:created', obj);
  }

  emitObjectDeleted(id: string) {
    this.logger.log(`Emitting object:deleted event for id ${id}`);
    this.server.emit('object:deleted', { id });
  }
}
