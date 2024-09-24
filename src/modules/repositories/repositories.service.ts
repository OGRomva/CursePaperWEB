import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repositories } from './repositories.model';
import { RepCreateDto } from './dto/repCreate.dto';
import { BranchService } from '../branch/branch.service';
import * as fs from 'fs';

@Injectable()
export class RepositoriesService {
    constructor(
        @InjectModel(Repositories) private reposRep: typeof Repositories,
        private branchService: BranchService,
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
            owner_id: user_id,
        });

        const branch = await this.branchService.createBranch({
            title: 'main',
            repos_id: repos.rep_id,
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
}
