# @imgsplit/cli
<p style="text-align:center;" align="center">
    <picture align="center">
        <img align="center" alt="ImgSplit" width="200" src="https://imgsplit.github.io/images/cli.png" />
    </picture>
    <div align="center" style="margin-top: -20px">
        <h3>ImgSplit命令行工具</h3>
        <p>轻松分割长图</p>
    </div>
</p>

[English](./README.md)


## 安装
```bash [npm]
npm install -g @imgsplit/cli
```

## 使用
### 按高度分割
将图片按256px高度分割（输出到默认目录）：
```bash
imgsplit ./xxx.png --height 256
```
输出到指定目录：
```bash
imgsplit ./xxx.png --height 256 ./savepath/
```
### 按数量分割
将图片分割为10份（输出到默认目录）：
```bash
imgsplit ./xxx.png --count 10
```
### 自定义区域分割
使用 `x,y,width,height` 坐标定义特定区域（输出到默认目录）：
```bash
imgsplit ./xxx.png --item 0,0,512,512 --item 0,512,512,256
```
坐标示例:

`0,0,512,512`: 从左上角(0,0)开始，创建512x512的区域

`0,512,512,256`: 从(0,512)开始，创建512x256的区域


## 坐标格式说明:
`--item` 参数支持三种模式：

### 1. 垂直分割（动态高度）
`--item <y>`
- 前n-1个y值：Height = `next_y - current_y`
- 最后一个y值：Height = `total_image_height - current_y`
- 示例:  
  假设图片总高度 4096px:  
  `imgsplit ./xxx.png --item 512 --item 1024`
  
  1. 区域 1:
     - 起始: Y=512
     - 高度: 1024 - 512 = 512px
     - 覆盖 Y=512 to Y=1024
  2. 区域 2:
     - 起始: Y=1024
     - 高度: 4096 - 1024 = 3072px
     - 覆盖 Y=1024 to Y=4096
### 2. 固定高度区域
`--item <y>,<height>`

- 定义从y位置开始，指定高度的区域（使用图片完整宽度）
- 示例: `--item 200,100` → 创建从Y=200开始，高度100px的区域

### 3. 自定义矩形区域
`--item <x>,<y>,<width>,<height>`

- 定义明确坐标的矩形区域
- 示例: `--item 50,100,400,300` → 从(50,100)开始，创建400x300的区域
---

## Key Notes:

- 默认输出目录：`./${imgname}-splitted/` (自动创建)
- 支持格式：`PNG`, `JPG`（其他格式会自动保存为PNG）
- 查看完整帮助：`imgsplit --help`