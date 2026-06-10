export type Success<T> = {
  ok: true;
  data: T;
};

export type Failure<E = unknown> = {
  ok: false;
  error: E;
};

export type Result<T, E = unknown> = Success<T> | Failure<E>;

export function success<T>(data: T): Success<T> {
  return {
    ok: true,
    data,
  };
}

export function failure<E>(error: E): Failure<E> {
  return {
    ok: false,
    error,
  };
}

export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result.ok;
}

export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
  return !result.ok;
}
