import { Body, Controller, Delete, Get, Param, Post, Req, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { RepositoriesService } from './repositories.service';
import { RepCreateDto } from './dto/repCreate.dto';

@UseGuards(AccessTokenGuard)
@Controller('repositories')
export class RepositoriesController {
    constructor(private repService: RepositoriesService) {
    }

    @Post('create')
    create(@Body() dto: RepCreateDto, @Req() req: Request) {
        return this.repService.create(dto, req['user']['sub']);
    }

    @Get('find-all')
    findAll(@Req() req: Request) {
        return this.repService.findAll(req['user']['sub']);
    }

    @Get(':repos_id')
    findByPk(@Param('repos_id') repos_id: number) {
        return this.repService.findByPk(repos_id)
    }

    @Delete(':id')
    remove(@Param('id') rep_id: number) {
        return this.repService.removeOne(rep_id);
    }

    @Get(':branch_id/download/latest')
    downloadLatest(@Param('branch_id') branch_id: number, @Res({passthrough: true}) res: Response) {
        return this.repService.downloadLatest(branch_id);
    }

    @Get('get-file/:file_id')
    getFileFromLatestCommit(@Param('file_id') file_id: number) {
        return this.repService.getFile(file_id)
    }

    @Get('get-file-list/:branch_id/latest')
    getFileListFromLatestCommitInBranch(@Param('branch_id') branch_id: number) {
        return this.repService.getLatestFileFromBranch(branch_id);
    }
}
