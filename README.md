# @imgsplit/cli
<p style="text-align:center;" align="center">
    <picture align="center">
        <img align="center" alt="ImgSplit" width="200" src="https://imgsplit.github.io/images/cli.png" />
    </picture>
    <div align="center" style="margin-top: -20px">
        <h3>Command-line tool for ImgSplit</h3>
        <p>easily split large images</p>
    </div>
</p>

[简体中文](./README.zh-CN.md)

## Install
```bash [npm]
npm install -g @imgsplit/cli
```

## Usage
### Split by Height
Split an image into sections of 256px height (output to default directory):
```bash
imgsplit ./xxx.png --height 256
```
Specify a custom output directory:
```bash
imgsplit ./xxx.png --height 256 ./savepath/
```
### Split by Count
Divide an image into 10 equal parts (output to default directory):
```bash
imgsplit ./xxx.png --count 10
```
### Split by Custom Regions
Define specific regions using `x,y,width,height` coordinates (output to default directory):
```bash
imgsplit ./xxx.png --item 0,0,512,512 --item 0,512,512,256
```
Example coordinates:

`0,0,512,512`: Starts at top-left corner (0,0), creates a 512x512 section

`0,512,512,256`: Starts at (0,512), creates a 512x256 section


## Coordinate Format:
The `--item` flag supports three parameter patterns:

### 1. Vertical Splits with Dynamic Height
`--item <y>`
- First to second-last y: Height = `next_y - current_y`
- Last y: Height = `total_image_height - current_y`
- Example:  
  For an image with height 4096px:  
  `imgsplit ./xxx.png --item 512 --item 1024`
  
  1. Region 1:
     - Start: Y=512
     - Height: 1024 - 512 = 512px
     - Covers Y=512 to Y=1024
  2. Region 2:
     - Start: Y=1024
     - Height: 4096 - 1024 = 3072px
     - Covers Y=1024 to Y=4096
### 2. Height-Based Region
`--item <y>,<height>`

- Defines a region starting at y with the specified height (full width used).
- Example: `--item 200,100` → Creates a 100px-tall region starting at Y=200.

### 3. Custom Rectangle
`--item <x>,<y>,<width>,<height>`

- Defines a rectangle region with explicit coordinates.
- Example: `--item 50,100,400,300` → Starts at (50,100), creates a 400x300 region.
---

## Key Notes:

- Default output directory: `./${imgname}-splitted/` (automatically created if missing)
- Supported image formats: `PNG`, `JPG`. (Other formats will be automatically saved as PNG)
- Use --help to see all options:`imgsplit --help`