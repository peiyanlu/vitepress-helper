import chalk from 'chalk'
import { exec } from 'child_process'
import chokidar from 'chokidar'
import { Command } from 'commander'
import fs from 'fs'
import path from 'path'


const program = new Command()

const doWatch = (input: string, output: string) => {
  const watcher = chokidar.watch(`${ input }/**/*.md`.replace(/\/+/g, '/'))
  
  let isReady = false
  const listener = () => {
    if (isReady) {
      const file = path.join(process.cwd(), output)
      fs.writeFileSync(
        file,
        `// ${ new Date() }`,
      )
    }
  }
  
  watcher
    .on('ready', () => {
      isReady = true
    })
    .on('add', listener)
    .on('addDir', listener)
    .on('unlink', listener)
    .on('unlinkDir', listener)
    .on('error', console.error)
  
  
  console.log(chalk.green('[vitepress-helper]'), chalk.gray(`watching > ${ input }`))
  
  process.on('beforeExit', (code) => {
    console.log(`ERROR: "vitepress-helper watch" exited with ${ code }.\n`)
  })
  
  process.on('exit', async () => {
    console.log(chalk.green('[vitepress-helper]'), chalk.gray(`unwatch > ${ input }`))
    await watcher.close()
    exec(`taskkill /PID ${ process.pid } /T /F`)
  })
  
  process.on('SIGINT', () => {
    process.exitCode = 1
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
