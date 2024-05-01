import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { GenericResponseClass } from '../interceptors/generic.interceptor';

export const GenericObjectResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => {
  return applyDecorators(
    ApiExtraModels(GenericResponseClass, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(GenericResponseClass) },
          {
            properties: {
              Data: {
                type: 'object',
                $ref: getSchemaPath(dataDto),
                // items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};
export const GenericArrayResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => {
  return applyDecorators(
    ApiExtraModels(GenericResponseClass, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(GenericResponseClass) },
          {
            properties: {
              Data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const GenericArrayOfNumberResponse = () => {
  return applyDecorators(
    ApiExtraModels(GenericResponseClass),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(GenericResponseClass) },
          {
            properties: {
              Data: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
        ],
      },
    }),
  );
};

export const GenericNullResponse = () => {
  return applyDecorators(
    ApiExtraModels(GenericResponseClass),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(GenericResponseClass) },
          {
            properties: {
              Data: {
                type: 'string',
                nullable: true,
                default: null,
              },
            },
          },
        ],
      },
    }),
  );
};
