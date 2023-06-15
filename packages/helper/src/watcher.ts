import chalk from 'chalk'
import { exec } from 'child_process'
import chokidar from 'chokidar'
import { Command } from 'commander'
import fs from 'fs'
import path from 'path'


const program = new Command()

const doWatch = (input: string, output: string) => {
  const pathJoin = (...paths: string[]) => paths.join('/').replace(/\/+/g, '/')
  
  const ignored = [
    '**/.vitepress/**',
    '**/dev-dist/**',
    '**/public/**',
  ]
  
  const fileWatcher = chokidar.watch(pathJoin(input, `**/*.md`), { ignored })
  const dirWatcher = chokidar.watch(input, { ignored })
  
  let isFileReady = false
  let isDirReady = false
  let timer: NodeJS.Timer | null = null
  const listener = (eventType: string) => {
    return (pathname: string) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        if (isFileReady && isDirReady) {
          const file = path.join(process.cwd(), output)
          fs.writeFileSync(
            file,
            `// event: ${ eventType }  path: ${ pathname }  ${ new Date() } `,
          )
        }
      })
    }
  }
  
  fileWatcher
    .on('ready', () => {
      isFileReady = true
    })
    .on('add', listener('add'))
    .on('unlink', listener('unlink'))
    .on('error', console.error)
  
  dirWatcher
    .on('ready', () => {
      isDirReady = true
    })
    .on('addDir', listener('addDir'))
    .on('unlinkDir', listener('unlinkDir'))
    .on('error', console.error)
  
  
  console.log(chalk.green('[vitepress-helper]'), chalk.gray(`watching > ${ input }`))
  
  process.on('beforeExit', (code) => {
    console.log(`ERROR: "vitepress-helper watch" exited with ${ code }.\n`)
  })
  
  process.on('exit', async () => {
    console.log(chalk.green('[vitepress-helper]'), chalk.gray(`unwatch > ${ input }`))
    await fileWatcher.close()
    await dirWatcher.close()
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
    const {
      dir,
      output,
    } = args
    doWatch(dir, output)
  })

program.parse(process.argv)
