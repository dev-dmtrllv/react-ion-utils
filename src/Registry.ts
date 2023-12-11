export class Registry<T, Args extends any[]>
{
	private readonly list_: Registry.Item<T, Args>[] = [];

	public readonly register = (resolver: (...args: Args) => T) =>
	{
		const item = new Registry.Item(resolver);
		this.list_.push(item);
		return item;
	}

	public readonly initialize = (...args: Args) =>
	{
		this.list_.forEach(item => item.initialize(...args));
	};

	public readonly all = () => this.list_.map(lazy => lazy.get());
}


export namespace Registry
{
	export class Item<T, Args extends any[]>
	{
		private getter_: Function;

		private isInitialized_: boolean = false;

		public readonly get = () =>
		{
			if (!this.isInitialized_)
				throw new Error("Registry.Item is not initialized!");
		}

		public constructor(initializer: (...args: Args) => T)
		{
			this.getter_ = (...args: Args) => 
			{
				const data = initializer(...args);
				this.isInitialized_ = true;
				this.getter_ = () => data;
				return data;
			}
		}

		public readonly initialize = (...args: Args): T =>
		{
			if (this.isInitialized_)
				throw new Error("Registry.Item is already initialized!");

			return this.getter_(...args);
		}
	}
}
