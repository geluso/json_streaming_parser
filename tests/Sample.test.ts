import StreamingJSONParserAlpha from "../src/StreamingJSONParserAlpha";
import StreamingJSONParserBeta from "../src/StreamingJSONParserBeta";

function doTest(stream: string, expected: any) {
   test(stream, () => {
      const ss = new StreamingJSONParserAlpha()
      ss.consume(stream)
      const json = ss.toJson()
      expect(json).toEqual(expected)
   })
}

// doTest('', {})
// doTest('{', {})
// doTest('{}', {})
// doTest('{"', {})
// doTest('{"a', {})
// doTest('{"a"', {})
// doTest('{"a":', {})
// doTest('{"a":9', {"a": 9})
// doTest('{"a":9,', {"a": 9})

test("nested arrays", () => {
   const ss = new StreamingJSONParserBeta()
   const json = '{"a":[[[[]]]]}'
   for (let i = 0; i < json.length; i++) {
      const char = json.charAt(i)
      ss.consume(char)
   }
   expect(ss.parsedJson).toEqual({a: [[[[]]]]})
})

test("object with array with string", () => {
   const ss = new StreamingJSONParserBeta()
   const json = '{"a":["cat"]}'
   for (let i = 0; i < json.length; i++) {
      const char = json.charAt(i)
      ss.consume(char)
      console.log(char, ss.parsedJson)
   }
   expect(ss.parsedJson).toEqual({a: ["cat"]})
})

test("object with two keys", () => {
   const ss = new StreamingJSONParserBeta()
   const json = '{"a":["cat"], "b": "far"}'
   for (let i = 0; i < json.length; i++) {
      const char = json.charAt(i)
      ss.consume(char)
      console.log(char, ss.parsedJson)
   }
   expect(ss.parsedJson).toEqual({a: ["cat"], b: "far"})
})

test("object with array with string", () => {
   const ss = new StreamingJSONParserBeta()
   const json = '{"a":["cat", "mall", "far", "bar", "long long long long long string"]}'
   for (let i = 0; i < json.length; i++) {
      const char = json.charAt(i)
      ss.consume(char)
      console.log(char, ss.parsedJson)
   }
   expect(ss.parsedJson).toEqual({"a":["cat", "mall", "far", "bar", "long long long long long string"]})
})