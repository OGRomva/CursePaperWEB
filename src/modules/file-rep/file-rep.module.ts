import { Module } from '@nestjs/common';
import { FileRepController } from './file-rep.controller';
import { FileRepService } from './file-rep.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileRep } from './file-rep.model';

@Module({
    controllers: [FileRepController],
    providers: [FileRepService],
    imports: [SequelizeModule.forFeature([FileRep])],
    exports: [FileRepService],
})
export class FileRepModule {
}
