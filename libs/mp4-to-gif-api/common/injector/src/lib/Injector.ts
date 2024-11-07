import 'reflect-metadata';
import {
  Injectable as Injectable0,
  ReflectiveInjector as ReflectiveInjector0,
} from 'injection-js';

class Injector {
  private providers: Array<Newable<unknown>> = [];
  private injector!: ReflectiveInjector0;

  init() {
    this.injector = ReflectiveInjector0.resolveAndCreate(this.providers);
  }

  factory<T>(provider: Newable<T>): T {
    return ReflectiveInjector0.resolveAndCreate([provider], this.injector).get(
      provider
    );
  }

  get<T>(provider: Newable<T>): T {
    return this.injector.get(provider) as T;
  }

  add<T>(provider: Newable<T>): void {
    this.providers = [...this.providers, provider];
  }
}

type Newable<T> = { new (...args: any[]): T };

const injector = new Injector();

export { injector };

export const Injectable =
  () =>
  <T>(provider: Newable<T>) => {
    injector.add(provider);
    return Injectable0()(provider);
  };
