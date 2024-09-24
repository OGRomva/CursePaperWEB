import { forwardRef, Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Branch } from './branch.model';
import { CommitModule } from '../commit/commit.module';

@Module({
    controllers: [BranchController],
    providers: [BranchService],
    imports: [
        forwardRef(() => CommitModule),
        SequelizeModule.forFeature([Branch]),
    ],
    exports: [BranchService],
})
export class BranchModule {
}
