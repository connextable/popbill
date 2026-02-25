export interface SingletonStore<TStore extends object> {
  clear(): void
  get<TKey extends keyof TStore>(key: TKey, create: () => TStore[TKey]): TStore[TKey]
}

export function createSingleton<TStore extends object>(): SingletonStore<TStore> {
  const cache = new Map<keyof TStore, TStore[keyof TStore]>()

  return {
    clear(): void {
      cache.clear()
    },

    get<TKey extends keyof TStore>(key: TKey, create: () => TStore[TKey]): TStore[TKey] {
      const cached = cache.get(key)
      if (cached !== undefined) {
        return cached as TStore[TKey]
      }

      const created = create()
      cache.set(key, created)
      return created
    },
  }
}
