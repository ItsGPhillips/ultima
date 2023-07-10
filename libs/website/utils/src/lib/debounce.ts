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