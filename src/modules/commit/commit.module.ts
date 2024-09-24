import { forwardRef, Module } from '@nestjs/common';
import { CommitController } from './commit.controller';
import { CommitService } from './commit.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Commit } from './commit.model';
import { FileRepModule } from '../file-rep/file-rep.module';
import { BranchModule } from '../branch/branch.module';

@Module({
    controllers: [CommitController],
    providers: [CommitService],
    imports: [
        SequelizeModule.forFeature([Commit]),
        FileRepModule,
        forwardRef(() => BranchModule),
    ],
    exports: [CommitService],
})
export class CommitModule {
}
