
class InstanceHolder {
  private map: Map<any, any> = new Map();

  setIfAbsent<T>(key: new (...args: any[]) => T, producer: () => T) {
    if (!this.map.has(key)) {
      this.map.set(key, producer());
    }
  }

  get<T>(key: new (...args: any[]) => T): Maybe<T> {
    return this.map.get(key);
  }

  has(key: new (...args: any[]) => any) {
    return this.map.has(key);
  }

  remove(key: new (...args: any[]) => any) {
    return this.map.delete(key);
  }

  get size() {
    return this.map.size;
  }
}

const defaultHolder = new InstanceHolder();

export default defaultHolder;