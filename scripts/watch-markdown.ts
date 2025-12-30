#!/usr/bin/env tsx

/**
 * 监听 Markdown 文件变化并自动转换
 * 
 * 功能：
 * 1. 监听 content/chapters/ 目录下的 Markdown 文件变化
 * 2. 文件变化时自动运行转换脚本
 * 3. 支持批量转换和单文件转换
 */

import { watch } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

let isConverting = false
let conversionTimeout: NodeJS.Timeout | null = null

/**
 * 运行转换脚本
 */
function runConversion() {
  if (isConverting) {
    return
  }
  
  isConverting = true
  console.log('\n🔄 检测到文件变化，开始转换...\n')
  
  const convertProcess = spawn('tsx', [join(__dirname, 'convert-markdown.ts')], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  })
  
  convertProcess.on('close', (code) => {
    isConverting = false
    if (code === 0) {
      console.log('\n✅ 转换完成！\n')
      
      // 运行索引生成
      const indexProcess = spawn('tsx', [join(__dirname, 'generate-index.ts')], {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true
      })
      
      indexProcess.on('close', (indexCode) => {
        if (indexCode === 0) {
          console.log('✅ 索引生成完成！\n')
        } else {
          console.error('❌ 索引生成失败\n')
        }
      })
    } else {
      console.error('❌ 转换失败\n')
    }
  })
}

/**
 * 防抖处理：避免频繁触发转换
 */
function debouncedConversion() {
  if (conversionTimeout) {
    clearTimeout(conversionTimeout)
  }
  
  conversionTimeout = setTimeout(() => {
    runConversion()
  }, 500) // 500ms 防抖
}

/**
 * 主函数
 */
function main() {
  console.log('👀 开始监听 Markdown 文件变化...\n')
  console.log('📁 监听目录:', join(projectRoot, 'content', 'chapters'))
  console.log('💡 按 Ctrl+C 停止监听\n')
  
  // 初始转换一次
  runConversion()
  
  // 监听 content/chapters/ 目录
  const chaptersDir = join(projectRoot, 'content', 'chapters')
  
  watch(chaptersDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
      console.log(`\n📝 检测到变化: ${filename} (${eventType})`)
      debouncedConversion()
    }
  })
  
  // 监听 content/config.yaml
  const configPath = join(projectRoot, 'content', 'config.yaml')
  watch(configPath, (eventType) => {
    console.log(`\n⚙️  配置文件变化: config.yaml (${eventType})`)
    debouncedConversion()
  })
  
  // 处理退出信号
  process.on('SIGINT', () => {
    console.log('\n\n👋 停止监听')
    if (conversionTimeout) {
      clearTimeout(conversionTimeout)
    }
    process.exit(0)
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

