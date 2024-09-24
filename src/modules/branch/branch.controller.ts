import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BranchService } from './branch.service';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { BranchCreateDto } from './dto/branchCreate.dto';

@UseGuards(AccessTokenGuard)
@Controller('branch')
export class BranchController {
    constructor(private branchService: BranchService) {
    }

    @Post('create')
    createBranch(@Body() dto: BranchCreateDto) {
        return this.branchService.createBranch(dto);
    }

    @Get('find-all/:id')
    findAll(@Param('id') rep_id: number) {
        return this.branchService.findAll(rep_id);
    }

    @Delete('delete/:id')
    remove(@Param('id') branch_id: number) {
        return this.branchService.removeByBranchId(branch_id);
    }
}
