import { Controller, Post, Body } from '@nestjs/common';
import { CsvService } from './csv.service';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('import')
  async importCsv(@Body('inputFilePath') inputFilePath: string, @Body('outputFilePath') outputFilePath: string) {
    await this.csvService.importCsv(inputFilePath, outputFilePath);
    return 'CSV import process started';
  }
}
