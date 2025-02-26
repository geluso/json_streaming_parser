# JSON Streaming Parser
Working on a JSON parser that builds JSON as it arrives character by character.
It builds the object, and arrays as it parses each character.

This is especially useful when reading streamed JSON from a slow steam like a
streamed response from a LLM.

Surely someone else must have built something like this already?!

Very unstable. Proof of concept. `StreamingJSONParserBeta` is the more
successful second attempt.

```
ROOT OBJ
PUSH OBJ
{ {}
OPEN KEY QUOTE
" {}
KEY ACCUM
a {}
CLOSE KEY QUOTE
" {}
IGNORE COLON
: {}
PUSH ARR
[ { a: [] }
" { a: [] }
VALUE ACCUM
c { a: [] }
VALUE ACCUM c
a { a: [] }
VALUE ACCUM ca
t { a: [] }
CLOSE VALUE QUOTE
" { a: [ 'cat' ] }
POP ARR
] { a: [ 'cat' ] }
POP OBJ
} { a: [ 'cat' ] }
```

