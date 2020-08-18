import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

interface RemoteProps<T> {
    data: E.Either<O.Option<Error>, T>;
    loading: () => JSX.Element;
    error: (error: Error) => JSX.Element;
    success: (data: T) => JSX.Element;
}

export function ResponseHandler<T>({ data, error, loading, success }: RemoteProps<T>): JSX.Element {
    return pipe(
        data,
        E.fold(
            (maybeError: O.Option<Error>) =>
                O.fold<Error, JSX.Element>(
                    () => loading(),
                    (someError: Error) => error(someError)
                )(maybeError),
            (r) => success(r)
        )
    );
}

export default ResponseHandler;
