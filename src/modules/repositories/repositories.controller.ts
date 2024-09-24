import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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

    @Delete('delete/:id')
    remove(@Param('id') rep_id: number) {
        return this.repService.removeOne(rep_id);
    }
}
