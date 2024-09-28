import { CommitCreateDto } from '../dto/commitCreate.dto';
import { FileBuffer } from './IFileBuffer';

export interface CommitCreationOpt {
    dto: CommitCreateDto,
    filesMulter?: Express.Multer.File[],
    filesBuffer?: FileBuffer[]
}