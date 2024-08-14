import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import TypeORM module for User entity
  providers: [UserService],                    // Register the UserService as a provider
  controllers: [UserController],               // Register the UserController
  exports: [UserService],                      // Export the UserService so it can be used in other modules
})
export class UserModule {}
