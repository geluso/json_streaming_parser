export default class StreamingJSONParserAlpha {
  parsedJson: any
  buffer: string
  stack: string[]

  // defaultJson: what to return initially before successfully parsing any JSON
  // Useful to define as an array if you are expecting to parse an array.
  constructor(defaultJson: any = {}) {
    this.parsedJson = defaultJson
    this.buffer = ''
    this.stack = []
  }

  consume(chunk: string) {
    this.buffer += chunk
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk.charAt(i)
      const top = this.stack[this.stack.length - 1]
      if (char === '"' && top === '"') {
        this.stack.pop()
      } else if ("[{".includes(char)) {
        this.stack.push(char)
      } else if (char === '"') {
        this.stack.push(char)
      } else if (char === "]" && top === "[") {
        this.stack.pop()
      } else if (char === "}" && top === "{") {
        this.stack.pop()
      } else if (char === '"' && top === '"') {
        this.stack.pop()
      }
    }
  }

  toJson() {
    let tail = ""
    if (this.buffer.length === 0) return {}
    while (this.stack.length > 0) {
      const top = this.stack.pop()
      if (top === '"') {
        tail += '"' 
      } else if (top === '[') {
        tail += ']' 
      } else if (top === '{') {
        tail += '}' 
      }
    }
    let json = this.buffer + tail
    console.log({tail, json})
    try {
      this.parsedJson = JSON.parse(json)
      return this.parsedJson
    } catch (e) {
      // If there was a problem parsing the JSON then return the previously parsed JSON
      return this.parsedJson
    }
  }
}