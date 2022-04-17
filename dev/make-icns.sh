#!/bin/bash

ICON="./src/assets/icons/logo-green-icon-1024.png"

mkdir icon.iconset
sips -z 16 16     $ICON --out icon.iconset/icon_16x16.png
sips -z 32 32     $ICON --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     $ICON --out icon.iconset/icon_32x32.png
sips -z 64 64     $ICON --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   $ICON --out icon.iconset/icon_128x128.png
sips -z 256 256   $ICON --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   $ICON --out icon.iconset/icon_256x256.png
sips -z 512 512   $ICON --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   $ICON --out icon.iconset/icon_512x512.png
cp $ICON icon.iconset/icon_512x512.png
iconutil -c icns icon.iconset
mv icon.icns ./src/assets/icons/logo-green-icon-1024.icns
rm -R icon.iconset