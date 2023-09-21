#!/bin/bash

# Get version number
yarn release --dry-run --no-ci | grep -oP 'next release version is \K[0-9]+\.[0-9]+\.[0-9]+' > .version

VERSION=$(cat .version)

if [ -s .version ]; then
	echo "Next version: $VERSION"
	echo "PUBLIC_VERSION=$VERSION" >> $GITHUB_ENV

	cat .version | awk '{print "PUBLIC_VERSION="$1}' >> .env
else
	# Output failure reason
	yarn release --dry-run --no-ci
	echo "No new version. Canceling deploy."
fi
