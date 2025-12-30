#!/usr/bin/env tsx

/**
 * 内容一致性验证工具
 * 
 * 功能：
 * 1. 验证生成的组件文件是否存在
 * 2. 验证章节元数据是否完整
 * 3. 验证路由配置是否匹配
 * 4. 验证搜索索引是否包含所有章节
 */

import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { chaptersMetadata } from '../src/utils/chaptersMetadata'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

interface ValidationResult {
  passed: boolean
  errors: string[]
  warnings: string[]
}

/**
 * 验证生成的章节组件文件
 */
function validateGeneratedComponents(): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: []
  }
  
  const chaptersDir = join(projectRoot, 'src', 'pages', 'chapters')
  
  if (!existsSync(chaptersDir)) {
    result.passed = false
    result.errors.push('章节组件目录不存在: src/pages/chapters')
    return result
  }
  
  // 检查每个章节是否有对应的组件文件
  for (const chapter of chaptersMetadata) {
    const componentPath = join(chaptersDir, `Chapter${chapter.id}.tsx`)
    if (!existsSync(componentPath)) {
      result.passed = false
      result.errors.push(`章节 ${chapter.id} (${chapter.title}) 的组件文件不存在: Chapter${chapter.id}.tsx`)
    } else {
      // 验证组件文件内容
      try {
        const content = readFileSync(componentPath, 'utf-8')
        
        // 检查是否包含必要的导入
        if (!content.includes('import') || !content.includes('export default')) {
          result.warnings.push(`章节 ${chapter.id} 的组件文件可能格式不正确`)
        }
        
        // 检查是否包含元数据
        if (!content.includes('export const metadata')) {
          result.warnings.push(`章节 ${chapter.id} 的组件文件缺少元数据导出`)
        }
      } catch (error) {
        result.passed = false
        result.errors.push(`无法读取章节 ${chapter.id} 的组件文件: ${error}`)
      }
    }
  }
  
  return result
}

/**
 * 验证章节元数据完整性
 */
function validateMetadata(): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: []
  }
  
  for (const chapter of chaptersMetadata) {
    // 验证必需字段
    if (!chapter.title || chapter.title.trim() === '') {
      result.passed = false
      result.errors.push(`章节 ${chapter.id} 缺少标题`)
    }
    
    if (!chapter.description || chapter.description.trim() === '') {
      result.warnings.push(`章节 ${chapter.id} 缺少描述`)
    }
    
    if (chapter.path !== `/chapter/${chapter.id}`) {
      result.warnings.push(`章节 ${chapter.id} 的路径不匹配: 期望 /chapter/${chapter.id}, 实际 ${chapter.path}`)
    }
    
    if (chapter.order !== chapter.id) {
      result.warnings.push(`章节 ${chapter.id} 的 order 与 id 不匹配: order=${chapter.order}, id=${chapter.id}`)
    }
  }
  
  return result
}

/**
 * 验证路由配置
 */
function validateRoutes(): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: []
  }
  
  const appPath = join(projectRoot, 'src', 'App.tsx')
  
  if (!existsSync(appPath)) {
    result.passed = false
    result.errors.push('App.tsx 文件不存在')
    return result
  }
  
  try {
    const content = readFileSync(appPath, 'utf-8')
    
    // 检查每个章节是否有对应的路由
    for (const chapter of chaptersMetadata) {
      const routePath = `/chapter/${chapter.id}`
      if (!content.includes(`path="${routePath}"`)) {
        result.warnings.push(`章节 ${chapter.id} 的路由未在 App.tsx 中找到: ${routePath}`)
      }
      
      // 检查是否有对应的导入
      if (!content.includes(`Chapter${chapter.id}`)) {
        result.warnings.push(`章节 ${chapter.id} 的组件导入未在 App.tsx 中找到`)
      }
    }
  } catch (error) {
    result.passed = false
    result.errors.push(`无法读取 App.tsx: ${error}`)
  }
  
  return result
}

/**
 * 验证搜索索引
 */
async function validateSearchIndex(): Promise<ValidationResult> {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: []
  }
  
  try {
    const { searchIndex } = await import('../src/utils/searchIndex')
    
    // 检查每个章节是否在搜索索引中
    for (const chapter of chaptersMetadata) {
      const found = searchIndex.find(item => item.id === `chapter-${chapter.id}`)
      if (!found) {
        result.warnings.push(`章节 ${chapter.id} 未在搜索索引中找到`)
      }
    }
  } catch (error) {
    result.passed = false
    result.errors.push(`无法读取搜索索引: ${error}`)
  }
  
  return result
}

/**
 * 主验证函数
 */
async function main() {
  console.log('🔍 开始内容一致性验证...\n')
  
  const results = {
    components: validateGeneratedComponents(),
    metadata: validateMetadata(),
    routes: validateRoutes(),
    searchIndex: await validateSearchIndex()
  }
  
  let allPassed = true
  let totalErrors = 0
  let totalWarnings = 0
  
  // 汇总结果
  for (const [name, result] of Object.entries(results)) {
    console.log(`\n📋 ${name}:`)
    if (result.errors.length > 0) {
      console.log('  ❌ 错误:')
      result.errors.forEach(error => console.log(`    - ${error}`))
      allPassed = false
      totalErrors += result.errors.length
    }
    if (result.warnings.length > 0) {
      console.log('  ⚠️  警告:')
      result.warnings.forEach(warning => console.log(`    - ${warning}`))
      totalWarnings += result.warnings.length
    }
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log('  ✅ 通过')
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`\n📊 验证结果:`)
  console.log(`  总错误数: ${totalErrors}`)
  console.log(`  总警告数: ${totalWarnings}`)
  
  if (allPassed && totalWarnings === 0) {
    console.log('\n✅ 所有验证通过！')
    process.exit(0)
  } else if (allPassed) {
    console.log('\n⚠️  验证通过，但有警告')
    process.exit(0)
  } else {
    console.log('\n❌ 验证失败，请修复错误后重试')
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

