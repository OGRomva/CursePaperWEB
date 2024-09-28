import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Commit } from './commit.model';
import { FileRepService } from '../file-rep/file-rep.service';
import { BranchService } from '../branch/branch.service';
import { FileRep } from '../file-rep/file-rep.model';
import * as fs from 'fs';
import { CommitCreationOpt } from './types/ICommitCreationOpt';

@Injectable()
export class CommitService {
    constructor(
        @InjectModel(Commit)
        private commitRep: typeof Commit,
        private fileRepService: FileRepService,
        @Inject(forwardRef(() => BranchService))
        private branchService: BranchService,
    ) {
    }

    async createCommit(props: CommitCreationOpt) {
        await this.commitRep.sync({ alter: true });
        const newCommit = await this.commitRep.create(props.dto);
        const rep_id = (await this.branchService.getBranchById(props.dto.branch_id)).repos_id;

        let uploadFiles: FileRep[] = [];

        const filePath = `./uploads/${props.dto.creator_id}/${rep_id}/${newCommit.branch_id}/${newCommit.commit_id}`;

        fs.mkdirSync(filePath, { recursive: true });

        if (props.filesMulter) {
            for (const file of props.filesMulter['file']) {
                fs.writeFile(filePath + `/${file.originalname}`, file.buffer.toString(), {}, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`${file.originalname} was successfully written on path: ${filePath}`);
                });


                const createdFile = await this.fileRepService.createFile({
                    commit_id: newCommit.commit_id,
                    filePath: filePath,
                    fileName: file.originalname,
                });

                uploadFiles.push(createdFile);
            }
        } else if (props.filesBuffer) {
            for (const file of props.filesBuffer) {
                fs.writeFile(`${filePath}/${file.fileName}`, file.buffer.toString(), {}, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`File ${file.fileName} was successfully copied on path ${filePath}`);
                });

                const createdFile = await this.fileRepService.createFile({
                    commit_id: newCommit.commit_id,
                    filePath: filePath,
                    fileName: file.fileName,
                });

                uploadFiles.push(createdFile);
                console.log(uploadFiles);
            }

        }

        return newCommit
    }

    //for deleting a branch
    async removeAll(branch_id: number) {
        const commits = await this.commitRep.findAll({ where: { branch_id: branch_id } });

        const rep_id = (await this.branchService.getBranchById(branch_id)).repos_id;

        for (const commit of commits) {
            await this.fileRepService.removeFilesFromCommit(commit.commit_id);
            fs.rm(`./uploads/${commit.creator_id}/${rep_id}/${branch_id}/${commit.commit_id}`, {
                recursive: true,
                force: true,
            }, (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        return await this.commitRep.destroy({ where: { branch_id: branch_id } });
    }

    async findAll(branch_id: number) {
        return await this.commitRep.findAll({ where: { branch_id: branch_id }, include: { all: true } });
    }

    async getLatestCommit(branch_id: number) {
        return (await this.commitRep.findAll({
            where: {
                branch_id: branch_id
            },
            order: [['commit_id', 'DESC']],
            include: {
                all: true
            }
        }))[0]
    }

    async copyCommitToNewBranch(commit_id: number, branch_id: number) {
        const commit = await this.commitRep.findByPk(commit_id, {include: {all: true}})
        const fileListFromCommit = commit.files
        let files = []

        for (const file of fileListFromCommit) {
            const fileData = fs.readFileSync(`${file.filePath}/${file.fileName}`);
            files.push({
                fileName: file.fileName,
                buffer: fileData
            })
        }

        await this.createCommit({
            dto: {
                message: commit.message,
                creator_id: commit.creator_id,
                branch_id: branch_id
            },
            filesBuffer: files
        })
    }
}
