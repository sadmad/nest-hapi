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
    const csvStream = fastCsv.format({ headers: true });

    // Pipe fast-csv to the output stream
    csvStream.pipe(outputStream);
    try{
      const readStream = fs.createReadStream(inputFilePath)
      .pipe(csvParser())
      .on('headers', (headers) => {
        // Append 'email' and 'password' to the existing headers
        const newHeaders = [...headers, 'Email', 'Password'];
        // Write the new headers to the output CSV file
        csvStream.write(newHeaders);
      })
      .on('data', (data) => {
        console.log(`Processing row: ${JSON.stringify(data)}`);
        results.push(data);
      })
      .on('end', async () => {
        for (const [index, row] of results.entries()) {
          try {
                const user = new User();

                // Parse and validate the fields
                user.age = parseInt(row['Age'], 10);
                if (isNaN(user.age)) user.age = null;

                user.billing_amount = parseFloat(row['Billing Amount']);
                if (isNaN(user.billing_amount)) user.billing_amount = 0;

                user.room_number = parseInt(row['Room Number'], 10);
                if (isNaN(user.room_number)) user.room_number = null;

                user.date_of_admission = new Date(row['Date of Admission']);
                if (isNaN(user.date_of_admission.getTime())) {
                  throw new Error('Invalid date_of_admission value');
                }

                user.discharge_date = new Date(row['Discharge Date']);
                if (isNaN(user.discharge_date.getTime())) {
                  throw new Error('Invalid discharge_date value');
                }

                // Assign other fields
                user.name = row['Name'];
                user.gender = row['Gender'];
                user.blood_type = row['Blood Type'];
                user.medical_condition = row['Medical Condition'];
                user.doctor = row['Doctor'];
                user.hospital = row['Hospital'];
                user.insurance_provider = row['Insurance Provider'];
                user.admission_type = row['Admission Type'];
                user.medication = row['Medication'];
                user.test_result = row['Test Results'];

                // Generate email from the first name
                const firstName = row['Name'].split(' ')[0].toLowerCase();
                const rowNumber = index + 1; // Using 1-based index for row number
                user.email = `${firstName}${rowNumber}@hapi.com`;
                // Generate and set the password
                const password = Math.random().toString(36).slice(-8);
                await user.setPassword(password);

                // Save the user to the database
                await this.userRepository.save(user);

                // Write output CSV file
                const newRow = [
                  ...Object.values(row),  // Spread the existing row data
                  user.email,  // Add the new email
                  password     // Add the new password
                ];
                csvStream.write(newRow);

                } catch (error) {
                console.error(`Error processing row ${JSON.stringify(row)}: ${error.message}`);
              }
            }
            
            console.log('CSV import and password generation finished');
            csvStream.end(); // Close the CSV stream properly
          });
          readStream.on('close', () => {
            console.log('Read stream closed');
          });
    
        } catch (error) {
          console.error('An unexpected error occurred:', error);
          csvStream.end(); // Close the CSV stream properly
        }
      }
    }