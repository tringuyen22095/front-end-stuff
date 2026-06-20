# Task2: Enhance mechanism

## Description

From current version, I want to enhance with following requirement below:

- User can choose multi file
- Have `copy to clipboard` button on result textarea to easily to copy it. the button shall be placed next to `download output.txt` button
- Have optional check box to adding `prefix` on every expose line (prefix) + expose src link. Ex: prefix is `google.com`, expsose link is `/static/abc`, then final outcome is `google.com/static/abc`
- When `prefix` checkbox hit, show an autocomplete text field next to it. which user can choose, or type to filter out options, if not exist, then use exact what user input

## Design:

[input type='file'] (allow to choose multi)

[input type='text'] (regex)

[input type='text'] (attribute)

[input type='checkbox'] [input type='text'] (new, input on the left just show only when checkbox was marked)

[combobox] (expose mode)

[textarea] (include `copy to clipboard` button)

## Acceptance Criteria:

- for list recommend of auto complete text field, it should be stored in local storage of browser
- initialize with [https://xx.knit.bid/]  as first item of the array, stored as JSON
- when user input something new, that new value after user hit `next` button. it must be stored in array json above, in local storage
- if index.html open. if there are no array JSON store in local storage, then write it down with initialize value.
- if checkbox marked, and upcomming text field is empty, not count space only. Then add that text as prefix on every line found base on regex. and please .trim() that text, before adding into expose result
- do same mechanism, found out match html tag base on regex, and do same for all choose files