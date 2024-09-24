import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch } from './branch.model';
import { BranchCreateDto } from './dto/branchCreate.dto';
import { CommitService } from '../commit/commit.service';

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
        return await this.branchRep.create(dto);
    }

    async findAll(rep_id: number) {
        return await this.branchRep.findAll({ where: { repos_id: rep_id }, include: { all: true } });
    }

    //for deleting a repository
    async removeAll(repos_id: number) {
        const branches = await this.branchRep.findAll({ where: { repos_id: repos_id } });

        for (const branch of branches) {
            await this.commitService.removeAll(branch.branch_id);
        }

        return await this.branchRep.destroy({ where: { repos_id: repos_id } });
    }

    async removeByBranchId(branch_id: number) {
        return await this.branchRep.destroy({ where: { branch_id: branch_id } });
    }

    async getBranchById(branch_id: number) {
        return await this.branchRep.findByPk(branch_id);
    }
}
