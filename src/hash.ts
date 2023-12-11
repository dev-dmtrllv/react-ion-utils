export const hashString = (str: string): number => [...str].reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
export const hashObject = (o: object) => hashString(JSON.stringify(o));
export const hashFn = (fn: Function) => hashString(fn.toString());
export const hashNumber = (n: number | bigint) => hashString(n.toString());
export const hashBool = (bool: boolean) => +bool;
export const hashSymbol = (symbol: symbol) => hashString(symbol.toString());
export const hashUndefined = (_: undefined) => UNDEFINED_HASH;

const UNDEFINED_HASH = hashString("undefined");
 
const TEMP = typeof (undefined as any);
type PrimitiveTypes = typeof TEMP;

const hashMap: Record<PrimitiveTypes, (value: any) => number> = {
	string: hashString,
	number: hashNumber,
	bigint: hashNumber,
	boolean: hashBool,
	undefined: hashUndefined,
	object: hashObject,
	symbol: hashSymbol,
	function: hashFn
};

export const hash = (o: any) => hashMap[typeof o](o);
