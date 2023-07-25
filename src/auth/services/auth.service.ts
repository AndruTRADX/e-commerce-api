import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/user.entity';
import { PayloadToken } from '../models/token.model';
import { ModeratorsService } from 'src/users/services/moderators.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private moderatorService: ModeratorsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const moderator = await this.moderatorService.findByEmail(email);

    if (!user && !moderator) {
      return null;
    }

    const isMatch = await bcrypt.compare(
      password,
      user ? user.password : moderator.password,
    );

    if (!isMatch) {
      return null;
    }

    return user ? user : moderator;
  }

  async generateJwt(user: User) {
    const payload: PayloadToken = {
      role: user.role,
      sub: user.id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async getUserByToken(rawAccessToken: string) {
    const user = await this.userService.findByToken(rawAccessToken);
    const moderator = await this.moderatorService.findByToken(rawAccessToken);
    return user ? user : moderator;
  }
}
