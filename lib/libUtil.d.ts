interface Array<T> {
    // https://stackoverflow.com/a/57913509
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any):
        { [K in keyof this]: U }
}
