export class GenericResponseDto<T> {
  success: boolean;
  result?: T;
}