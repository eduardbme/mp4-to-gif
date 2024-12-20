declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

declare global {
  type Branded<T, B> = T & Brand<B>;
}

export {};
