interface Array<T> {
	// https://stackoverflow.com/a/57913509
	map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): { [K in keyof this]: U }

	// https://github.com/microsoft/TypeScript/issues/31785#issuecomment-948012321
	fill<U>(value: U): Array<U>
}

interface ImportMeta {
	// Replete compatibility
	// https://docs.deno.com/runtime/reference/deno_namespace_apis/#import.meta.main
	main: boolean
}
