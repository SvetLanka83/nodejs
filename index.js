const fs = require('node:fs/promises');
const path = require('node:path');

const foo = async () => {
   const basePath = path.join(__dirname, 'baseFolder');
   await fs.mkdir(basePath, { recursive: true });

   // створюємо папки та файли
   for (let i = 1; i <= 5; i++) {
      const folderPath = path.join(basePath, `folder${i}`);
      await fs.mkdir(folderPath, { recursive: true });

      for (let j = 1; j <= 5; j++) {
         const filePath = path.join(folderPath, `file${j}.txt`);
         await fs.writeFile(filePath, `Це вміст файлу ${j} у папці folder${i}`);
      }
   }

   // вивід усіх файлів і папок
   const walk = async (dir) => {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
         const fullPath = path.join(dir, item.name);
         console.log(`${fullPath} — ${item.isDirectory() ? 'Папка' : 'Файл'}`);
         if (item.isDirectory()) {
            await walk(fullPath); // рекурсія для папок
         }
      }
   };

   await walk(basePath);
};

void foo();
