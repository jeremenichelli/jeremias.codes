# Shell script to subset fonts, this scripts is run manually and not during build process
# Requirements: Python 3.8, fonttools, zopfli, brotli packages

# common variables
BASE_DIR="./src/assets/fonts"
BASE_LAYOUT_FEATURES="kern,ss01"
ITALIC_LAYOUT_FEATURES="${BASE_LAYOUT_FEATURES},cv05,cv11"

UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

# subset to woff2
# pyftsubset "${BASE_DIR}/Inter-Regular.ttf" --output-file="${BASE_DIR}/Inter-Regular-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/Inter-Italic.ttf" --output-file="${BASE_DIR}/Inter-Italic-subset.woff2" --flavor="woff2" --layout-features=$ITALIC_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/Inter-Bold.ttf" --output-file="${BASE_DIR}/Inter-Bold-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/Inter-ExtraBold.ttf" --output-file="${BASE_DIR}/Inter-ExtraBold-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/Inter-Variable.ttf" --output-file="${BASE_DIR}/Inter-Variable-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/Inter-Variable-Italic.ttf" --output-file="${BASE_DIR}/Inter-Variable-Italic-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

# pyftsubset "${BASE_DIR}/SF-Pro-Text-Regular.otf" --output-file="${BASE_DIR}/SF-Pro-Text-Regular-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Text-RegularItalic.otf" --output-file="${BASE_DIR}/SF-Pro-Text-RegularItalic-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Text-Bold.otf" --output-file="${BASE_DIR}/SF-Pro-Text-Bold-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Text-Black.otf" --output-file="${BASE_DIR}/SF-Pro-Text-Black-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Text-BlackItalic.otf" --output-file="${BASE_DIR}/SF-Pro-Text-BlackItalic-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES

# pyftsubset "${BASE_DIR}/SF-Pro-Display-Regular.otf" --output-file="${BASE_DIR}/SF-Pro-Display-Regular-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Display-RegularItalic.otf" --output-file="${BASE_DIR}/SF-Pro-Display-RegularItalic-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Display-Bold.otf" --output-file="${BASE_DIR}/SF-Pro-Display-Bold-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Display-Black.otf" --output-file="${BASE_DIR}/SF-Pro-Display-Black-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES
# pyftsubset "${BASE_DIR}/SF-Pro-Display-BlackItalic.otf" --output-file="${BASE_DIR}/SF-Pro-Display-BlackItalic-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --unicodes=$UNICODES

pyftsubset "${BASE_DIR}/InterTight-Variable.ttf" --output-file="${BASE_DIR}/InterTight-Variable-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
pyftsubset "${BASE_DIR}/InterTight-Italic-Variable.ttf" --output-file="${BASE_DIR}/InterTight-Italic-Variable-subset.woff2" --flavor="woff2" --layout-features=$ITALIC_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
