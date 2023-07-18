import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Body() login: LoginDto) {
    const { email, password } = login;
    const user = await this.authService.validateUser(email, password);
    const sesion = this.authService.generateJwt(user);
    return sesion;
  }
}
