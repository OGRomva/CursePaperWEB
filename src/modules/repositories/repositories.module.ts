import { forwardRef, Module } from '@nestjs/common';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Repositories } from './repositories.model';
import { BranchModule } from '../branch/branch.module';
import { CommitModule } from '../commit/commit.module';
import { FileRep } from '../file-rep/file-rep.model';
import { FileRepModule } from '../file-rep/file-rep.module';

@Module({
    controllers: [RepositoriesController],
    providers: [RepositoriesService],
    imports: [
        SequelizeModule.forFeature([Repositories]),
        BranchModule,
        CommitModule,
        FileRepModule
    ]
})
export class RepositoriesModule {
}
