import {Body, Controller, Delete, Get, Param, Patch, Post, Req} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserCreationDto} from "./dto/userCreationDto";
import {UserUpdateDto} from "./dto/userUpdate.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post()
    createUser(@Body() dto: UserCreationDto) {
        return this.userService.createUser(dto);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get()
    findById(@Req() req: Request) {
        return this.userService.findById(req['user']['sub']);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UserUpdateDto) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }
}
