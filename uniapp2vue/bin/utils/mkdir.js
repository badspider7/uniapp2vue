const fs = require('fs-extra')
const path = require('path')

//获取到项目的文件夹路径
const basicProjectPath = __dirname.split('\\node_modules')[0];

const spliceLength = basicProjectPath.lastIndexOf('\\');
const newDirPath = basicProjectPath.slice(0, spliceLength); //新文件夹的上一级的路径
const projectName = basicProjectPath.slice(basicProjectPath.lastIndexOf('\\')+1); //项目文件夹名字
const copyProjectName = `${projectName}_backup`; //拷贝文件夹

//忽略掉的文件
const removeDir = ['node_modules'];
//不需要放到src中的文件
const srcIgnoreFile = ['.svn', '.gitignore', '.git', 'package.json', 'package-lock.json', 'Readme.md','readme.md'];

//创建新文件夹
fs.ensureDir(path.join(newDirPath,copyProjectName)).then(() => {
        console.log('创建新文件夹成功，路径为：',path.join(newDirPath,copyProjectName))
    }).catch((err) => {
        console.log('创建新文件夹失败，错误信息：',err)
    })

//过滤掉不在src中的文件
function ignoreDir(src, dest) {
    for (let i = 0; i < srcIgnoreFile.length; i++){
        if (src.indexOf(srcIgnoreFile[i]) > -1) {
            return false
        }
    }
    if(src.indexOf('node_modules') > -1) return false
    return true
}

//把之前过滤掉的文件放入新的文件夹
function inIgnoreFile(src, dest) {
    for (let i = 0; i < srcIgnoreFile.length; i++){
        if (src.indexOf(srcIgnoreFile[i]) == -1) {
            console.log(srcIgnoreFile[i])
            return false
        }
    }
    return true
}


//把原来项目中的文件都转移到src中，除了node_modules
fs.copy(basicProjectPath, path.join(newDirPath, copyProjectName,'src'), { filter: ignoreDir }, err => {
    if(err) console.error('err',err)
})

//把之前漏掉的文件移动到新文件夹中
fs.copy(basicProjectPath, path.join(newDirPath, copyProjectName), { filter: inIgnoreFile }, err => {
    if(err) console.error('err',err)
})


