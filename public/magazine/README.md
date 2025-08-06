# Local Magazine Fallback Folder

This folder serves as a local fallback for magazine PDFs during development and testing.

## Usage

Place magazine PDF files in this directory for local testing when R2 is not available or for development purposes.

## File Naming Convention

Use the same naming convention as the R2 bucket:
- `spring-1997.pdf`
- `summer-1998.pdf`
- etc.

## Access

Files in this folder will be accessible at:
- `http://localhost:3000/magazine/spring-1997.pdf`

## Development

During development, you can:
1. Place test PDFs here for local testing
2. Use this folder to test the PDF viewer without uploading to R2
3. Verify OCR processing with local files

## Production

In production, this folder is not used as all PDFs are served from Cloudflare R2. 