import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as fastCsv from 'fast-csv';

@Injectable()
export class CsvService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async importCsv(inputFilePath: string, outputFilePath: string): Promise<void> {
    const results = [];
    const outputStream = fs.createWriteStream(outputFilePath);

    // Write the header to the output CSV file
    outputStream.write('email,password\n');

    fs.createReadStream(inputFilePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          const user = new User();
          user.name = row.name;
          user.age = parseInt(row.age);
          user.gender = row.gender;
          user.blood_type = row.blood_type;
          user.medical_condition = row.medical_condition;
          user.date_of_admission = new Date(row.date_of_admission);
          user.doctor = row.doctor;
          user.hospital = row.hospital;
          user.insurance_provider = row.insurance_provider;
          user.billing_amount = parseFloat(row.billing_amount);
          user.room_number = parseInt(row.room_number);
          user.admission_type = row.admission_type;
          user.discharge_date = new Date(row.discharge_date);
          user.medication = row.medication;
          user.test_result = row.test_result;
          user.email = row.email;

          // Generate a random password for the user
          const password = Math.random().toString(36).slice(-8);
          await user.setPassword(password);

          // Save the user to the database
          await this.userRepository.save(user);

          // Write the email and password to the output CSV file
          fastCsv
            .writeToStream(outputStream, [[user.email, password]], { headers: false })
            .on('error', err => console.error(err));
        }
        console.log('CSV import and password generation finished');
      });
  }
}
