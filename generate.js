const fs = require('fs')
const path = require('path')
const marked = require('marked') //markdown解析
const hljs = require('highlight.js') //高亮代码库
marked.setOptions({
  highlight: function(code) {
    return hljs.highlightAuto(code).value
  }
})

const summary_file_name = 'uniapp-directory.json'
const doc_base_dir = 'uniapp-doc'

const summary_json = JSON.parse(fs.readFileSync(path.join(__dirname, summary_file_name), { encoding: 'utf-8' }))
let indexes = []
for (let chapter_name in summary_json) {
  sections = summary_json[chapter_name]
  for (let section_name in sections) {
    section_path = sections[section_name]
    const markdownContent = fs.readFileSync(path.join(doc_base_dir, section_path), { encoding: 'utf-8' })
    const html = `<!DOCTYPE html><html lang="zh_CN"><head><meta charset="UTF-8"><title></title><link rel="stylesheet" href="doc.css" /></head>
    	<body><div class="markdown-body">${marked(markdownContent)}</div></body></html>`
    fs.writeFileSync(path.join(__dirname, 'public', 'command', chapter_name.replace('/', ' ') + ' - ' + section_name.replace('/', ' ') + '.html'), html)
    indexes.push({
      "t": chapter_name + "/" + section_name, //Title 定义标题格式
      "d": markdownContent.replace(/#/g, ''), //Describe 描述
      "p": path.join('command', chapter_name.replace('/', ' ') + ' - ' + section_name.replace('/', ' ') + '.html') //Article 文章内容
    })
  }
}
fs.writeFileSync(path.join(__dirname, 'public', 'index.json'), JSON.stringify(indexes))