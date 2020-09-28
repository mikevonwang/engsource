# Englisc

**Englisc** is a tool for extracting etymology data from Wiktionary.

Note: only the English-language Wiktionary is currently supported.

## Installation

`npm i englisc`

## Usage

1. [Download](https://dumps.wikimedia.org/enwiktionary/) an XML dump of the English-language Wiktionary. The unzipped file will be several gigabytes.
2. Run the command `npm run split PATH_TO_FILE`, with `PATH_TO_FILE` replaced by the path to the XML file you downloaded and unzipped in step 1. **Englisc** will split out each entry from the XML file into its own file under the folder `./entries`; there will be thus be nearly 800,000 files. This script will take around 20 minutes to complete, depending on your machine.
3. Run the command `npm run extract`. **Englisc** will extract etymology data from the files in `./entries`, and write them to the file `./results.json`. This file will be around 20 Mb. This step will take around 5 minutes to complete, again depending on your machine.
