#!/bin/bash

# bog video sticker fun

# $1 - rand(0,360)
# $2 - date (mm-dd-yy)
# $3 - username
# $4 - timestamp

convert -delay 10 \
  -loop 0 \
  -ordered-dither o8x8,8,8,4 \
  ./stickers/$4/*.jpg \
  ./stickers/$4/sticker.gif
  
mv ./stickers/$4/sticker.gif ./stickers/$4.gif
rm -rf ./stickers/$4

# random picture frame color
convert ./stickers/overlay.png \
  -background none \
  -modulate 100,100,$1 \
  ./stickers/$4overlaycolor.png

# date in bottom right corner
convert -background none \
  -fill '#FFABA7' \
  -font DSEG7-Modern-Mini-Bold-Italic \
  -size 100x30 \
  -pointsize 9 \
  label:$2 \
  ./stickers/$4date.png   

# username in bottom left corner
convert \( \
    -size 100x30 \
    -background none \
    -fill "cyan" \
    -font Comic-Sans-MS-Bold \
    -pointsize 12 label:"$3" \
  \) \
  \( \
    -clone 0 \
    -background black \
    -shadow 50x1+1+1 \
  \) \
  -reverse \
  -background none \
  -layers merge \
  -modulate 100,100,$1 \
  ./stickers/$4name.png

# merge
convert ./stickers/$4.gif \
  -background none \
  -modulate 100,175,100 \
  -gravity center \
  -extent 150x115 \
  -draw "Image Over 0,0 0,0 stickers/$4overlaycolor.png" \
  -draw "Image Screen 54,50 100,30 stickers/$4date.png" \
  -draw "Image Over -10,50 100x30 stickers/$4name.png" \
  -gravity east -chop 6x0 \
  -gravity south -chop 0x5 \
  -gravity north -chop 0x4 \
  -gravity west -chop 7x0 \
  ./stickers/$4sticker.gif

# cleanup
rm ./stickers/$4.gif
rm ./stickers/$4date.png
rm ./stickers/$4name.png
rm ./stickers/$4overlaycolor.png

mv ./stickers/$4sticker.gif ~/bogimage/img/stickers/$4.gif