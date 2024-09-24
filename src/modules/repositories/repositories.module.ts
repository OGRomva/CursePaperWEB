import { Module } from '@nestjs/common';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Repositories } from './repositories.model';
import { BranchModule } from '../branch/branch.module';

@Module({
    controllers: [RepositoriesController],
    providers: [RepositoriesService],
    imports: [SequelizeModule.forFeature([Repositories]), BranchModule],
})
export class RepositoriesModule {
}
