import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './services/users.service';
import { ModeratorsService } from './services/moderators.service';
import { ModeratorsController } from './controllers/moderators.controller';
import { UsersController } from './controllers/users.controller';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { Moderator, ModeratorSchema } from './entities/moderator.entity';
import { User, UserSchema } from './entities/user.entity';
import { Order, OrderSchema } from './entities/order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Moderator.name, schema: ModeratorSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ModeratorsController, UsersController, OrdersController],
  providers: [UsersService, ModeratorsService, OrdersService],
  exports: [UsersService, ModeratorsService],
})
export class UsersModule {}
