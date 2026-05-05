#!/bin/bash
# Usage: ./scripts/archive-and-upload.sh
# Requires: Xcode signing already configured

set -e

WORKSPACE="ios/app.xcworkspace"
SCHEME="app"
ARCHIVE_PATH="build/app.xcarchive"
IPA_PATH="build/app.ipa"

echo "==> Cleaning build folder"
xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration Release clean

echo "==> Archiving"
xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration Release archive -archivePath "$ARCHIVE_PATH"

echo "==> Exporting IPA"
xcodebuild -exportArchive -archivePath "$ARCHIVE_PATH" -exportPath build/ -exportOptionsPlist scripts/exportOptions.plist

echo "==> Uploading to App Store Connect"
xcrun altool --upload-app --type ios --file "$IPA_PATH" --apiKey YOUR_API_KEY --apiIssuer YOUR_ISSUER_ID

echo "==> Done! Check TestFlight in App Store Connect."
