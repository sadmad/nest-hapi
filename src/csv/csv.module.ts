import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller'; // Import the controller
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CsvService],
  controllers: [CsvController], // Add the controller here
})
export class CsvModule {}
