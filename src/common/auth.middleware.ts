import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>
  ) { }
  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers['authorization'] as string;
    if (token) {
      const user = await this.userRepository.findOne({
        where: { token: token }
      })

      if (user) req.user = user
    }
    next();
  }
}
