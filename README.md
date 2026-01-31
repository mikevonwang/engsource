# Engsource

**Engsource** is a tool for extracting the most recent etymologic source (besides Middle English) of every word in Modern English from Wiktionary.

## Installation

Engsource is written in Javascript, so you will need to have Node and npm already installed on your machine.

1. Clone the Engsource repository: `git clone https://github.com/mikevonwang/engsource.git`.
2. Run `npm install`.

## Usage

The main workflow for using Engsource is split into two different scripts; a slow one that needs to be run only once, and a faster one that performs the actual extraction.

1. [Download](https://dumps.wikimedia.org/enwiktionary/) an XML dump of the page contents of the English-language Wiktionary. Look for the file whose name contains the string "pages-meta-current". The unzipped file will be several gigabytes.
2. Run the command `npm run split PATH_TO_FILE`, with `PATH_TO_FILE` replaced by the path to the XML file you downloaded and unzipped in step 1. Engsource will split out each Wiktionary entry from the XML file into its own file under the folder `./entries`; there will be thus be nearly 800,000 files. This step will take around 30 minutes to complete, depending on your machine.
3. Run the command `npm run extract`. Engsource will extract etymology data from the files in `./entries`, and write them to the file `./results.json`. This file will be around 20 MB. This step will take around 3 minutes to complete, again depending on your machine.

## Schema of Results

The file `./results.json` contains a single root object. Every key in this object is the title of an entry from Wiktionary. The value of every key is another object that contains one of two possible keys: `ety` or `lemma`.

If the key is `ety`, then the value of that key is the most recent etymologic source of that word besides Middle English. These values will be a [two- or three-letter code](https://en.wiktionary.org/wiki/Wiktionary:List_of_languages) from Wiktionary's language list.

If the key is `lemma`, then the value of that key is a potential lemma form of that entry, e.g. the lemma form of "running" is "run". Search through the root object for a key that matches this value to find the entry's etymology. These potential lemmas may be chained; to find the etymology of a particular word, you may have to go through several objects with a `lemma` key before arriving at one with an `ety` key.

## Features

### Ignoring Middle English

As previously stated, Engsource ignores Middle English as a potential etymologic source. A vast number of words in Modern English descend straight from words in Middle English, and it is more interesting to examine the ancestry of the Middle English word.

### Compound words

When extracting the etymology of a compound word, Engsource looks at the [head](https://en.wikipedia.org/wiki/Head_(linguistics)) of the compound word in question. For example, when extracting the etymology of the compound word "birdsong", Engsource will return a `lemma` of "song", since a "birdsong" is a type of "song", and not a type of "bird".

## Testing

Run `npm test PAGE_ID` to test the subroutines used in the `npm run extract` script, with `PAGE_ID` replaced with the Wiktionary Page ID of the entry you wish to examine (this ID can be found by going to a particular entry's Wiktionary page and clicking the "Page Information" link in the left-hand sidebar).

## In The Wild

The etymology tool [englisc.mikeahlgrim.com](https://englisc.mikeahlgrim.com) uses Engsource for its etymologic data.
