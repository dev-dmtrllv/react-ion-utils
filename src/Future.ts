import { Maybe } from "./Maybe";

export abstract class Future<T, Args extends any[] = []> implements Promise<T>
{
	private promise: Promise<T>;
	public [Symbol.toStringTag]!: string;

	private value_: Maybe<T> = new Maybe();
	private canceled_: Maybe<any> = new Maybe();

	public get value(): T 
	{
		if(this.value_.isNone)
			throw new Error("Future is not resolved yet!");
		return this.value_.get();
	}

	public constructor(...args: Args)
	{
		this.promise = new Promise<T>(async (res, rej) => 
		{
			try
			{
				const data = await this.onInitialize(...args);
				if(this.canceled_.isSome)
					return rej(this.canceled_.get());
				res(data);
			}
			catch (e)
			{
				if(this.canceled_.isSome)
					return rej(this.canceled_.get());
				rej(e);
			}
		});
		this[Symbol.toStringTag] = this.promise[Symbol.toStringTag];
		return this.promise as any;
	}

	abstract onInitialize(...args: Args): T | Promise<T>;

	public async then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>
	{
		return this.promise.then(onfulfilled, onrejected);
	}

	public async catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult>
	{
		return this.promise.catch(onrejected);
	}

	public finally(onfinally?: (() => void) | null | undefined): Promise<T>
	{
		return this.promise.finally(onfinally);
	}

	public readonly cancel = (reason?: any) =>
	{
		this.canceled_.set(reason);
	};
}
