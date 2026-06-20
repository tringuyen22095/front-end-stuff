**Task1: Build simple JS/HTML**

**Description**

As a senior fullstack developer, I want to build JS & HTML files, which following these require:
* JS service:
  * seperately file
  * expose method that have:
    * parameter: string `filePath` & string `regex`
    * return: none
    * purpose: base on `regex`, service will track is there any match HTML tag, and then expose point xml attribute that i mention in `regex`
    * what it does:
      1. read content following `filePath`, always is XML template, special is HTML page
      2. scan through file content and find all tag that match `regex` that I input
      3. write down all match value above and store it into a txt file in same baseDir
* HTML page:
  * simple page, with bootstrap5 css
  * integrate JS service above
  * have `input` type file and `input` type text for regular exception input
  * Next button which will execute expose method from JS service, and put value of 2 textField above
  * (bonus) have a loading spinner to annouce user that service is in process is an advantage
  * embed bootstrap5 style as simple form controller, and align as center middle of screen

**Acceptance Criteria**

* HTML file can easy open seperately in browser
* scenario yourself test case in reality, build sample html file, which have at least 5 `img` tags (same class attribute, different src) and a lot of tags (div, p, li, ul). Then build sample regex that found all img with same class, and after JS service hit, all 5 `src` must be written down into txt file in baseDir
