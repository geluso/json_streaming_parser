// Assumptions:
// Values are either objects, arrays, or strings.
// This does not support numeric value.

const KEY_OPENING_QUOTE = 0
const KEY_CLOSING_QUOTE = 1
const VALUE_OPENING_QUOTE = 2
const VALUE_CLOSING_QUOTE = 3

const KEY = 4
const VALUE = 5

export default class StreamingJSONParser {
  parsedJson: any
  stack: any[]
  stringAccumulator: string

  // defaultJson: what to return initially before successfully parsing any JSON
  // Useful to define as an array if you are expecting to parse an array.
  constructor() {
    this.parsedJson = null
    this.stack = []
    this.stringAccumulator = ''
  }

  consume(chunk: string) {
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk.charAt(i)
      const prevChar = i > 0 ? chunk.charAt(i - 1) : ''
      const top = this.stack[this.stack.length - 1]
      if (char === '{') {
        const obj = {}
        // Keep a reference to the top-most object when we first start
        if (this.stack.length === 0) {
          console.log('ROOT OBJ')
          this.parsedJson = obj
        }
        console.log('PUSH OBJ')
        this.stack.push(obj)
      } else if (char === '}') {
        console.log('POP OBJ')
        this.stack.pop()
      } else if (char === '[') {
        console.log('PUSH ARR')
        let arr = []
        if (top && top.type && top.type === KEY) {
          const key = this.stack.pop()
          const obj = this.stack.pop()
          obj[key.keyName] = arr
          this.stack.push(obj)
        } else if (Array.isArray(top)) {
          top.push(arr)
        }
        this.stack.push(arr)
      } else if (char === ']') {
        console.log('POP ARR')
        this.stack.pop()
      } else if (char === ':') {
        // Do nothing.
        console.log('IGNORE COLON')
      } else if (char === '"' && Array.isArray(top)) {
        this.stack.push(VALUE_OPENING_QUOTE)
      } else if (char === '"' && typeof top === 'object' && !Array.isArray(top)) {
        if (top && top.type && top.type === KEY) {
          this.stack.push(VALUE_OPENING_QUOTE)
          console.log('OPEN VALUE QUOTE')
        } else {
          this.stack.push(KEY_OPENING_QUOTE)
          console.log('OPEN KEY QUOTE')
        }
      } else if (top === KEY_OPENING_QUOTE) {
        if (char === '"' && prevChar !== '\\') {
          this.stack.pop()
          this.stack.push({ type: KEY, keyName: this.stringAccumulator })
          this.stringAccumulator = ''
          console.log('CLOSE KEY QUOTE')
        } else {
          console.log('KEY ACCUM', this.stringAccumulator)
          this.stringAccumulator += char
        }
      } else if (top === VALUE_OPENING_QUOTE) {
        if (char === '"' && prevChar !== '\\') {
          // pop VALUE_OPENING_QUOTE
          this.stack.pop()
          
          const current = this.stack.pop()
          if (Array.isArray(current)) {
            current.push(this.stringAccumulator)
            this.stack.push(current)
          } else if (current && current.type && current.type === KEY) {
            const obj = this.stack.pop()
            obj[current.keyName] = this.stringAccumulator
            this.stack.push(obj)
          }
          this.stringAccumulator = ''
          console.log('CLOSE VALUE QUOTE')
        } else {
          console.log('VALUE ACCUM', this.stringAccumulator)
          this.stringAccumulator += char
        }
      } else if (top && top.type && top.type === KEY) {
        if (char === '"' && prevChar !== '\\') {
          console.log('OPEN VALUE QUOTE')
          this.stack.push(VALUE_OPENING_QUOTE)
        }
      } else if (top === VALUE_OPENING_QUOTE) {
        // Is this a closing quote?
        if (char === '"' && prevChar !== '\\') {
          console.log('CLOSE VALUE QUOTE')
          // pop off VALUE_OPENING_QUOTE
          this.stack.pop()

          // pop off KEY
          const key = this.stack.pop()

          // pop off the top-most object
          const obj = this.stack.pop()
          obj[key.keyName] = this.stringAccumulator
          
          // put the object back on top of the stack
          this.stack.push(obj)

          // reset string accumulator
          this.stringAccumulator = ''
        } else {
          console.log('NO MATCH')
          this.stringAccumulator += char
        }
        console.log(char, this.parsedJson)
      }
    }
  }
}