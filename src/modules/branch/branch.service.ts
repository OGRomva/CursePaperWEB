import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch } from './branch.model';
import { BranchCreateDto } from './dto/branchCreate.dto';
import { CommitService } from '../commit/commit.service';
import * as fs from 'fs';

@Injectable()
export class BranchService {
    constructor(
        @InjectModel(Branch)
        private branchRep: typeof Branch,
        @Inject(forwardRef(() => CommitService))
        private commitService: CommitService,
    ) {
    }

    async createBranch(dto: BranchCreateDto) {
        await this.branchRep.sync({alter: true})
        if (dto.isMaster) {
            return await this.branchRep.create(dto);
        } else {
            const masterBranch = (await this.findAll(dto.repos_id)).find(branch => branch.isMaster == true)

            const branch = await this.branchRep.create(dto)
            const commit = await this.commitService.getLatestCommit(masterBranch.branch_id);
            await this.commitService.copyCommitToNewBranch(commit.commit_id, branch.branch_id)
            return branch;
        }
    }

    async findAll(rep_id: number) {
        return await this.branchRep.findAll({ where: { repos_id: rep_id }});
    }

    //for deleting a repository
    async removeAll(repos_id: number) {
        const branches = await this.branchRep.findAll({ where: { repos_id: repos_id } });

        for (const branch of branches) {
            await this.commitService.removeAll(branch.branch_id);
        }

        return await this.branchRep.destroy({ where: { repos_id: repos_id } });
    }

    async removeByBranchId(branch_id: number, user_id: number) {
        const br = await this.branchRep.findByPk(branch_id);
        await this.commitService.removeAll(branch_id);
        fs.rm(`./uploads/${user_id}/${br.repos_id}/${branch_id}`, {force: true, recursive: true}, (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
        })
        return await this.branchRep.destroy({ where: { branch_id: branch_id } });
    }

    async getBranchById(branch_id: number) {
        return await this.branchRep.findByPk(branch_id);
    }

    async mergeBranches(branchFromMergeId: number, branchToMergeId: number, shouldDelete: boolean, message: string) {
        const branchFromMerge = await this.branchRep.findByPk(branchFromMergeId)

        if (branchFromMerge.isMaster) {
            throw new HttpException('You can\'t relocate master branch to other', HttpStatus.BAD_REQUEST)
        } else {
            const filesFromMainBranch = (await this.commitService.getLatestCommit(branchFromMergeId)).files
            const filesFromSlaveBranch = (await this.commitService.getLatestCommit(branchToMergeId)).files
            const creatorId = (await this.commitService.getLatestCommit(branchFromMergeId)).creator_id;

            const unionFileList = [...filesFromMainBranch, ...filesFromSlaveBranch];
            const unionFiles = [];

            for (const file of unionFileList) {
                const fileData = fs.readFileSync(`${file.filePath}/${file.fileName}`)
                unionFiles.push({
                    fileName: file.fileName,
                    buffer: fileData
                })
            }

            await this.commitService.createCommit({
                dto: {
                    message: message,
                    creator_id: creatorId,
                    branch_id: branchToMergeId
                },
                filesBuffer: unionFiles
            })

            if (shouldDelete) {
                await this.branchRep.destroy({
                    where: {
                        branch_id: branchFromMergeId
                    }
                })
            }
        }
    }
}
