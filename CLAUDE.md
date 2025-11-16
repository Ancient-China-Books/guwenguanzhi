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
4. **Language Style**: Translations MUST use Simplified Chinese (简体中文) and pursue accuracy, faithfulness, and elegance (信达雅), conforming to modern Chinese conventions. Use modern vernacular Chinese (现代白话文) and avoid mixing classical Chinese expressions. Use `opencc -c t2s` command to verify that all translation text is in simplified Chinese
5. **Formatting**: Book titles, place names, and person names should use proper symbols, with consistent typography formatting
6. **Source Preservation**: Never modify the original text (even if the original text contains errors; if there are questions or unclear parts, ask the user)
7. **Paragraph Structure**: Do not modify the original paragraph formatting and structure
8. **Blockquote Removal**: Before translating, if there are blockquote tags in the HTML, these tags should be removed and replaced with regular paragraph (`<p>`) tags
9. **Translation Quality**: Think carefully and thoroughly when translating - consider context, meaning, and appropriate modern Chinese expressions
10. **Jiazhu Exclusion (CRITICAL)**: NEVER translate jiazhu (annotation) content marked with `class="zhu"` or `class="kindle-cn-para-left"`. These are scholarly annotations and commentary that must remain in original form. Always identify and exclude this content BEFORE beginning translation work.
11. **Quality Control (MANDATORY)**: After completing the translation, you MUST perform a secondary review to verify that the original text and translation match properly. Check for:
    - Accuracy of meaning and context
    - Proper rendering of specialized terms and names
    - Consistency with translation guidelines
    - Any mismatched or missing content
12. **Punctuation**: Translations MUST use punctuation exactly as it appears in the original text (翻译使用的标点符号悉遵原文). This includes:
    - Chinese quotation marks: Use 「」 (not "" or "")
    - Chinese period: Use 。 (not .)
    - Chinese comma: Use ， (not ,)
    - Chinese book title marks: Use 《》 (not italics or other formatting)
    - Chinese enumeration comma: Use 、 (not ,)
    - Chinese semicolon: Use ； (not ;)
    - Chinese colon: Use ： (not :)
    - Chinese question mark: Use ？ (not ?)
    - Chinese exclamation mark: Use ！ (not !)
    - DO NOT mix Chinese and Western punctuation marks in the same text
13. **Font Subsetting (MANDATORY)**: After translating any HTML files, you MUST ALWAYS execute the following command to regenerate the subset font: `cat OEBPS/Text/*.html | pyftsubset ~/.local/share/fonts/ttf/Noto/NotoSerifSC-Medium.ttf --text-file=/dev/stdin --output-file=OEBPS/Fonts/NotoSerifSC-Medium.otf`. This step is REQUIRED and must not be skipped. After running this command, commit the updated font file along with the translation.

## Translation Workflow (MUST FOLLOW)

When asked to translate any HTML file, follow this strict workflow:

### Phase 1: Pre-Translation Analysis (MANDATORY)
1. **Read the HTML file** to understand overall structure and content
2. **Identify annotation content** using Grep tool to find ALL instances of:
   - `class="zhu"` (classical annotations)
   - `class="kindle-cn-para-left"` (commentary content)
3. **Mark these as "DO NOT TRANSLATE"** - create a mental/written list of content to exclude
4. **Identify translatable paragraphs** - only content in regular `<p class="calibre5">` tags without annotation classes

### Phase 2: Translation Execution
5. **Translate only the identified translatable content** following all translation guidelines
6. **Skip all annotation content** identified in Phase 1 - do not translate anything marked with excluded classes
7. **Add translations as independent paragraphs** with `<p class="translation">` class
8. **CRITICAL - Use Edit Tool Only & Git Diff Requirement**:
   - **ALWAYS use the Edit tool** to insert translation paragraphs, one paragraph at a time
   - **NEVER use the Write tool** - it will cause the entire file to show as modified in git diff
   - **Git diff MUST only show additions (+ lines)** - no modifications to existing lines allowed
   - For files with multiple paragraphs:
     * Insert translations sequentially using multiple Edit tool calls
     * Match the transition between paragraphs (end of one `</p>` and start of next `<p class="calibre5">`)
     * Insert new `<p class="translation">` between them
   - If Edit matching fails:
     * Try shorter matching strings (e.g., just the paragraph boundary)
     * Try matching just `</p>\n<p class="calibre5">` pattern
     * **DO NOT switch to Write tool** under any circumstances
   - The `old_string` should be the transition point between paragraphs
   - The `new_string` should be the same transition plus the new `<p class="translation">` paragraph inserted between
   - This ensures zero modification to original text - only pure insertions

### Phase 3: Quality Control & Finalization
9. **MANDATORY Secondary Review**: Verify that:
   - No annotation content (`class="zhu"` or `class="kindle-cn-para-left"`) was translated
   - All regular paragraphs have accurate translations
   - Translation quality meets all guidelines
10. **Verify Git Diff (CRITICAL)**: Run `git diff OEBPS/Text/[filename].html` to confirm:
   - Only `+` lines (additions) appear in the diff
   - No `-` lines (deletions) or modified lines
   - If any modifications appear, the Edit approach failed - debug and fix before proceeding
11. **Run font subsetting command**: `cat OEBPS/Text/*.html | pyftsubset ~/.local/share/fonts/ttf/Noto/NotoSerifSC-Medium.ttf --text-file=/dev/stdin --output-file=OEBPS/Fonts/NotoSerifSC-Medium.otf`
12. **Commit one by one**: When translating multiple HTML files, commit each file separately after completing its translation and font subsetting. Each commit should include both the translated HTML file and the updated font file.

**CRITICAL**: Phase 1 annotation identification is MANDATORY and must be completed before any translation work begins. Failure to follow this workflow may result in incorrect translation of annotation content.

13. **Commit Strategy (IMPORTANT)**:
    - **For single file translation**: Make ONE commit after completing all work (translation, quality review, git diff verification, and font subsetting)
    - **For multiple file translations**: Commit ONE BY ONE - complete the full workflow for each file (translation → quality review → git diff verification → font subsetting → commit) before moving to the next file
    - **DO NOT** use a single commit for all files when translating multiple HTML files
    - Each commit should include both the translated HTML file and the updated font file

14. **Push to Remote (POLITE INQUIRY)**: After successfully creating the local commit, politely ask the user if they would like to push the changes to the remote repository. Do not push automatically. Use a friendly tone such as: "Translation completed and committed successfully! Would you like me to push these changes to the remote repository?"
