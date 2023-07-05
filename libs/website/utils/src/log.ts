import chalk from "chalk";

type LogFn = (data: unknown, title?: string) => void;

class Logger {
   constructor() {}

   private keyColor = chalk.rgb(219, 208, 142);
   private dateColor = chalk.rgb(220, 132, 222);
   private numberColor = chalk.rgb(223, 200, 65);
   private booleanColor = chalk.rgb(65, 155, 223);
   private stringColor = chalk.rgb(225, 146, 37);
   private warningColor = chalk.rgb(235, 152, 58);

   format(data: unknown, depth: number): string {
      let out = "\t";

      if (typeof data === "undefined") {
         return chalk.gray("undefined");
      }

      if (typeof data === "string") {
         if(data.length > 50) {
            return this.stringColor(`"${data.slice(0, 49)} ..."`);
         }
         return this.stringColor(`"${data}"`);
      }

      if (typeof data === "boolean") {
         return this.booleanColor(data);
      }

      if (typeof data === "number") {
         return this.numberColor(data);
      }

      if (Array.isArray(data)) {
         data = Object.assign({}, data);
      }

      if (typeof data === "object") {
         if (data === null) {
            return chalk.blueBright("null");
         }

         out += "\n";
         const entries = Object.entries(data);
         entries.map(([k, v], idx) => {
            const formatedValue = this.format(v, depth + 1);
            const line = `${this.keyColor(k)}${chalk.grey(
               ":"
            )} ${formatedValue}`;

            out = out + "".padStart(depth * 2, " ") + line + "\n";

            if (idx !== entries.length - 1) {
               out + "\n";
            }
         });
      }

      if (data instanceof Date) {
         return this.dateColor(data.toISOString());
      }

      if (data instanceof Function) {
         return chalk.grey(`Function(${data.name})`);
      }

      return out;
   }

   genLogLevel(level: string, title: string): [string, string] {
      switch (level) {
         case "debug": {
            return [chalk.cyan.bold(level.toUpperCase()), chalk.cyan(title)];
         }
         case "trace": {
            return [level.toUpperCase(), title];
         }
         case "info": {
            return [
               chalk.greenBright.bold(level.toUpperCase()),
               chalk.greenBright(title),
            ];
         }
         case "warn": {
            return [
               this.warningColor.bold(level.toUpperCase()),
               this.warningColor(title),
            ];
         }
         case "error": {
            return [chalk.red.bold(level.toUpperCase()), chalk.red(title)];
         }
         case "fatal": {
            return [
               chalk.whiteBright.bgRed.bold(level.toUpperCase()),
               chalk.whiteBright.bgRed(title),
            ];
         }
         default:
            throw "unreachable";
      }
   }

   createLogFn(inLevel: string): LogFn {
      return (data, inTitle) => {
         const [level, title] = this.genLogLevel(inLevel, inTitle ?? "");
         const out = this.format(data, 0)
            .split("\n")
            .map((line) => "  " + line + "\n")
            .join("");

         const date = new Date().toTimeString().slice(0, 8);
         const output = `[ ${chalk.grey(date)} ${level} ] ${chalk.white(
            title
         )} ${out}`;
         console.log(output);
      };
   }
}

const logger = new Logger();

export namespace Log {
   export const debug = logger.createLogFn("debug");
   export const trace = logger.createLogFn("trace");
   export const info = logger.createLogFn("info");
   export const warn = logger.createLogFn("warn");
   export const error = logger.createLogFn("error");
   export const fatal = logger.createLogFn("fatal");
}
