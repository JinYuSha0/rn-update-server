import { HttpException } from '@nestjs/common';
import { ErrorCode, ErrorMessage } from '@constants/error.enum';

export default class BussinessException extends HttpException {
  message: ErrorMessage;
  code: ErrorCode;

  constructor(errorMessage: ErrorMessage, errorCode: ErrorCode) {
    // 业务异常返回200
    super(errorMessage, 200);
    this.message = errorMessage;
    this.code = errorCode;
  }
}
