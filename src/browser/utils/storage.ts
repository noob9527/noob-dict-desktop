interface Storage {
  putObject(key: string, value: any)

  getObject(key: string)

  remove(key: string)
}

const storage: Storage = {
  putObject(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getObject(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};

export {
  storage
}