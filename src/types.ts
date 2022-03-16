export type IType = 'string' | 'number' | 'boolean' | 'bigint' | 'null' | 'undefined' | 'date';

export interface ITypedValue<T extends string = IType> {
	t: T;
	v: string;
}
