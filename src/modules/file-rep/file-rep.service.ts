import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {FileRep} from "./file-rep.model";
import {CreateFileDto} from "./dto/createFile.dto";
import * as fs from 'fs';

@Injectable()
export class FileRepService {
    constructor(
        @InjectModel(FileRep)
        private fileRepository: typeof FileRep
    ) {}

    async createFile(dto: CreateFileDto) {
        return await this.fileRepository.create(dto);
    }

    async getFilesFromCommitId(commit_id: number) {
        return await this.fileRepository.findAll({where: {commit_id: commit_id}})
    }

    //for deleting a commit
    async removeFilesFromCommit(commit_id: number) {
        const files = await this.fileRepository.findAll({where: {commit_id: commit_id}})

        for (const file of files) {
            console.log(file);
            fs.rm(file.filePath, {force: true}, (err) => {
                if (err) {
                    throw err;
                }
            })
        }

        return await this.fileRepository.destroy({where: {commit_id: commit_id}});
    }

}
