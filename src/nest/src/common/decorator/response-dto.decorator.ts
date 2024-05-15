import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ResponseTransformInterceptor } from '../interceptor/response-transform.interceptor';

export const ResponseDtoInterceptor = (dto: any) => {
  return applyDecorators(
    UseInterceptors(new ResponseTransformInterceptor(dto)),
  );
};
