# Duplicate File Finder

Duplicate File Finder is a Node.js script that helps you find and manage duplicate files across multiple directories.

## Features

- Scan multiple directories for duplicate files
- Calculate file hashes using SHA256 for accurate comparison
- Option to delete duplicate files interactively

## Prerequisites

- Node.js (version 20.0.0 or higher)

## Installation

1. Clone this repository or download the script:

   ```sh
   git clone https://github.com/Cylecq/duplicate-file-finder.git
   ```

2. Navigate to the project directory:

   ```sh
   cd duplicate-file-finder
   ```

## Usage

Run the script using Node.js:

    npm start

Follow the prompts to:

1. Enter directories to scan (separated by commas)
2. Choose whether to enable file deletion
3. If deletion is enabled, select which duplicate files to remove

## Example

    $ npm run start
    Enter directories to scan, separated by commas: /path/to/dir1, /path/to/dir2
    Scanning directories: [ '/path/to/dir1', '/path/to/dir2' ]
    Do you want to enable file deletion after the scan? (yes/no): yes

    Duplicate group:
    1: /path/to/dir1/file1.txt
    2: /path/to/dir2/file1_copy.txt
    Enter the numbers of the files to delete, separated by commas (or leave blank to keep all): 2
    Deleted file: /path/to/dir2/file1_copy.txt

## Caution

- Always backup your data before using any tool that can delete files.
- Review the files carefully before confirming deletion.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/Cylecq/duplicate-file-finder/issues) if you want to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
