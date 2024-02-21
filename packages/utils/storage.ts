const setValue = <T>(key: string, value: T, local?: boolean) => {
  const stringified = JSON.stringify(value);
  if (local) {
    localStorage.setItem(key, stringified);
  } else {
    sessionStorage.setItem(key, stringified);
  }
};

const getValue = <T>(key: string) => {
  const value = sessionStorage.getItem(key) ?? localStorage.getItem(key);
  if (value) {
    return JSON.parse(value) as T;
  }
  return undefined;
};

const removeValue = (key: string, local?: boolean) => {
  if (local) {
    localStorage.removeItem(key);
  } else {
    sessionStorage.removeItem(key);
  }
};

export const storage = {
  setValue,
  getValue,
  removeValue,
};
