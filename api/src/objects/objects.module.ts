import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';
import { ObjectItem, ObjectItemSchema } from './schemas/object-item.schema';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ObjectItem.name, schema: ObjectItemSchema },
    ]),
    UploadModule,
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectsGateway],
})
export class ObjectsModule {}
