import {
    Controller, Get, Param,
    Post, Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CommitService } from './commit.service';

@Controller('commit')
export class CommitController {
    constructor(private commitService: CommitService) {
    }

    @Post('create')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
    uploadFile(@UploadedFiles() files, @Req() req: Request) {
        return this.commitService.createCommit({
            dto: JSON.parse(req['body']['dto']),
            filesMulter: files
        });
    }

    @Get(':branch_id/find-all')
    findAll(@Param('branch_id') branch_id: number) {
        return this.commitService.findAll(branch_id);
    }

    @Get(':branch_id/latest')
    getLatestCommit(@Param('branch_id') id: number) {
        return this.commitService.getLatestCommit(id)
    }
}
