import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards/rt.guard';
import { AuthService } from './auth.service';
import { SignUpDto, Tokens } from './dtos';
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
  signupLocal(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User successfuly signed in', type: Tokens })
  @ApiForbiddenResponse({ description: 'Invalid credentials' })
  signinLocal(@Body() dto: SignInDto) {
    return this.authService.signinLocal(dto);
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User successfuly signed out' })
  signout(@CurrentUser('sub') userId: string) {
    return this.authService.signout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User successfuly updated his tokens',
    type: Tokens,
  })
  @ApiForbiddenResponse({ description: 'Invalid refresh token' })
  refreshTokens(@CurrentUser() user) {
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }
}
