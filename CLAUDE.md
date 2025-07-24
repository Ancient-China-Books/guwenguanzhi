# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an EPUB e-book project for "古文觀止", a classical Chinese bibliography text. The repository contains a complete EPUB structure with HTML content, CSS styling, fonts, and images.

## Repository Structure

- `META-INF/` - EPUB metadata and container configuration
- `OEBPS/` - Main EPUB content directory
  - `Text/` - HTML chapter files (numbered 0000101.html to 0086802.html)
  - `Styles/` - CSS stylesheets and JavaScript for styling and navigation
  - `Fonts/` - Chinese fonts (FSung series and Noto Serif SC)
  - `Images/` - Book illustrations and diagrams
  - `content.opf` - EPUB package file (large, contains all content metadata)
  - `toc.ncx` - Navigation control file for table of contents
- `README.md` - Project description
- `index.html` - Web version index file
- `mimetype` - EPUB mime type specification

## Build Commands

### Build EPUB files
```bash
# Build vertical (traditional) layout EPUB
zip -r sikutiyao-vst.epub META-INF mimetype OEBPS

# Build horizontal layout EPUB
sed -i 's/vertical-rl/horizontal-tb/g' OEBPS/Styles/*.css
sed -i 's/page-progression-direction="rtl"/page-progression-direction="ltr"/g' OEBPS/content.opf
zip -r sikutiyao.epub META-INF mimetype OEBPS
```

### Development setup
```bash
# Install required tools
sudo apt-get install -y zip

# Validate EPUB structure
unzip -t sikutiyao.epub
```

## Content Architecture

- **HTML Structure**: Each chapter is a separate HTML file with XHTML 1.1 formatting
- **CSS Styling**:
  - `stylesheet.css` - Main typography and layout styles
  - `page_styles.css` - Page-specific styling
  - Supports both vertical (traditional Chinese) and horizontal reading modes
- **JavaScript**: `main.js` provides highlighting functionality for cross-references
- **Fonts**: Custom Chinese fonts included for proper character rendering

## Text Direction Support

The project supports both reading directions:
- **Vertical (竪排)**: Traditional Chinese vertical right-to-left layout
- **Horizontal (橫排)**: Modern horizontal left-to-right layout

Layout switching is handled via CSS `writing-mode` property changes during build.

## CI/CD

- **GitHub Actions**: Automated EPUB building on push to master
- **GitLab CI**: Alternative CI pipeline for GitLab hosting
- Builds create both vertical and horizontal layout EPUBs
- Automatic releases published to GitHub Releases

## Content Editing

When editing content:
- HTML files are in `OEBPS/Text/` directory
- Maintain XHTML 1.1 compliance
- Use `.jiazhu` class for annotations (blue text)
- Use `.jiaozhusup` class for superscript notes (red text)
- Images should be referenced from `../Images/` relative path

## File Size Considerations

- `content.opf` and `toc.ncx` are very large files (1-2MB)
- Use grep or limit parameters when reading these files
- HTML text files are reasonably sized and can be read normally

## Translation Guidelines

When translating content for this project:
0. **HTML Structure**: Translation content should be added as an independent paragraph `<p class="translation">` immediately after the original paragraph, not included within the original paragraph's `<p>` tag
1. **Translation Placement**: Translations should be placed paragraph by paragraph after each original paragraph, using orange/brown text color as shown in the reference image
2. **Font Size**: Translation text should be one size smaller than the original text
3. **Style Consistency**: Translation styles should be unified through CSS modifications in `OEBPS/Styles/` directory, with HTML files in `Text/` directory referencing these styles
4. **Language Style**: Translations should use Simplified Chinese and pursue accuracy, faithfulness, and elegance (信达雅), conforming to modern Chinese conventions. Use modern vernacular Chinese (现代白话文) and avoid mixing classical Chinese expressions
5. **Formatting**: Book titles, place names, and person names should use proper symbols, with consistent typography formatting
6. **Source Preservation**: Never modify the original text (even if the original text contains errors; if there are questions or unclear parts, ask the user)
7. **Paragraph Structure**: Do not modify the original paragraph formatting and structure
8. **Blockquote Removal**: Before translating, if there are blockquote tags in the HTML, these tags should be removed and replaced with regular paragraph (`<p>`) tags
9. **Translation Quality**: Think carefully and thoroughly when translating - consider context, meaning, and appropriate modern Chinese expressions
10. **Jiazhu Exclusion**: Do not translate jiazhu (annotation) content marked with `class="jiazhu"`
11. **Quality Control (MANDATORY)**: After completing the translation, you MUST perform a secondary review to verify that the original text and translation match properly. Check for:
    - Accuracy of meaning and context
    - Proper rendering of specialized terms and names
    - Consistency with translation guidelines
    - Any mismatched or missing content
12. **Font Subsetting (MANDATORY)**: After translating any HTML files, you MUST ALWAYS execute the following command to regenerate the subset font: `cat OEBPS/Text/*.html | pyftsubset ~/.local/share/fonts/ttf/Noto/NotoSerifSC-Medium.ttf --text-file=/dev/stdin --output-file=OEBPS/Fonts/NotoSerifSC-Medium.otf`. This step is REQUIRED and must not be skipped. After running this command, commit the updated font file along with the translation.

## Translation Workflow (MUST FOLLOW)

When asked to translate any HTML file:
1. Translate the content following the guidelines above
2. **MANDATORY**: Perform secondary review to verify original text and translation match properly
3. Commit the translated HTML file
4. **IMMEDIATELY** run the font subsetting command: `cat OEBPS/Text/*.html | pyftsubset ~/.local/share/fonts/ttf/Noto/NotoSerifSC-Medium.ttf --text-file=/dev/stdin --output-file=OEBPS/Fonts/NotoSerifSC-Medium.otf`
5. Commit the updated font file
6. Push all changes to remote

**IMPORTANT**: Both the quality control review and font subsetting steps are NOT OPTIONAL and must be completed for every translation task.
