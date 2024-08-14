import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column({ length: 3 })
  blood_type: string;

  @Column()
  medical_condition: string;

  @Column({ type: 'date' })
  date_of_admission: Date;

  @Column()
  doctor: string;

  @Column()
  hospital: string;

  @Column()
  insurance_provider: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  billing_amount: number;

  @Column()
  room_number: number;

  @Column()
  admission_type: string;

  @Column({ type: 'date' })
  discharge_date: Date;

  @Column()
  medication: string;

  @Column()
  test_result: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  mustChangePassword: boolean;

  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
