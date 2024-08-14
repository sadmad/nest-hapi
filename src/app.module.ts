import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity'; // Adjust path as necessary
import { UserModule } from './user/user.module'; // Import UserModule
import { AuthModule } from './auth/auth.module';
import { CsvModule } from './csv/csv.module'; // Import CsvModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',  // Use the Docker container name as the host
      port: 5432,
      username: 'hapi-admin',
      password: 'hapi-pass',
      database: 'hapi-pg',
      entities: [User],
      synchronize: true, // Set to false in production
    }),
    UserModule,
    AuthModule,
    CsvModule,  // Add CsvModule to the imports array
    // Other modules...
  ],
  controllers: [],
  providers: [],

})

export class AppModule {}