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

  // Endpoint: POST /objects
  // Reçoit le titre, la description ET l'image (multipart/form-data)
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
    // On notifie en temps réel tous les clients qu'un objet a été créé
    this.objectsGateway.emitObjectCreated(obj);
    return obj;
  }

  // Endpoint: GET /objects
  @Get()
  async findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  // Endpoint: DELETE /objects/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const obj = await this.objectsService.remove(id);
    this.objectsGateway.emitObjectDeleted(id);
    return obj;
  }
}
