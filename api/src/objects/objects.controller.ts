import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectsGateway } from './objects.gateway';

@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly objectsGateway: ObjectsGateway,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createObjectDto: CreateObjectDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/i }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const obj = await this.objectsService.create(createObjectDto, file);
    this.objectsGateway.emitObjectCreated(obj);
    return obj;
  }

  @Get()
  async findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const obj = await this.objectsService.remove(id);
    this.objectsGateway.emitObjectDeleted(id);
    return obj;
  }
}
