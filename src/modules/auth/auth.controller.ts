import { Controller, Post, Body, Res } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { signInDTO } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() signInDTO: signInDTO, @Res() response: Response) {
    const tokenData = await this.authService.validateUser(signInDTO);
    this.setCookies(response, tokenData.access_token);
    return tokenData.user;
  }

  private setCookies(response: Response, access_token: string) {
    response.cookie('access_token', access_token, { httpOnly: true });
  }

  private clearCookies(response: Response) {
    response.clearCookie('access_token');
  }
}