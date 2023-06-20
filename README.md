<style>
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   section {
      padding: 2rem;
      margin-bottom: 1rem;
      background-color: rgba(255, 255, 255, 0.02);
      border-radius: 1rem;
   }
   section h2 {
      color: white;
      font-weight: bold;
   }
   .header {
      margin-bottom: 2rem;
   }
   hr {
      margin: 1rem 0px;
   }
   .nextjs-logo {
      background-color: transparent;
      filter: invert(0.85);
      height: 3rem;
   }
   li {
      list-style: none;
      position: relative;
      margin-left: 2rem;
      border-bottom: solid 1px rgba(255, 255, 255, 0.1);
      margin-bottom: 3rem;
   }
   li::before {
      position: absolute;
      right: 100%;
      font-size: larger;
      margin-right: 1rem;
      white-space: nowrap;
   }
   li.hot-1::before {
      content: "🔥";
   }
   li.hot-2::before {
      content: "🔥🔥";
   }
   li.hot-3::before {
      content: "🔥🔥🔥";
   }
   .block {
      display: block;
   }
</style>

<body>
   <h1>ULTIMA</h1>
   <section>
      <h2>Stack</h2>
      <hr />
      <ul>
         <li class="hot-3">
            <a class="header" href="https://nextjs.org/" title="NEXT JS">
               <img 
                  class="nextjs-logo"
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" 
               />
            </a>
            <span class="block">Server Side Rendering (SSR)</span>
            <span class="block">React Server Components</span>
            <span class="block">Full Stack Framwork</span>
         </li>
         <li class="hot-2">
            <h3>Tailwind</h3>
         </li>
         <li class="hot-2">
            <h3>React Query</h3>
         </li>
         <li class="hot-3">
            <a class="header" href="https://orm.drizzle.team/" title="Drizzle ORM">
               <img 
                  class="nextjs-logo"
                  src="./misc/drizzle-orm.svg" 
               />
               <h3 style="display: inline-block;">Drizzle Orm</h3>
            </a>
         </li>
      </ul>
   </section>
   <section>
      <h2>Database Schema</h2>
      <hr />
      <img src="./misc/database_schema.svg">
   </section>
</body>
