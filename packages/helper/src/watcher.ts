import chokidar from 'chokidar'
import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'


const program = new Command()

const doWatch = (input: string, output: string) => {
  const watcher = chokidar.watch(`${ input }/**/*.md`.replace(/\/+/g, '/'))
  
  let isReady = false
  
  watcher
    .on('ready', () => {
      isReady = true
    })
    .on('all', () => {
      if (isReady) {
        const file = path.join(process.cwd(), output)
        fs.writeFileSync(
          file,
          `// ${ new Date() }`,
        )
      }
    })
  
  console.log(chalk.green('[vitepress-helper]'), chalk.gray(`watching > ${ input }`))
  
  process.on('exit', async () => {
    console.log(chalk.green('[vitepress-helper]'), chalk.gray(`unwatch > ${ input }`))
    await watcher.close()
  })
  
  process.on('SIGINT', () => {
    process.exit(1)
  })
}

program.command('watch')
  .description('watch markdown file changes')
  .option('-d, --dir [dir]', 'the directory to watch', 'docs')
  .option('-o, --output [output]', 'the file path used to trigger the restart', 'docs/.vitepress/helper/restart-trigger.ts')
  .action((args) => {
    const { dir, output } = args
    doWatch(dir, output)
  })

program.parse(process.argv)
