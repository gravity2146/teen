function section_print {
    echo -e "$*"
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

WORKSPACE=$DIR

cd "$WORKSPACE"

# Define main variables
BUILD_DIR=$WORKSPACE/build
NODE_MODULES_DIR=$WORKSPACE/node_modules
PACKAGE_FILE=$WORKSPACE/package.json

# Clean project before build
section_print "Cleaning project folders..."
rm -Rf $BUILD_DIR
rm -Rf $NODE_MODULES_DIR

# Compile project
section_print "Compiling NodeJS source..."
npm install && npm run build
if [ $? -ne 0 ]; then
    section_print "Error compiling NodeJS source"
    exit 1
fi

# Package build output
section_print "Packaging build output..."
cp $PACKAGE_FILE $BUILD_DIR/package.json
cd "$BUILD_DIR"
npm install --production
removeNPMAbsolutePaths .
rm -R package*