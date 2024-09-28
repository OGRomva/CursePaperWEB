import { forwardRef, HttpException, HttpStatus, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repositories } from './repositories.model';
import { RepCreateDto } from './dto/repCreate.dto';
import { BranchService } from '../branch/branch.service';
import * as fs from 'fs';
import { CommitService } from '../commit/commit.service';
import { zip } from 'zip-a-folder';
import { FileRepService } from '../file-rep/file-rep.service';

@Injectable()
export class RepositoriesService {
    constructor(
        @InjectModel(Repositories)
        private reposRep: typeof Repositories,

        private branchService: BranchService,
        private commitService: CommitService,
        private fileRepService: FileRepService
    ) {
    }

    async create(dto: RepCreateDto, user_id: number) {
        const check = await this.reposRep.findAll({
            where: {
                title: dto.title,
                owner_id: user_id,
            },
        });

        if (check.length != 0) {
            console.log(check);
            throw new HttpException(`The repository with name ${dto.title} is already exist`, 400);
        }

        const repos = await this.reposRep.create({
            title: dto.title,
            owner_id: user_id
        });

        const branch = await this.branchService.createBranch({
            title: 'main',
            repos_id: repos.rep_id,
            isMain: true
        });

        await repos.$set('branches', [branch.branch_id]);

        return await this.reposRep.findByPk(repos.rep_id, { include: { all: true } });
    }

    async findAll(user_id: number) {
        return await this.reposRep.findAll({
            where: {
                owner_id: user_id,
            },
            include: {
                all: true,
            },
        });
    }

    async removeOne(rep_id: number) {
        const repos = await this.reposRep.findByPk(rep_id);
        const path = `./uploads/${repos.owner_id}/${rep_id}`;

        await this.branchService.removeAll(rep_id);

        await fs.rm(path, { recursive: true, force: true }, (err) => {
            if (err) {
                console.log(path);
                throw err;
            }

            console.log(`The directory ${path} was successfully removed`);
        });

        return await this.reposRep.destroy({
            where: {
                rep_id: rep_id,
            },
        });
    }

    async downloadLatest(branch_id: number) {
        const branch = await this.branchService.getBranchById(branch_id);
        const repos = await this.reposRep.findByPk(branch.repos_id);
        const commit = await this.commitService.getLatestCommit(branch_id);
        const path = `./uploads/${commit.creator_id}/${branch.repos_id}/${branch_id}/${commit.commit_id}`
        await zip(path, `./uploads/${commit.creator_id}/${repos.rep_id}/${repos.title}.zip`)

        const file = fs.createReadStream(`./uploads/${commit.creator_id}/${repos.rep_id}/${repos.title}.zip`);

        console.log(`The file ${repos.title}.zip was successfully sent`);
        return new StreamableFile(file, {
            type: 'application/zip',
            disposition: `attachment; filename="${repos.title}.zip"`
        })
    }

    async getFile(file_id: number) {
        const file = await this.fileRepService.getFileById(file_id);
        const expansion = file.fileName.split('.').pop();

        const ReadStream = fs.createReadStream(`${file.filePath}/${file.fileName}`);
        console.log(file.fileName);
        console.log(expansion);
        return new StreamableFile(ReadStream, {
            type: `application/${expansion}`
        });
    }
}
