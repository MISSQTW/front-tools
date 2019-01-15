/*
 * @Author: shayne
 * @Date: 2019-01-11 16:17:32
 * @LastEditors: shayne
 * @LastEditTime: 2019-01-15 21:21:20
 * @Desc: 命令行生成vue文件
 * 首先在package.json的scripts里添加 "init": "node generate.js"命令或者直接使用node generate
 * 再在此文件的allDirPath对象添加目录名，然后在命令行指定要在哪个目录下生成文件 
 * 然后后在src下手动写一个vue模板文件
 * 最后可运行如下命令生成vue文件
 * npm run init [dir] [filename]/node generate [dir] [filename]
 * dir: 要生成文件所在的目录，默认是在src/pages下
 * filename： 要生成文件的文件名，可不带后缀名
 */

const path = require('path');
const fs = require('fs-extra'); // 是fs的一个扩展库，需要安装
// argv[0]是node的路径
// argv[1]是此文件的路径
// 接下来就是我们需要的参数argv[2],argv[3]
const argv = process.argv;
const argv2 = argv[2]; // 常规情况是代表的目录名
const argv3 = argv[3]; // 常规情况是代表的文件名
const srcDefault = 'src'; // 默认是在src目录下
const suffixArr = [/.js$/, /.vue$/]
// 用来管理pages目录下的所有目录，以方便命令行生成vue模板文件
const allDirPath = {
    c: 'components',
    p: 'pages',
    r: 'router'
}
let fileName = 'index.vue' // 文件名，默认为index
let dirPath = allDirPath.p // 目录名,默认是src下的pages目录

/**
 * 先判断argv3参数是否存在，不存在
 * 则判断argv2参数是否能匹配到allDirPath的目录，不能则作为文件名，
 * 文件都得判断一下后缀，默认添加vue后缀，其他后缀的则会创建一个空文件
 */
if (argv3) {
    dirPath = allDirPath[argv2]
    fileName = initVueFileName(argv3)
} else if (argv2) {
    if (allDirPath[argv2]) {
        dirPath = allDirPath[argv2]
    } else {
        fileName = initVueFileName(argv2)
    }
}

const fileExists = fs.existsSync(pathResolve(fileName, dirPath))
if (fileExists) {
    const paths = dirPath.split('/')
    console.error(`${paths[paths.length - 1]}目录下已存在${fileName}`)
} else {
    if (/.vue$/.test(fileName)) {
        fs.copy(pathResolve('template.vue'), pathResolve(fileName, dirPath), (err) => {
            if (err) throw err;
            console.info(`${fileName} 文件 已在${dirPath}目录下初始化完毕`)
        })
    } else {
        fs.writeFile(pathResolve(fileName, dirPath), '', 'utf8', err => {
            if (err) throw err;
            console.info(`${fileName} 文件 已在${dirPath}目录下初始化完毕`)
        })
    }
}

/**
 * @desc: 生成vue文件的路径
 */
function pathResolve(filePath, dirPath) {
    if (dirPath) {
        return path.resolve(__dirname, srcDefault, dirPath, filePath)
    }
    return path.resolve(__dirname, srcDefault, filePath)
}

/**
 * @desc: 判断参数文件名是否带指定类型的后缀
 */
function isFileSuffix (fileName) {
    return suffixArr.some(suffix => suffix.test(fileName))
}

/**
 * @desc: 格式化文件名
 */
function initVueFileName (fileName) {
    if (!isFileSuffix(fileName)) {
        return fileName + '.vue'
    } 
    return fileName
}
