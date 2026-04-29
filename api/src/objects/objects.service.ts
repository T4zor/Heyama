import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectItem, ObjectItemDocument } from './schemas/object-item.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ObjectsService {
  private readonly logger = new Logger(ObjectsService.name);

  constructor(
    @InjectModel(ObjectItem.name)
    private objectModel: Model<ObjectItemDocument>,
    private uploadService: UploadService,
  ) {}

  async create(
    createObjectDto: CreateObjectDto,
    file: Express.Multer.File,
  ): Promise<ObjectItemDocument> {
    this.logger.log(`Creating object: ${createObjectDto.title}`);

    const { key, url } = await this.uploadService.uploadFile(file);

    const created = new this.objectModel({
      ...createObjectDto,
      imageUrl: url,
      imageKey: key,
    });

    return created.save();
  }

  async findAll(): Promise<ObjectItemDocument[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ObjectItemDocument> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }
    return obj;
  }

  async remove(id: string): Promise<ObjectItemDocument> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }

    // Delete image from S3
    if (obj.imageKey) {
      await this.uploadService.deleteFile(obj.imageKey);
    }

    await this.objectModel.findByIdAndDelete(id).exec();
    this.logger.log(`Deleted object: ${id}`);
    return obj;
  }
}
