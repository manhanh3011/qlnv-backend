import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProducerService {
  private readonly producerUrl = 'http://localhost:3002/publish';

  async scanRawEmployee(): Promise<void> {
    const response = await fetch(this.producerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'SCAN_RAW_EMPLOYEE',
      }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Không thể gửi yêu cầu tới Producer',
      );
    }
  }
}
