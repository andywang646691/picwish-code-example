import * as fs from 'node:fs'
import jetpack from "fs-jetpack";

const apis = [
    '抠图',
    '证件照',
    '图片压缩',
    '黑白图像上色',
    '图片变清晰',
    '图像修复',
    '图片智能切边',
    'OCR 服务'
]

const callTypes = [
    '异步',
    '同步',
    '回调'
]

const exampleTypes = [
    'file',
    'url'
]

const getDocUrls = () => {
    const result = []
    for (let api of apis) {
        for (let callType of callTypes) {
            for (let exampleType of exampleTypes) {
                if (api.includes('OCR') && callType === '同步') {

                } else {
                    result.push(`${api}-${callType}-${exampleType}.md`)
                }
            }
        }
    }
    return result
}

const docUrls = getDocUrls()
docUrls.forEach(url => {
    jetpack.file(`src/${url}`)
})
console.log(`文件生成成功： api ${apis.length}个`)

