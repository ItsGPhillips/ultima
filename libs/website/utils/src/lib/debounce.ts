export const debounce = <T extends Array<any>, U>(
   callback: (...args: T) => U,
   delay: number = 500
) => {
   let timeout: ReturnType<typeof setTimeout>;
   return (...args: T) => {
      clearTimeout(timeout);
      const context = this;
      timeout = setTimeout(() => callback.apply(context, args), delay);
   };
};

export const debounceAsync = <T extends Array<any>, U>(
   callback: (...args: T) => U,
   delay: number = 500
) => {
   let timeout: ReturnType<typeof setTimeout>;

   return async (...args: T): Promise<U> => {
      clearTimeout(timeout);
      const context = this;

      const promiseForFunc = new Promise((resolve) => {
         timeout = setTimeout(resolve, delay);
      });

      return promiseForFunc.then(() => callback.apply(context, args));
   };
};