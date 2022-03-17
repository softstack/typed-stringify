export type IType = 'string' | 'number' | 'boolean' | 'bigint' | 'null' | 'undefined' | 'Date';

export interface ITypedValue<T extends string = IType> {
	t: T;
	v?: string;
}

export type ICustomStringify<T extends string> = (obj: unknown) => ITypedValue<T> | undefined;

export type ICustomParse = (obj: unknown) => { useResult: boolean; result?: unknown };
