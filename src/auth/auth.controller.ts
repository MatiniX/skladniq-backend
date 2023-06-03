import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards/rt.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CurrentUserDto, SignUpDto, Tokens } from './dtos';
import { SignInDto } from './dtos/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User has been successfuly registered',
    type: Tokens,
  })
  async signupLocal(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignUpDto,
  ): Promise<Tokens> {
    const tokens = await this.authService.signupLocal(dto);

    res.cookie('rt', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'none',
      secure: true,
    });

    return tokens;
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User successfuly signed in', type: Tokens })
  @ApiForbiddenResponse({ description: 'Invalid credentials' })
  async signinLocal(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignInDto,
  ) {
    const tokens = await this.authService.signinLocal(dto);

    res.cookie('rt', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'none',
      secure: true,
    });

    return tokens;
  }

  @Delete('/signout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User successfuly signed out' })
  signout(@CurrentUser('sub') userId: string) {
    return this.authService.signout(userId);
  }

  @Public()
  @Get('/forgot-password/:email')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Param('email') email: string) {
    return this.authService.generateChangePasswordToken(email);
  }

  @Public()
  @Post('/change-password')
  @HttpCode(HttpStatus.ACCEPTED)
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto.token, dto.newPassword);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOkResponse({
    description: 'User successfuly updated his tokens',
    type: Tokens,
  })
  @ApiForbiddenResponse({ description: 'Invalid refresh token' })
  async refreshTokens(
    @CurrentUser() user,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(
      user['sub'],
      user['refreshToken'],
    );

    res.cookie('rt', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'none',
      secure: true,
    });

    return tokens;
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CurrentUserDto })
  currentUser(@CurrentUser() user): CurrentUserDto {
    return user;
  }
}
