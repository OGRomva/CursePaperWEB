import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserCreationDto} from "../user/dto/userCreationDto";
import {AuthDto} from "./dto/auth.dto";
import {AccessTokenGuard} from "../../guards/accessToken.guard";
import {RefreshTokenGuard} from "../../guards/refreshToken.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('reg')
    reg(@Body() dto: UserCreationDto) {
        return this.authService.signUp(dto);
    }

    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.singIn(dto);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    logout(@Req() req: Request) {
        this.authService.logout(req['user']['sub'])
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const user_id = req['user']['sub'];
        const refreshToken = req['user']['refreshToken'];
        return this.authService.refreshTokens(user_id, refreshToken)
    }
}
