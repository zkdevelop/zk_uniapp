import "./chunk-TDUMLE5V.js";

// E:/代码/new/zk_uniapp/node_modules/livekit-client/dist/livekit-client.esm.mjs
function _mergeNamespaces(n, m) {
  m.forEach(function(e2) {
    e2 && typeof e2 !== "string" && !Array.isArray(e2) && Object.keys(e2).forEach(function(k) {
      if (k !== "default" && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e2, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e2[k];
          }
        });
      }
    });
  });
  return Object.freeze(n);
}
var e = Object.defineProperty;
var h = (i, s, t) => s in i ? e(i, s, {
  enumerable: true,
  configurable: true,
  writable: true,
  value: t
}) : i[s] = t;
var o = (i, s, t) => h(i, typeof s != "symbol" ? s + "" : s, t);
var _ = class {
  constructor() {
    o(this, "_locking");
    o(this, "_locks");
    this._locking = Promise.resolve(), this._locks = 0;
  }
  isLocked() {
    return this._locks > 0;
  }
  lock() {
    this._locks += 1;
    let s;
    const t = new Promise((l) => s = () => {
      this._locks -= 1, l();
    }), c = this._locking.then(() => s);
    return this._locking = this._locking.then(() => t), c;
  }
};
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}
var FLOAT32_MAX = 34028234663852886e22;
var FLOAT32_MIN = -34028234663852886e22;
var UINT32_MAX = 4294967295;
var INT32_MAX = 2147483647;
var INT32_MIN = -2147483648;
function assertInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid int 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
    throw new Error("invalid int 32: " + arg);
}
function assertUInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid uint 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
    throw new Error("invalid uint 32: " + arg);
}
function assertFloat32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid float 32: " + typeof arg);
  if (!Number.isFinite(arg))
    return;
  if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
    throw new Error("invalid float 32: " + arg);
}
var enumTypeSymbol = Symbol("@bufbuild/protobuf/enum-type");
function getEnumType(enumObject) {
  const t = enumObject[enumTypeSymbol];
  assert(t, "missing enum type on enum object");
  return t;
}
function setEnumType(enumObject, typeName, values, opt) {
  enumObject[enumTypeSymbol] = makeEnumType(typeName, values.map((v) => ({
    no: v.no,
    name: v.name,
    localName: enumObject[v.no]
  })));
}
function makeEnumType(typeName, values, _opt) {
  const names = /* @__PURE__ */ Object.create(null);
  const numbers = /* @__PURE__ */ Object.create(null);
  const normalValues = [];
  for (const value of values) {
    const n = normalizeEnumValue(value);
    normalValues.push(n);
    names[value.name] = n;
    numbers[value.no] = n;
  }
  return {
    typeName,
    values: normalValues,
    // We do not surface options at this time
    // options: opt?.options ?? Object.create(null),
    findName(name) {
      return names[name];
    },
    findNumber(no) {
      return numbers[no];
    }
  };
}
function makeEnum(typeName, values, opt) {
  const enumObject = {};
  for (const value of values) {
    const n = normalizeEnumValue(value);
    enumObject[n.localName] = n.no;
    enumObject[n.no] = n.localName;
  }
  setEnumType(enumObject, typeName, values);
  return enumObject;
}
function normalizeEnumValue(value) {
  if ("localName" in value) {
    return value;
  }
  return Object.assign(Object.assign({}, value), {
    localName: value.name
  });
}
var Message = class {
  /**
   * Compare with a message of the same type.
   * Note that this function disregards extensions and unknown fields.
   */
  equals(other) {
    return this.getType().runtime.util.equals(this.getType(), this, other);
  }
  /**
   * Create a deep copy.
   */
  clone() {
    return this.getType().runtime.util.clone(this);
  }
  /**
   * Parse from binary data, merging fields.
   *
   * Repeated fields are appended. Map entries are added, overwriting
   * existing keys.
   *
   * If a message field is already present, it will be merged with the
   * new data.
   */
  fromBinary(bytes, options) {
    const type = this.getType(), format = type.runtime.bin, opt = format.makeReadOptions(options);
    format.readMessage(this, opt.readerFactory(bytes), bytes.byteLength, opt);
    return this;
  }
  /**
   * Parse a message from a JSON value.
   */
  fromJson(jsonValue, options) {
    const type = this.getType(), format = type.runtime.json, opt = format.makeReadOptions(options);
    format.readMessage(type, jsonValue, opt, this);
    return this;
  }
  /**
   * Parse a message from a JSON string.
   */
  fromJsonString(jsonString, options) {
    let json;
    try {
      json = JSON.parse(jsonString);
    } catch (e2) {
      throw new Error("cannot decode ".concat(this.getType().typeName, " from JSON: ").concat(e2 instanceof Error ? e2.message : String(e2)));
    }
    return this.fromJson(json, options);
  }
  /**
   * Serialize the message to binary data.
   */
  toBinary(options) {
    const type = this.getType(), bin = type.runtime.bin, opt = bin.makeWriteOptions(options), writer2 = opt.writerFactory();
    bin.writeMessage(this, writer2, opt);
    return writer2.finish();
  }
  /**
   * Serialize the message to a JSON value, a JavaScript value that can be
   * passed to JSON.stringify().
   */
  toJson(options) {
    const type = this.getType(), json = type.runtime.json, opt = json.makeWriteOptions(options);
    return json.writeMessage(this, opt);
  }
  /**
   * Serialize the message to a JSON string.
   */
  toJsonString(options) {
    var _a;
    const value = this.toJson(options);
    return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
  }
  /**
   * Override for serialization behavior. This will be invoked when calling
   * JSON.stringify on this message (i.e. JSON.stringify(msg)).
   *
   * Note that this will not serialize google.protobuf.Any with a packed
   * message because the protobuf JSON format specifies that it needs to be
   * unpacked, and this is only possible with a type registry to look up the
   * message type.  As a result, attempting to serialize a message with this
   * type will throw an Error.
   *
   * This method is protected because you should not need to invoke it
   * directly -- instead use JSON.stringify or toJsonString for
   * stringified JSON.  Alternatively, if actual JSON is desired, you should
   * use toJson.
   */
  toJSON() {
    return this.toJson({
      emitDefaultValues: true
    });
  }
  /**
   * Retrieve the MessageType of this message - a singleton that represents
   * the protobuf message declaration and provides metadata for reflection-
   * based operations.
   */
  getType() {
    return Object.getPrototypeOf(this).constructor;
  }
};
function makeMessageType(runtime, typeName, fields, opt) {
  var _a;
  const localName = (_a = opt === null || opt === void 0 ? void 0 : opt.localName) !== null && _a !== void 0 ? _a : typeName.substring(typeName.lastIndexOf(".") + 1);
  const type = {
    [localName]: function(data) {
      runtime.util.initFields(this);
      runtime.util.initPartial(data, this);
    }
  }[localName];
  Object.setPrototypeOf(type.prototype, new Message());
  Object.assign(type, {
    runtime,
    typeName,
    fields: runtime.util.newFieldList(fields),
    fromBinary(bytes, options) {
      return new type().fromBinary(bytes, options);
    },
    fromJson(jsonValue, options) {
      return new type().fromJson(jsonValue, options);
    },
    fromJsonString(jsonString, options) {
      return new type().fromJsonString(jsonString, options);
    },
    equals(a, b) {
      return runtime.util.equals(type, a, b);
    }
  });
  return type;
}
function varint64read() {
  let lowBits = 0;
  let highBits = 0;
  for (let shift = 0; shift < 28; shift += 7) {
    let b = this.buf[this.pos++];
    lowBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  let middleByte = this.buf[this.pos++];
  lowBits |= (middleByte & 15) << 28;
  highBits = (middleByte & 112) >> 4;
  if ((middleByte & 128) == 0) {
    this.assertBounds();
    return [lowBits, highBits];
  }
  for (let shift = 3; shift <= 31; shift += 7) {
    let b = this.buf[this.pos++];
    highBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  throw new Error("invalid varint");
}
function varint64write(lo, hi, bytes) {
  for (let i = 0; i < 28; i = i + 7) {
    const shift = lo >>> i;
    const hasNext = !(shift >>> 7 == 0 && hi == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
  const hasMoreBits = !(hi >> 3 == 0);
  bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
  if (!hasMoreBits) {
    return;
  }
  for (let i = 3; i < 31; i = i + 7) {
    const shift = hi >>> i;
    const hasNext = !(shift >>> 7 == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  bytes.push(hi >>> 31 & 1);
}
var TWO_PWR_32_DBL = 4294967296;
function int64FromString(dec) {
  const minus = dec[0] === "-";
  if (minus) {
    dec = dec.slice(1);
  }
  const base = 1e6;
  let lowBits = 0;
  let highBits = 0;
  function add1e6digit(begin, end) {
    const digit1e6 = Number(dec.slice(begin, end));
    highBits *= base;
    lowBits = lowBits * base + digit1e6;
    if (lowBits >= TWO_PWR_32_DBL) {
      highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
      lowBits = lowBits % TWO_PWR_32_DBL;
    }
  }
  add1e6digit(-24, -18);
  add1e6digit(-18, -12);
  add1e6digit(-12, -6);
  add1e6digit(-6);
  return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
function int64ToString(lo, hi) {
  let bits = newBits(lo, hi);
  const negative = bits.hi & 2147483648;
  if (negative) {
    bits = negate(bits.lo, bits.hi);
  }
  const result = uInt64ToString(bits.lo, bits.hi);
  return negative ? "-" + result : result;
}
function uInt64ToString(lo, hi) {
  ({
    lo,
    hi
  } = toUnsigned(lo, hi));
  if (hi <= 2097151) {
    return String(TWO_PWR_32_DBL * hi + lo);
  }
  const low = lo & 16777215;
  const mid = (lo >>> 24 | hi << 8) & 16777215;
  const high = hi >> 16 & 65535;
  let digitA = low + mid * 6777216 + high * 6710656;
  let digitB = mid + high * 8147497;
  let digitC = high * 2;
  const base = 1e7;
  if (digitA >= base) {
    digitB += Math.floor(digitA / base);
    digitA %= base;
  }
  if (digitB >= base) {
    digitC += Math.floor(digitB / base);
    digitB %= base;
  }
  return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
  return {
    lo: lo >>> 0,
    hi: hi >>> 0
  };
}
function newBits(lo, hi) {
  return {
    lo: lo | 0,
    hi: hi | 0
  };
}
function negate(lowBits, highBits) {
  highBits = ~highBits;
  if (lowBits) {
    lowBits = ~lowBits + 1;
  } else {
    highBits += 1;
  }
  return newBits(lowBits, highBits);
}
var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
  const partial = String(digit1e7);
  return "0000000".slice(partial.length) + partial;
};
function varint32write(value, bytes) {
  if (value >= 0) {
    while (value > 127) {
      bytes.push(value & 127 | 128);
      value = value >>> 7;
    }
    bytes.push(value);
  } else {
    for (let i = 0; i < 9; i++) {
      bytes.push(value & 127 | 128);
      value = value >> 7;
    }
    bytes.push(1);
  }
}
function varint32read() {
  let b = this.buf[this.pos++];
  let result = b & 127;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 7;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 14;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 21;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 15) << 28;
  for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
    b = this.buf[this.pos++];
  if ((b & 128) != 0)
    throw new Error("invalid varint");
  this.assertBounds();
  return result >>> 0;
}
function makeInt64Support() {
  const dv = new DataView(new ArrayBuffer(8));
  const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
  if (ok) {
    const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
    return {
      zero: BigInt(0),
      supported: true,
      parse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > MAX || bi < MIN) {
          throw new Error("int64 invalid: ".concat(value));
        }
        return bi;
      },
      uParse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > UMAX || bi < UMIN) {
          throw new Error("uint64 invalid: ".concat(value));
        }
        return bi;
      },
      enc(value) {
        dv.setBigInt64(0, this.parse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      uEnc(value) {
        dv.setBigInt64(0, this.uParse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      dec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigInt64(0, true);
      },
      uDec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigUint64(0, true);
      }
    };
  }
  const assertInt64String = (value) => assert(/^-?[0-9]+$/.test(value), "int64 invalid: ".concat(value));
  const assertUInt64String = (value) => assert(/^[0-9]+$/.test(value), "uint64 invalid: ".concat(value));
  return {
    zero: "0",
    supported: false,
    parse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return value;
    },
    uParse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return value;
    },
    enc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return int64FromString(value);
    },
    uEnc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return int64FromString(value);
    },
    dec(lo, hi) {
      return int64ToString(lo, hi);
    },
    uDec(lo, hi) {
      return uInt64ToString(lo, hi);
    }
  };
}
var protoInt64 = makeInt64Support();
var ScalarType;
(function(ScalarType2) {
  ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
  ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
  ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
  ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
  ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
  ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
  ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
  ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
  ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
  ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
  ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
  ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
  ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
  ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
  ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
})(ScalarType || (ScalarType = {}));
var LongType;
(function(LongType2) {
  LongType2[LongType2["BIGINT"] = 0] = "BIGINT";
  LongType2[LongType2["STRING"] = 1] = "STRING";
})(LongType || (LongType = {}));
function scalarEquals(type, a, b) {
  if (a === b) {
    return true;
  }
  if (type == ScalarType.BYTES) {
    if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  switch (type) {
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return a == b;
  }
  return false;
}
function scalarZeroValue(type, longType) {
  switch (type) {
    case ScalarType.BOOL:
      return false;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return longType == 0 ? protoInt64.zero : "0";
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      return 0;
    case ScalarType.BYTES:
      return new Uint8Array(0);
    case ScalarType.STRING:
      return "";
    default:
      return 0;
  }
}
function isScalarZeroValue(type, value) {
  switch (type) {
    case ScalarType.BOOL:
      return value === false;
    case ScalarType.STRING:
      return value === "";
    case ScalarType.BYTES:
      return value instanceof Uint8Array && !value.byteLength;
    default:
      return value == 0;
  }
}
var WireType;
(function(WireType2) {
  WireType2[WireType2["Varint"] = 0] = "Varint";
  WireType2[WireType2["Bit64"] = 1] = "Bit64";
  WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
  WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
  WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
  WireType2[WireType2["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
var BinaryWriter = class {
  constructor(textEncoder) {
    this.stack = [];
    this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
    this.chunks = [];
    this.buf = [];
  }
  /**
   * Return all bytes written and reset this writer.
   */
  finish() {
    this.chunks.push(new Uint8Array(this.buf));
    let len = 0;
    for (let i = 0; i < this.chunks.length; i++)
      len += this.chunks[i].length;
    let bytes = new Uint8Array(len);
    let offset = 0;
    for (let i = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }
    this.chunks = [];
    return bytes;
  }
  /**
   * Start a new fork for length-delimited data like a message
   * or a packed repeated field.
   *
   * Must be joined later with `join()`.
   */
  fork() {
    this.stack.push({
      chunks: this.chunks,
      buf: this.buf
    });
    this.chunks = [];
    this.buf = [];
    return this;
  }
  /**
   * Join the last fork. Write its length and bytes, then
   * return to the previous state.
   */
  join() {
    let chunk = this.finish();
    let prev = this.stack.pop();
    if (!prev)
      throw new Error("invalid state, fork stack empty");
    this.chunks = prev.chunks;
    this.buf = prev.buf;
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Writes a tag (field number and wire type).
   *
   * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
   *
   * Generated code should compute the tag ahead of time and call `uint32()`.
   */
  tag(fieldNo, type) {
    return this.uint32((fieldNo << 3 | type) >>> 0);
  }
  /**
   * Write a chunk of raw bytes.
   */
  raw(chunk) {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    this.chunks.push(chunk);
    return this;
  }
  /**
   * Write a `uint32` value, an unsigned 32 bit varint.
   */
  uint32(value) {
    assertUInt32(value);
    while (value > 127) {
      this.buf.push(value & 127 | 128);
      value = value >>> 7;
    }
    this.buf.push(value);
    return this;
  }
  /**
   * Write a `int32` value, a signed 32 bit varint.
   */
  int32(value) {
    assertInt32(value);
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `bool` value, a variant.
   */
  bool(value) {
    this.buf.push(value ? 1 : 0);
    return this;
  }
  /**
   * Write a `bytes` value, length-delimited arbitrary data.
   */
  bytes(value) {
    this.uint32(value.byteLength);
    return this.raw(value);
  }
  /**
   * Write a `string` value, length-delimited data converted to UTF-8 text.
   */
  string(value) {
    let chunk = this.textEncoder.encode(value);
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Write a `float` value, 32-bit floating point number.
   */
  float(value) {
    assertFloat32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setFloat32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `double` value, a 64-bit floating point number.
   */
  double(value) {
    let chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setFloat64(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(value) {
    assertUInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setUint32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
   */
  sfixed32(value) {
    assertInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setInt32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(value) {
    assertInt32(value);
    value = (value << 1 ^ value >> 31) >>> 0;
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
   */
  sfixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `int64` value, a signed 64-bit varint.
   */
  int64(value) {
    let tc = protoInt64.enc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
  /**
   * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(value) {
    let tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
    varint64write(lo, hi, this.buf);
    return this;
  }
  /**
   * Write a `uint64` value, an unsigned 64-bit varint.
   */
  uint64(value) {
    let tc = protoInt64.uEnc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
};
var BinaryReader = class {
  constructor(buf, textDecoder) {
    this.varint64 = varint64read;
    this.uint32 = varint32read;
    this.buf = buf;
    this.len = buf.length;
    this.pos = 0;
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder();
  }
  /**
   * Reads a tag - field number and wire type.
   */
  tag() {
    let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
    if (fieldNo <= 0 || wireType < 0 || wireType > 5)
      throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
    return [fieldNo, wireType];
  }
  /**
   * Skip one element and return the skipped data.
   *
   * When skipping StartGroup, provide the tags field number to check for
   * matching field number in the EndGroup tag.
   */
  skip(wireType, fieldNo) {
    let start = this.pos;
    switch (wireType) {
      case WireType.Varint:
        while (this.buf[this.pos++] & 128) {
        }
        break;
      case WireType.Bit64:
        this.pos += 4;
      case WireType.Bit32:
        this.pos += 4;
        break;
      case WireType.LengthDelimited:
        let len = this.uint32();
        this.pos += len;
        break;
      case WireType.StartGroup:
        for (; ; ) {
          const [fn, wt] = this.tag();
          if (wt === WireType.EndGroup) {
            if (fieldNo !== void 0 && fn !== fieldNo) {
              throw new Error("invalid end group tag");
            }
            break;
          }
          this.skip(wt, fn);
        }
        break;
      default:
        throw new Error("cant skip wire type " + wireType);
    }
    this.assertBounds();
    return this.buf.subarray(start, this.pos);
  }
  /**
   * Throws error if position in byte array is out of range.
   */
  assertBounds() {
    if (this.pos > this.len)
      throw new RangeError("premature EOF");
  }
  /**
   * Read a `int32` field, a signed 32 bit varint.
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
   */
  sint32() {
    let zze = this.uint32();
    return zze >>> 1 ^ -(zze & 1);
  }
  /**
   * Read a `int64` field, a signed 64-bit varint.
   */
  int64() {
    return protoInt64.dec(...this.varint64());
  }
  /**
   * Read a `uint64` field, an unsigned 64-bit varint.
   */
  uint64() {
    return protoInt64.uDec(...this.varint64());
  }
  /**
   * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64() {
    let [lo, hi] = this.varint64();
    let s = -(lo & 1);
    lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
    hi = hi >>> 1 ^ s;
    return protoInt64.dec(lo, hi);
  }
  /**
   * Read a `bool` field, a variant.
   */
  bool() {
    let [lo, hi] = this.varint64();
    return lo !== 0 || hi !== 0;
  }
  /**
   * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
   */
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
   */
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
   */
  fixed64() {
    return protoInt64.uDec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
   */
  sfixed64() {
    return protoInt64.dec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `float` field, 32-bit floating point number.
   */
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `double` field, a 64-bit floating point number.
   */
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, true);
  }
  /**
   * Read a `bytes` field, length-delimited arbitrary data.
   */
  bytes() {
    let len = this.uint32(), start = this.pos;
    this.pos += len;
    this.assertBounds();
    return this.buf.subarray(start, start + len);
  }
  /**
   * Read a `string` field, length-delimited data converted to UTF-8 text.
   */
  string() {
    return this.textDecoder.decode(this.bytes());
  }
};
function makeExtension(runtime, typeName, extendee, field) {
  let fi;
  return {
    typeName,
    extendee,
    get field() {
      if (!fi) {
        const i = typeof field == "function" ? field() : field;
        i.name = typeName.split(".").pop();
        i.jsonName = "[".concat(typeName, "]");
        fi = runtime.util.newFieldList([i]).list()[0];
      }
      return fi;
    },
    runtime
  };
}
function createExtensionContainer(extension) {
  const localName = extension.field.localName;
  const container = /* @__PURE__ */ Object.create(null);
  container[localName] = initExtensionField(extension);
  return [container, () => container[localName]];
}
function initExtensionField(ext) {
  const field = ext.field;
  if (field.repeated) {
    return [];
  }
  if (field.default !== void 0) {
    return field.default;
  }
  switch (field.kind) {
    case "enum":
      return field.T.values[0].no;
    case "scalar":
      return scalarZeroValue(field.T, field.L);
    case "message":
      const T = field.T, value = new T();
      return T.fieldWrapper ? T.fieldWrapper.unwrapField(value) : value;
    case "map":
      throw "map fields are not allowed to be extensions";
  }
}
function filterUnknownFields(unknownFields, field) {
  if (!field.repeated && (field.kind == "enum" || field.kind == "scalar")) {
    for (let i = unknownFields.length - 1; i >= 0; --i) {
      if (unknownFields[i].no == field.no) {
        return [unknownFields[i]];
      }
    }
    return [];
  }
  return unknownFields.filter((uf) => uf.no === field.no);
}
var encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var decTable = [];
for (let i = 0; i < encTable.length; i++)
  decTable[encTable[i].charCodeAt(0)] = i;
decTable["-".charCodeAt(0)] = encTable.indexOf("+");
decTable["_".charCodeAt(0)] = encTable.indexOf("/");
var protoBase64 = {
  /**
   * Decodes a base64 string to a byte array.
   *
   * - ignores white-space, including line breaks and tabs
   * - allows inner padding (can decode concatenated base64 strings)
   * - does not require padding
   * - understands base64url encoding:
   *   "-" instead of "+",
   *   "_" instead of "/",
   *   no padding
   */
  dec(base64Str) {
    let es = base64Str.length * 3 / 4;
    if (base64Str[base64Str.length - 2] == "=")
      es -= 2;
    else if (base64Str[base64Str.length - 1] == "=")
      es -= 1;
    let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
    for (let i = 0; i < base64Str.length; i++) {
      b = decTable[base64Str.charCodeAt(i)];
      if (b === void 0) {
        switch (base64Str[i]) {
          case "=":
            groupPos = 0;
          case "\n":
          case "\r":
          case "	":
          case " ":
            continue;
          default:
            throw Error("invalid base64 string.");
        }
      }
      switch (groupPos) {
        case 0:
          p = b;
          groupPos = 1;
          break;
        case 1:
          bytes[bytePos++] = p << 2 | (b & 48) >> 4;
          p = b;
          groupPos = 2;
          break;
        case 2:
          bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
          p = b;
          groupPos = 3;
          break;
        case 3:
          bytes[bytePos++] = (p & 3) << 6 | b;
          groupPos = 0;
          break;
      }
    }
    if (groupPos == 1)
      throw Error("invalid base64 string.");
    return bytes.subarray(0, bytePos);
  },
  /**
   * Encode a byte array to a base64 string.
   */
  enc(bytes) {
    let base64 = "", groupPos = 0, b, p = 0;
    for (let i = 0; i < bytes.length; i++) {
      b = bytes[i];
      switch (groupPos) {
        case 0:
          base64 += encTable[b >> 2];
          p = (b & 3) << 4;
          groupPos = 1;
          break;
        case 1:
          base64 += encTable[p | b >> 4];
          p = (b & 15) << 2;
          groupPos = 2;
          break;
        case 2:
          base64 += encTable[p | b >> 6];
          base64 += encTable[b & 63];
          groupPos = 0;
          break;
      }
    }
    if (groupPos) {
      base64 += encTable[p];
      base64 += "=";
      if (groupPos == 1)
        base64 += "=";
    }
    return base64;
  }
};
function getExtension(message, extension, options) {
  assertExtendee(extension, message);
  const opt = extension.runtime.bin.makeReadOptions(options);
  const ufs = filterUnknownFields(message.getType().runtime.bin.listUnknownFields(message), extension.field);
  const [container, get] = createExtensionContainer(extension);
  for (const uf of ufs) {
    extension.runtime.bin.readField(container, opt.readerFactory(uf.data), extension.field, uf.wireType, opt);
  }
  return get();
}
function setExtension(message, extension, value, options) {
  assertExtendee(extension, message);
  const readOpt = extension.runtime.bin.makeReadOptions(options);
  const writeOpt = extension.runtime.bin.makeWriteOptions(options);
  if (hasExtension(message, extension)) {
    const ufs = message.getType().runtime.bin.listUnknownFields(message).filter((uf) => uf.no != extension.field.no);
    message.getType().runtime.bin.discardUnknownFields(message);
    for (const uf of ufs) {
      message.getType().runtime.bin.onUnknownField(message, uf.no, uf.wireType, uf.data);
    }
  }
  const writer2 = writeOpt.writerFactory();
  let f = extension.field;
  if (!f.opt && !f.repeated && (f.kind == "enum" || f.kind == "scalar")) {
    f = Object.assign(Object.assign({}, extension.field), {
      opt: true
    });
  }
  extension.runtime.bin.writeField(f, value, writer2, writeOpt);
  const reader = readOpt.readerFactory(writer2.finish());
  while (reader.pos < reader.len) {
    const [no, wireType] = reader.tag();
    const data = reader.skip(wireType, no);
    message.getType().runtime.bin.onUnknownField(message, no, wireType, data);
  }
}
function hasExtension(message, extension) {
  const messageType = message.getType();
  return extension.extendee.typeName === messageType.typeName && !!messageType.runtime.bin.listUnknownFields(message).find((uf) => uf.no == extension.field.no);
}
function assertExtendee(extension, message) {
  assert(extension.extendee.typeName == message.getType().typeName, "extension ".concat(extension.typeName, " can only be applied to message ").concat(extension.extendee.typeName));
}
function isFieldSet(field, target) {
  const localName = field.localName;
  if (field.repeated) {
    return target[localName].length > 0;
  }
  if (field.oneof) {
    return target[field.oneof.localName].case === localName;
  }
  switch (field.kind) {
    case "enum":
    case "scalar":
      if (field.opt || field.req) {
        return target[localName] !== void 0;
      }
      if (field.kind == "enum") {
        return target[localName] !== field.T.values[0].no;
      }
      return !isScalarZeroValue(field.T, target[localName]);
    case "message":
      return target[localName] !== void 0;
    case "map":
      return Object.keys(target[localName]).length > 0;
  }
}
function clearField(field, target) {
  const localName = field.localName;
  const implicitPresence = !field.opt && !field.req;
  if (field.repeated) {
    target[localName] = [];
  } else if (field.oneof) {
    target[field.oneof.localName] = {
      case: void 0
    };
  } else {
    switch (field.kind) {
      case "map":
        target[localName] = {};
        break;
      case "enum":
        target[localName] = implicitPresence ? field.T.values[0].no : void 0;
        break;
      case "scalar":
        target[localName] = implicitPresence ? scalarZeroValue(field.T, field.L) : void 0;
        break;
      case "message":
        target[localName] = void 0;
        break;
    }
  }
}
function isMessage(arg, type) {
  if (arg === null || typeof arg != "object") {
    return false;
  }
  if (!Object.getOwnPropertyNames(Message.prototype).every((m) => m in arg && typeof arg[m] == "function")) {
    return false;
  }
  const actualType = arg.getType();
  if (actualType === null || typeof actualType != "function" || !("typeName" in actualType) || typeof actualType.typeName != "string") {
    return false;
  }
  return type === void 0 ? true : actualType.typeName == type.typeName;
}
function wrapField(type, value) {
  if (isMessage(value) || !type.fieldWrapper) {
    return value;
  }
  return type.fieldWrapper.wrapField(value);
}
({
  "google.protobuf.DoubleValue": ScalarType.DOUBLE,
  "google.protobuf.FloatValue": ScalarType.FLOAT,
  "google.protobuf.Int64Value": ScalarType.INT64,
  "google.protobuf.UInt64Value": ScalarType.UINT64,
  "google.protobuf.Int32Value": ScalarType.INT32,
  "google.protobuf.UInt32Value": ScalarType.UINT32,
  "google.protobuf.BoolValue": ScalarType.BOOL,
  "google.protobuf.StringValue": ScalarType.STRING,
  "google.protobuf.BytesValue": ScalarType.BYTES
});
var jsonReadDefaults = {
  ignoreUnknownFields: false
};
var jsonWriteDefaults = {
  emitDefaultValues: false,
  enumAsInteger: false,
  useProtoFieldName: false,
  prettySpaces: 0
};
function makeReadOptions$1(options) {
  return options ? Object.assign(Object.assign({}, jsonReadDefaults), options) : jsonReadDefaults;
}
function makeWriteOptions$1(options) {
  return options ? Object.assign(Object.assign({}, jsonWriteDefaults), options) : jsonWriteDefaults;
}
var tokenNull = Symbol();
var tokenIgnoredUnknownEnum = Symbol();
function makeJsonFormat() {
  return {
    makeReadOptions: makeReadOptions$1,
    makeWriteOptions: makeWriteOptions$1,
    readMessage(type, json, options, message) {
      if (json == null || Array.isArray(json) || typeof json != "object") {
        throw new Error("cannot decode message ".concat(type.typeName, " from JSON: ").concat(debugJsonValue(json)));
      }
      message = message !== null && message !== void 0 ? message : new type();
      const oneofSeen = /* @__PURE__ */ new Map();
      const registry = options.typeRegistry;
      for (const [jsonKey, jsonValue] of Object.entries(json)) {
        const field = type.fields.findJsonName(jsonKey);
        if (field) {
          if (field.oneof) {
            if (jsonValue === null && field.kind == "scalar") {
              continue;
            }
            const seen = oneofSeen.get(field.oneof);
            if (seen !== void 0) {
              throw new Error("cannot decode message ".concat(type.typeName, ' from JSON: multiple keys for oneof "').concat(field.oneof.name, '" present: "').concat(seen, '", "').concat(jsonKey, '"'));
            }
            oneofSeen.set(field.oneof, jsonKey);
          }
          readField$1(message, jsonValue, field, options, type);
        } else {
          let found = false;
          if ((registry === null || registry === void 0 ? void 0 : registry.findExtension) && jsonKey.startsWith("[") && jsonKey.endsWith("]")) {
            const ext = registry.findExtension(jsonKey.substring(1, jsonKey.length - 1));
            if (ext && ext.extendee.typeName == type.typeName) {
              found = true;
              const [container, get] = createExtensionContainer(ext);
              readField$1(container, jsonValue, ext.field, options, ext);
              setExtension(message, ext, get(), options);
            }
          }
          if (!found && !options.ignoreUnknownFields) {
            throw new Error("cannot decode message ".concat(type.typeName, ' from JSON: key "').concat(jsonKey, '" is unknown'));
          }
        }
      }
      return message;
    },
    writeMessage(message, options) {
      const type = message.getType();
      const json = {};
      let field;
      try {
        for (field of type.fields.byNumber()) {
          if (!isFieldSet(field, message)) {
            if (field.req) {
              throw "required field not set";
            }
            if (!options.emitDefaultValues) {
              continue;
            }
            if (!canEmitFieldDefaultValue(field)) {
              continue;
            }
          }
          const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
          const jsonValue = writeField$1(field, value, options);
          if (jsonValue !== void 0) {
            json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
          }
        }
        const registry = options.typeRegistry;
        if (registry === null || registry === void 0 ? void 0 : registry.findExtensionFor) {
          for (const uf of type.runtime.bin.listUnknownFields(message)) {
            const ext = registry.findExtensionFor(type.typeName, uf.no);
            if (ext && hasExtension(message, ext)) {
              const value = getExtension(message, ext, options);
              const jsonValue = writeField$1(ext.field, value, options);
              if (jsonValue !== void 0) {
                json[ext.field.jsonName] = jsonValue;
              }
            }
          }
        }
      } catch (e2) {
        const m = field ? "cannot encode field ".concat(type.typeName, ".").concat(field.name, " to JSON") : "cannot encode message ".concat(type.typeName, " to JSON");
        const r2 = e2 instanceof Error ? e2.message : String(e2);
        throw new Error(m + (r2.length > 0 ? ": ".concat(r2) : ""));
      }
      return json;
    },
    readScalar(type, json, longType) {
      return readScalar$1(type, json, longType !== null && longType !== void 0 ? longType : LongType.BIGINT, true);
    },
    writeScalar(type, value, emitDefaultValues) {
      if (value === void 0) {
        return void 0;
      }
      if (emitDefaultValues || isScalarZeroValue(type, value)) {
        return writeScalar$1(type, value);
      }
      return void 0;
    },
    debug: debugJsonValue
  };
}
function debugJsonValue(json) {
  if (json === null) {
    return "null";
  }
  switch (typeof json) {
    case "object":
      return Array.isArray(json) ? "array" : "object";
    case "string":
      return json.length > 100 ? "string" : '"'.concat(json.split('"').join('\\"'), '"');
    default:
      return String(json);
  }
}
function readField$1(target, jsonValue, field, options, parentType) {
  let localName = field.localName;
  if (field.repeated) {
    assert(field.kind != "map");
    if (jsonValue === null) {
      return;
    }
    if (!Array.isArray(jsonValue)) {
      throw new Error("cannot decode field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: ").concat(debugJsonValue(jsonValue)));
    }
    const targetArray = target[localName];
    for (const jsonItem of jsonValue) {
      if (jsonItem === null) {
        throw new Error("cannot decode field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: ").concat(debugJsonValue(jsonItem)));
      }
      switch (field.kind) {
        case "message":
          targetArray.push(field.T.fromJson(jsonItem, options));
          break;
        case "enum":
          const enumValue = readEnum(field.T, jsonItem, options.ignoreUnknownFields, true);
          if (enumValue !== tokenIgnoredUnknownEnum) {
            targetArray.push(enumValue);
          }
          break;
        case "scalar":
          try {
            targetArray.push(readScalar$1(field.T, jsonItem, field.L, true));
          } catch (e2) {
            let m = "cannot decode field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: ").concat(debugJsonValue(jsonItem));
            if (e2 instanceof Error && e2.message.length > 0) {
              m += ": ".concat(e2.message);
            }
            throw new Error(m);
          }
          break;
      }
    }
  } else if (field.kind == "map") {
    if (jsonValue === null) {
      return;
    }
    if (typeof jsonValue != "object" || Array.isArray(jsonValue)) {
      throw new Error("cannot decode field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: ").concat(debugJsonValue(jsonValue)));
    }
    const targetMap = target[localName];
    for (const [jsonMapKey, jsonMapValue] of Object.entries(jsonValue)) {
      if (jsonMapValue === null) {
        throw new Error("cannot decode field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: map value null"));
      }
      let key;
      try {
        key = readMapKey(field.K, jsonMapKey);
      } catch (e2) {
        let m = "cannot decode map key for field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: ").concat(debugJsonValue(jsonValue));
        if (e2 instanceof Error && e2.message.length > 0) {
          m += ": ".concat(e2.message);
        }
        throw new Error(m);
      }
      switch (field.V.kind) {
        case "message":
          targetMap[key] = field.V.T.fromJson(jsonMapValue, options);
          break;
        case "enum":
          const enumValue = readEnum(field.V.T, jsonMapValue, options.ignoreUnknownFields, true);
          if (enumValue !== tokenIgnoredUnknownEnum) {
            targetMap[key] = enumValue;
          }
          break;
        case "scalar":
          try {
            targetMap[key] = readScalar$1(field.V.T, jsonMapValue, LongType.BIGINT, true);
          } catch (e2) {
            let m = "cannot decode map value for field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: ").concat(debugJsonValue(jsonValue));
            if (e2 instanceof Error && e2.message.length > 0) {
              m += ": ".concat(e2.message);
            }
            throw new Error(m);
          }
          break;
      }
    }
  } else {
    if (field.oneof) {
      target = target[field.oneof.localName] = {
        case: localName
      };
      localName = "value";
    }
    switch (field.kind) {
      case "message":
        const messageType = field.T;
        if (jsonValue === null && messageType.typeName != "google.protobuf.Value") {
          return;
        }
        let currentValue = target[localName];
        if (isMessage(currentValue)) {
          currentValue.fromJson(jsonValue, options);
        } else {
          target[localName] = currentValue = messageType.fromJson(jsonValue, options);
          if (messageType.fieldWrapper && !field.oneof) {
            target[localName] = messageType.fieldWrapper.unwrapField(currentValue);
          }
        }
        break;
      case "enum":
        const enumValue = readEnum(field.T, jsonValue, options.ignoreUnknownFields, false);
        switch (enumValue) {
          case tokenNull:
            clearField(field, target);
            break;
          case tokenIgnoredUnknownEnum:
            break;
          default:
            target[localName] = enumValue;
            break;
        }
        break;
      case "scalar":
        try {
          const scalarValue = readScalar$1(field.T, jsonValue, field.L, false);
          switch (scalarValue) {
            case tokenNull:
              clearField(field, target);
              break;
            default:
              target[localName] = scalarValue;
              break;
          }
        } catch (e2) {
          let m = "cannot decode field ".concat(parentType.typeName, ".").concat(field.name, " from JSON: ").concat(debugJsonValue(jsonValue));
          if (e2 instanceof Error && e2.message.length > 0) {
            m += ": ".concat(e2.message);
          }
          throw new Error(m);
        }
        break;
    }
  }
}
function readMapKey(type, json) {
  if (type === ScalarType.BOOL) {
    switch (json) {
      case "true":
        json = true;
        break;
      case "false":
        json = false;
        break;
    }
  }
  return readScalar$1(type, json, LongType.BIGINT, true).toString();
}
function readScalar$1(type, json, longType, nullAsZeroValue) {
  if (json === null) {
    if (nullAsZeroValue) {
      return scalarZeroValue(type, longType);
    }
    return tokenNull;
  }
  switch (type) {
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      if (json === "NaN")
        return Number.NaN;
      if (json === "Infinity")
        return Number.POSITIVE_INFINITY;
      if (json === "-Infinity")
        return Number.NEGATIVE_INFINITY;
      if (json === "") {
        break;
      }
      if (typeof json == "string" && json.trim().length !== json.length) {
        break;
      }
      if (typeof json != "string" && typeof json != "number") {
        break;
      }
      const float = Number(json);
      if (Number.isNaN(float)) {
        break;
      }
      if (!Number.isFinite(float)) {
        break;
      }
      if (type == ScalarType.FLOAT)
        assertFloat32(float);
      return float;
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.UINT32:
      let int32;
      if (typeof json == "number")
        int32 = json;
      else if (typeof json == "string" && json.length > 0) {
        if (json.trim().length === json.length)
          int32 = Number(json);
      }
      if (int32 === void 0)
        break;
      if (type == ScalarType.UINT32 || type == ScalarType.FIXED32)
        assertUInt32(int32);
      else
        assertInt32(int32);
      return int32;
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      if (typeof json != "number" && typeof json != "string")
        break;
      const long = protoInt64.parse(json);
      return longType ? long.toString() : long;
    case ScalarType.FIXED64:
    case ScalarType.UINT64:
      if (typeof json != "number" && typeof json != "string")
        break;
      const uLong = protoInt64.uParse(json);
      return longType ? uLong.toString() : uLong;
    case ScalarType.BOOL:
      if (typeof json !== "boolean")
        break;
      return json;
    case ScalarType.STRING:
      if (typeof json !== "string") {
        break;
      }
      try {
        encodeURIComponent(json);
      } catch (e2) {
        throw new Error("invalid UTF8");
      }
      return json;
    case ScalarType.BYTES:
      if (json === "")
        return new Uint8Array(0);
      if (typeof json !== "string")
        break;
      return protoBase64.dec(json);
  }
  throw new Error();
}
function readEnum(type, json, ignoreUnknownFields, nullAsZeroValue) {
  if (json === null) {
    if (type.typeName == "google.protobuf.NullValue") {
      return 0;
    }
    return nullAsZeroValue ? type.values[0].no : tokenNull;
  }
  switch (typeof json) {
    case "number":
      if (Number.isInteger(json)) {
        return json;
      }
      break;
    case "string":
      const value = type.findName(json);
      if (value !== void 0) {
        return value.no;
      }
      if (ignoreUnknownFields) {
        return tokenIgnoredUnknownEnum;
      }
      break;
  }
  throw new Error("cannot decode enum ".concat(type.typeName, " from JSON: ").concat(debugJsonValue(json)));
}
function canEmitFieldDefaultValue(field) {
  if (field.repeated || field.kind == "map") {
    return true;
  }
  if (field.oneof) {
    return false;
  }
  if (field.kind == "message") {
    return false;
  }
  if (field.opt || field.req) {
    return false;
  }
  return true;
}
function writeField$1(field, value, options) {
  if (field.kind == "map") {
    assert(typeof value == "object" && value != null);
    const jsonObj = {};
    const entries = Object.entries(value);
    switch (field.V.kind) {
      case "scalar":
        for (const [entryKey, entryValue] of entries) {
          jsonObj[entryKey.toString()] = writeScalar$1(field.V.T, entryValue);
        }
        break;
      case "message":
        for (const [entryKey, entryValue] of entries) {
          jsonObj[entryKey.toString()] = entryValue.toJson(options);
        }
        break;
      case "enum":
        const enumType = field.V.T;
        for (const [entryKey, entryValue] of entries) {
          jsonObj[entryKey.toString()] = writeEnum(enumType, entryValue, options.enumAsInteger);
        }
        break;
    }
    return options.emitDefaultValues || entries.length > 0 ? jsonObj : void 0;
  }
  if (field.repeated) {
    assert(Array.isArray(value));
    const jsonArr = [];
    switch (field.kind) {
      case "scalar":
        for (let i = 0; i < value.length; i++) {
          jsonArr.push(writeScalar$1(field.T, value[i]));
        }
        break;
      case "enum":
        for (let i = 0; i < value.length; i++) {
          jsonArr.push(writeEnum(field.T, value[i], options.enumAsInteger));
        }
        break;
      case "message":
        for (let i = 0; i < value.length; i++) {
          jsonArr.push(value[i].toJson(options));
        }
        break;
    }
    return options.emitDefaultValues || jsonArr.length > 0 ? jsonArr : void 0;
  }
  switch (field.kind) {
    case "scalar":
      return writeScalar$1(field.T, value);
    case "enum":
      return writeEnum(field.T, value, options.enumAsInteger);
    case "message":
      return wrapField(field.T, value).toJson(options);
  }
}
function writeEnum(type, value, enumAsInteger) {
  var _a;
  assert(typeof value == "number");
  if (type.typeName == "google.protobuf.NullValue") {
    return null;
  }
  if (enumAsInteger) {
    return value;
  }
  const val = type.findNumber(value);
  return (_a = val === null || val === void 0 ? void 0 : val.name) !== null && _a !== void 0 ? _a : value;
}
function writeScalar$1(type, value) {
  switch (type) {
    case ScalarType.INT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
      assert(typeof value == "number");
      return value;
    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
      assert(typeof value == "number");
      if (Number.isNaN(value))
        return "NaN";
      if (value === Number.POSITIVE_INFINITY)
        return "Infinity";
      if (value === Number.NEGATIVE_INFINITY)
        return "-Infinity";
      return value;
    case ScalarType.STRING:
      assert(typeof value == "string");
      return value;
    case ScalarType.BOOL:
      assert(typeof value == "boolean");
      return value;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      assert(typeof value == "bigint" || typeof value == "string" || typeof value == "number");
      return value.toString();
    case ScalarType.BYTES:
      assert(value instanceof Uint8Array);
      return protoBase64.enc(value);
  }
}
var unknownFieldsSymbol = Symbol("@bufbuild/protobuf/unknown-fields");
var readDefaults = {
  readUnknownFields: true,
  readerFactory: (bytes) => new BinaryReader(bytes)
};
var writeDefaults = {
  writeUnknownFields: true,
  writerFactory: () => new BinaryWriter()
};
function makeReadOptions(options) {
  return options ? Object.assign(Object.assign({}, readDefaults), options) : readDefaults;
}
function makeWriteOptions(options) {
  return options ? Object.assign(Object.assign({}, writeDefaults), options) : writeDefaults;
}
function makeBinaryFormat() {
  return {
    makeReadOptions,
    makeWriteOptions,
    listUnknownFields(message) {
      var _a;
      return (_a = message[unknownFieldsSymbol]) !== null && _a !== void 0 ? _a : [];
    },
    discardUnknownFields(message) {
      delete message[unknownFieldsSymbol];
    },
    writeUnknownFields(message, writer2) {
      const m = message;
      const c = m[unknownFieldsSymbol];
      if (c) {
        for (const f of c) {
          writer2.tag(f.no, f.wireType).raw(f.data);
        }
      }
    },
    onUnknownField(message, no, wireType, data) {
      const m = message;
      if (!Array.isArray(m[unknownFieldsSymbol])) {
        m[unknownFieldsSymbol] = [];
      }
      m[unknownFieldsSymbol].push({
        no,
        wireType,
        data
      });
    },
    readMessage(message, reader, lengthOrEndTagFieldNo, options, delimitedMessageEncoding) {
      const type = message.getType();
      const end = delimitedMessageEncoding ? reader.len : reader.pos + lengthOrEndTagFieldNo;
      let fieldNo, wireType;
      while (reader.pos < end) {
        [fieldNo, wireType] = reader.tag();
        if (delimitedMessageEncoding === true && wireType == WireType.EndGroup) {
          break;
        }
        const field = type.fields.find(fieldNo);
        if (!field) {
          const data = reader.skip(wireType, fieldNo);
          if (options.readUnknownFields) {
            this.onUnknownField(message, fieldNo, wireType, data);
          }
          continue;
        }
        readField(message, reader, field, wireType, options);
      }
      if (delimitedMessageEncoding && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      (wireType != WireType.EndGroup || fieldNo !== lengthOrEndTagFieldNo)) {
        throw new Error("invalid end group tag");
      }
    },
    readField,
    writeMessage(message, writer2, options) {
      const type = message.getType();
      for (const field of type.fields.byNumber()) {
        if (!isFieldSet(field, message)) {
          if (field.req) {
            throw new Error("cannot encode field ".concat(type.typeName, ".").concat(field.name, " to binary: required field not set"));
          }
          continue;
        }
        const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
        writeField(field, value, writer2, options);
      }
      if (options.writeUnknownFields) {
        this.writeUnknownFields(message, writer2);
      }
      return writer2;
    },
    writeField(field, value, writer2, options) {
      if (value === void 0) {
        return void 0;
      }
      writeField(field, value, writer2, options);
    }
  };
}
function readField(target, reader, field, wireType, options) {
  let {
    repeated,
    localName
  } = field;
  if (field.oneof) {
    target = target[field.oneof.localName];
    if (target.case != localName) {
      delete target.value;
    }
    target.case = localName;
    localName = "value";
  }
  switch (field.kind) {
    case "scalar":
    case "enum":
      const scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
      let read = readScalar;
      if (field.kind == "scalar" && field.L > 0) {
        read = readScalarLTString;
      }
      if (repeated) {
        let arr = target[localName];
        const isPacked = wireType == WireType.LengthDelimited && scalarType != ScalarType.STRING && scalarType != ScalarType.BYTES;
        if (isPacked) {
          let e2 = reader.uint32() + reader.pos;
          while (reader.pos < e2) {
            arr.push(read(reader, scalarType));
          }
        } else {
          arr.push(read(reader, scalarType));
        }
      } else {
        target[localName] = read(reader, scalarType);
      }
      break;
    case "message":
      const messageType = field.T;
      if (repeated) {
        target[localName].push(readMessageField(reader, new messageType(), options, field));
      } else {
        if (isMessage(target[localName])) {
          readMessageField(reader, target[localName], options, field);
        } else {
          target[localName] = readMessageField(reader, new messageType(), options, field);
          if (messageType.fieldWrapper && !field.oneof && !field.repeated) {
            target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
          }
        }
      }
      break;
    case "map":
      let [mapKey, mapVal] = readMapEntry(field, reader, options);
      target[localName][mapKey] = mapVal;
      break;
  }
}
function readMessageField(reader, message, options, field) {
  const format = message.getType().runtime.bin;
  const delimited = field === null || field === void 0 ? void 0 : field.delimited;
  format.readMessage(
    message,
    reader,
    delimited ? field.no : reader.uint32(),
    // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    options,
    delimited
  );
  return message;
}
function readMapEntry(field, reader, options) {
  const length = reader.uint32(), end = reader.pos + length;
  let key, val;
  while (reader.pos < end) {
    const [fieldNo] = reader.tag();
    switch (fieldNo) {
      case 1:
        key = readScalar(reader, field.K);
        break;
      case 2:
        switch (field.V.kind) {
          case "scalar":
            val = readScalar(reader, field.V.T);
            break;
          case "enum":
            val = reader.int32();
            break;
          case "message":
            val = readMessageField(reader, new field.V.T(), options, void 0);
            break;
        }
        break;
    }
  }
  if (key === void 0) {
    key = scalarZeroValue(field.K, LongType.BIGINT);
  }
  if (typeof key != "string" && typeof key != "number") {
    key = key.toString();
  }
  if (val === void 0) {
    switch (field.V.kind) {
      case "scalar":
        val = scalarZeroValue(field.V.T, LongType.BIGINT);
        break;
      case "enum":
        val = field.V.T.values[0].no;
        break;
      case "message":
        val = new field.V.T();
        break;
    }
  }
  return [key, val];
}
function readScalarLTString(reader, type) {
  const v = readScalar(reader, type);
  return typeof v == "bigint" ? v.toString() : v;
}
function readScalar(reader, type) {
  switch (type) {
    case ScalarType.STRING:
      return reader.string();
    case ScalarType.BOOL:
      return reader.bool();
    case ScalarType.DOUBLE:
      return reader.double();
    case ScalarType.FLOAT:
      return reader.float();
    case ScalarType.INT32:
      return reader.int32();
    case ScalarType.INT64:
      return reader.int64();
    case ScalarType.UINT64:
      return reader.uint64();
    case ScalarType.FIXED64:
      return reader.fixed64();
    case ScalarType.BYTES:
      return reader.bytes();
    case ScalarType.FIXED32:
      return reader.fixed32();
    case ScalarType.SFIXED32:
      return reader.sfixed32();
    case ScalarType.SFIXED64:
      return reader.sfixed64();
    case ScalarType.SINT64:
      return reader.sint64();
    case ScalarType.UINT32:
      return reader.uint32();
    case ScalarType.SINT32:
      return reader.sint32();
  }
}
function writeField(field, value, writer2, options) {
  assert(value !== void 0);
  const repeated = field.repeated;
  switch (field.kind) {
    case "scalar":
    case "enum":
      let scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
      if (repeated) {
        assert(Array.isArray(value));
        if (field.packed) {
          writePacked(writer2, scalarType, field.no, value);
        } else {
          for (const item of value) {
            writeScalar(writer2, scalarType, field.no, item);
          }
        }
      } else {
        writeScalar(writer2, scalarType, field.no, value);
      }
      break;
    case "message":
      if (repeated) {
        assert(Array.isArray(value));
        for (const item of value) {
          writeMessageField(writer2, options, field, item);
        }
      } else {
        writeMessageField(writer2, options, field, value);
      }
      break;
    case "map":
      assert(typeof value == "object" && value != null);
      for (const [key, val] of Object.entries(value)) {
        writeMapEntry(writer2, options, field, key, val);
      }
      break;
  }
}
function writeMapEntry(writer2, options, field, key, value) {
  writer2.tag(field.no, WireType.LengthDelimited);
  writer2.fork();
  let keyValue = key;
  switch (field.K) {
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
      keyValue = Number.parseInt(key);
      break;
    case ScalarType.BOOL:
      assert(key == "true" || key == "false");
      keyValue = key == "true";
      break;
  }
  writeScalar(writer2, field.K, 1, keyValue);
  switch (field.V.kind) {
    case "scalar":
      writeScalar(writer2, field.V.T, 2, value);
      break;
    case "enum":
      writeScalar(writer2, ScalarType.INT32, 2, value);
      break;
    case "message":
      assert(value !== void 0);
      writer2.tag(2, WireType.LengthDelimited).bytes(value.toBinary(options));
      break;
  }
  writer2.join();
}
function writeMessageField(writer2, options, field, value) {
  const message = wrapField(field.T, value);
  if (field.delimited)
    writer2.tag(field.no, WireType.StartGroup).raw(message.toBinary(options)).tag(field.no, WireType.EndGroup);
  else
    writer2.tag(field.no, WireType.LengthDelimited).bytes(message.toBinary(options));
}
function writeScalar(writer2, type, fieldNo, value) {
  assert(value !== void 0);
  let [wireType, method] = scalarTypeInfo(type);
  writer2.tag(fieldNo, wireType)[method](value);
}
function writePacked(writer2, type, fieldNo, value) {
  if (!value.length) {
    return;
  }
  writer2.tag(fieldNo, WireType.LengthDelimited).fork();
  let [, method] = scalarTypeInfo(type);
  for (let i = 0; i < value.length; i++) {
    writer2[method](value[i]);
  }
  writer2.join();
}
function scalarTypeInfo(type) {
  let wireType = WireType.Varint;
  switch (type) {
    case ScalarType.BYTES:
    case ScalarType.STRING:
      wireType = WireType.LengthDelimited;
      break;
    case ScalarType.DOUBLE:
    case ScalarType.FIXED64:
    case ScalarType.SFIXED64:
      wireType = WireType.Bit64;
      break;
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.FLOAT:
      wireType = WireType.Bit32;
      break;
  }
  const method = ScalarType[type].toLowerCase();
  return [wireType, method];
}
function makeUtilCommon() {
  return {
    setEnumType,
    initPartial(source, target) {
      if (source === void 0) {
        return;
      }
      const type = target.getType();
      for (const member of type.fields.byMember()) {
        const localName = member.localName, t = target, s = source;
        if (s[localName] == null) {
          continue;
        }
        switch (member.kind) {
          case "oneof":
            const sk = s[localName].case;
            if (sk === void 0) {
              continue;
            }
            const sourceField = member.findField(sk);
            let val = s[localName].value;
            if (sourceField && sourceField.kind == "message" && !isMessage(val, sourceField.T)) {
              val = new sourceField.T(val);
            } else if (sourceField && sourceField.kind === "scalar" && sourceField.T === ScalarType.BYTES) {
              val = toU8Arr(val);
            }
            t[localName] = {
              case: sk,
              value: val
            };
            break;
          case "scalar":
          case "enum":
            let copy = s[localName];
            if (member.T === ScalarType.BYTES) {
              copy = member.repeated ? copy.map(toU8Arr) : toU8Arr(copy);
            }
            t[localName] = copy;
            break;
          case "map":
            switch (member.V.kind) {
              case "scalar":
              case "enum":
                if (member.V.T === ScalarType.BYTES) {
                  for (const [k, v] of Object.entries(s[localName])) {
                    t[localName][k] = toU8Arr(v);
                  }
                } else {
                  Object.assign(t[localName], s[localName]);
                }
                break;
              case "message":
                const messageType = member.V.T;
                for (const k of Object.keys(s[localName])) {
                  let val2 = s[localName][k];
                  if (!messageType.fieldWrapper) {
                    val2 = new messageType(val2);
                  }
                  t[localName][k] = val2;
                }
                break;
            }
            break;
          case "message":
            const mt = member.T;
            if (member.repeated) {
              t[localName] = s[localName].map((val2) => isMessage(val2, mt) ? val2 : new mt(val2));
            } else {
              const val2 = s[localName];
              if (mt.fieldWrapper) {
                if (
                  // We can't use BytesValue.typeName as that will create a circular import
                  mt.typeName === "google.protobuf.BytesValue"
                ) {
                  t[localName] = toU8Arr(val2);
                } else {
                  t[localName] = val2;
                }
              } else {
                t[localName] = isMessage(val2, mt) ? val2 : new mt(val2);
              }
            }
            break;
        }
      }
    },
    // TODO use isFieldSet() here to support future field presence
    equals(type, a, b) {
      if (a === b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      return type.fields.byMember().every((m) => {
        const va = a[m.localName];
        const vb = b[m.localName];
        if (m.repeated) {
          if (va.length !== vb.length) {
            return false;
          }
          switch (m.kind) {
            case "message":
              return va.every((a2, i) => m.T.equals(a2, vb[i]));
            case "scalar":
              return va.every((a2, i) => scalarEquals(m.T, a2, vb[i]));
            case "enum":
              return va.every((a2, i) => scalarEquals(ScalarType.INT32, a2, vb[i]));
          }
          throw new Error("repeated cannot contain ".concat(m.kind));
        }
        switch (m.kind) {
          case "message":
            return m.T.equals(va, vb);
          case "enum":
            return scalarEquals(ScalarType.INT32, va, vb);
          case "scalar":
            return scalarEquals(m.T, va, vb);
          case "oneof":
            if (va.case !== vb.case) {
              return false;
            }
            const s = m.findField(va.case);
            if (s === void 0) {
              return true;
            }
            switch (s.kind) {
              case "message":
                return s.T.equals(va.value, vb.value);
              case "enum":
                return scalarEquals(ScalarType.INT32, va.value, vb.value);
              case "scalar":
                return scalarEquals(s.T, va.value, vb.value);
            }
            throw new Error("oneof cannot contain ".concat(s.kind));
          case "map":
            const keys = Object.keys(va).concat(Object.keys(vb));
            switch (m.V.kind) {
              case "message":
                const messageType = m.V.T;
                return keys.every((k) => messageType.equals(va[k], vb[k]));
              case "enum":
                return keys.every((k) => scalarEquals(ScalarType.INT32, va[k], vb[k]));
              case "scalar":
                const scalarType = m.V.T;
                return keys.every((k) => scalarEquals(scalarType, va[k], vb[k]));
            }
            break;
        }
      });
    },
    // TODO use isFieldSet() here to support future field presence
    clone(message) {
      const type = message.getType(), target = new type(), any = target;
      for (const member of type.fields.byMember()) {
        const source = message[member.localName];
        let copy;
        if (member.repeated) {
          copy = source.map(cloneSingularField);
        } else if (member.kind == "map") {
          copy = any[member.localName];
          for (const [key, v] of Object.entries(source)) {
            copy[key] = cloneSingularField(v);
          }
        } else if (member.kind == "oneof") {
          const f = member.findField(source.case);
          copy = f ? {
            case: source.case,
            value: cloneSingularField(source.value)
          } : {
            case: void 0
          };
        } else {
          copy = cloneSingularField(source);
        }
        any[member.localName] = copy;
      }
      for (const uf of type.runtime.bin.listUnknownFields(message)) {
        type.runtime.bin.onUnknownField(any, uf.no, uf.wireType, uf.data);
      }
      return target;
    }
  };
}
function cloneSingularField(value) {
  if (value === void 0) {
    return value;
  }
  if (isMessage(value)) {
    return value.clone();
  }
  if (value instanceof Uint8Array) {
    const c = new Uint8Array(value.byteLength);
    c.set(value);
    return c;
  }
  return value;
}
function toU8Arr(input) {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}
function makeProtoRuntime(syntax, newFieldList, initFields) {
  return {
    syntax,
    json: makeJsonFormat(),
    bin: makeBinaryFormat(),
    util: Object.assign(Object.assign({}, makeUtilCommon()), {
      newFieldList,
      initFields
    }),
    makeMessageType(typeName, fields, opt) {
      return makeMessageType(this, typeName, fields, opt);
    },
    makeEnum,
    makeEnumType,
    getEnumType,
    makeExtension(typeName, extendee, field) {
      return makeExtension(this, typeName, extendee, field);
    }
  };
}
var InternalFieldList = class {
  constructor(fields, normalizer) {
    this._fields = fields;
    this._normalizer = normalizer;
  }
  findJsonName(jsonName) {
    if (!this.jsonNames) {
      const t = {};
      for (const f of this.list()) {
        t[f.jsonName] = t[f.name] = f;
      }
      this.jsonNames = t;
    }
    return this.jsonNames[jsonName];
  }
  find(fieldNo) {
    if (!this.numbers) {
      const t = {};
      for (const f of this.list()) {
        t[f.no] = f;
      }
      this.numbers = t;
    }
    return this.numbers[fieldNo];
  }
  list() {
    if (!this.all) {
      this.all = this._normalizer(this._fields);
    }
    return this.all;
  }
  byNumber() {
    if (!this.numbersAsc) {
      this.numbersAsc = this.list().concat().sort((a, b) => a.no - b.no);
    }
    return this.numbersAsc;
  }
  byMember() {
    if (!this.members) {
      this.members = [];
      const a = this.members;
      let o2;
      for (const f of this.list()) {
        if (f.oneof) {
          if (f.oneof !== o2) {
            o2 = f.oneof;
            a.push(o2);
          }
        } else {
          a.push(f);
        }
      }
    }
    return this.members;
  }
};
function localFieldName(protoName, inOneof) {
  const name = protoCamelCase(protoName);
  if (inOneof) {
    return name;
  }
  return safeObjectProperty(safeMessageProperty(name));
}
function localOneofName(protoName) {
  return localFieldName(protoName, false);
}
var fieldJsonName = protoCamelCase;
function protoCamelCase(snakeCase) {
  let capNext = false;
  const b = [];
  for (let i = 0; i < snakeCase.length; i++) {
    let c = snakeCase.charAt(i);
    switch (c) {
      case "_":
        capNext = true;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        b.push(c);
        capNext = false;
        break;
      default:
        if (capNext) {
          capNext = false;
          c = c.toUpperCase();
        }
        b.push(c);
        break;
    }
  }
  return b.join("");
}
var reservedObjectProperties = /* @__PURE__ */ new Set([
  // names reserved by JavaScript
  "constructor",
  "toString",
  "toJSON",
  "valueOf"
]);
var reservedMessageProperties = /* @__PURE__ */ new Set([
  // names reserved by the runtime
  "getType",
  "clone",
  "equals",
  "fromBinary",
  "fromJson",
  "fromJsonString",
  "toBinary",
  "toJson",
  "toJsonString",
  // names reserved by the runtime for the future
  "toObject"
]);
var fallback = (name) => "".concat(name, "$");
var safeMessageProperty = (name) => {
  if (reservedMessageProperties.has(name)) {
    return fallback(name);
  }
  return name;
};
var safeObjectProperty = (name) => {
  if (reservedObjectProperties.has(name)) {
    return fallback(name);
  }
  return name;
};
var InternalOneofInfo = class {
  constructor(name) {
    this.kind = "oneof";
    this.repeated = false;
    this.packed = false;
    this.opt = false;
    this.req = false;
    this.default = void 0;
    this.fields = [];
    this.name = name;
    this.localName = localOneofName(name);
  }
  addField(field) {
    assert(field.oneof === this, "field ".concat(field.name, " not one of ").concat(this.name));
    this.fields.push(field);
  }
  findField(localName) {
    if (!this._lookup) {
      this._lookup = /* @__PURE__ */ Object.create(null);
      for (let i = 0; i < this.fields.length; i++) {
        this._lookup[this.fields[i].localName] = this.fields[i];
      }
    }
    return this._lookup[localName];
  }
};
function normalizeFieldInfos(fieldInfos, packedByDefault) {
  var _a, _b, _c, _d, _e, _f;
  const r2 = [];
  let o2;
  for (const field of typeof fieldInfos == "function" ? fieldInfos() : fieldInfos) {
    const f = field;
    f.localName = localFieldName(field.name, field.oneof !== void 0);
    f.jsonName = (_a = field.jsonName) !== null && _a !== void 0 ? _a : fieldJsonName(field.name);
    f.repeated = (_b = field.repeated) !== null && _b !== void 0 ? _b : false;
    if (field.kind == "scalar") {
      f.L = (_c = field.L) !== null && _c !== void 0 ? _c : LongType.BIGINT;
    }
    f.delimited = (_d = field.delimited) !== null && _d !== void 0 ? _d : false;
    f.req = (_e = field.req) !== null && _e !== void 0 ? _e : false;
    f.opt = (_f = field.opt) !== null && _f !== void 0 ? _f : false;
    if (field.packed === void 0) {
      {
        f.packed = field.kind == "enum" || field.kind == "scalar" && field.T != ScalarType.BYTES && field.T != ScalarType.STRING;
      }
    }
    if (field.oneof !== void 0) {
      const ooname = typeof field.oneof == "string" ? field.oneof : field.oneof.name;
      if (!o2 || o2.name != ooname) {
        o2 = new InternalOneofInfo(ooname);
      }
      f.oneof = o2;
      o2.addField(f);
    }
    r2.push(f);
  }
  return r2;
}
var proto3 = makeProtoRuntime(
  "proto3",
  (fields) => {
    return new InternalFieldList(fields, (source) => normalizeFieldInfos(source));
  },
  // TODO merge with proto2 and initExtensionField, also see initPartial, equals, clone
  (target) => {
    for (const member of target.getType().fields.byMember()) {
      if (member.opt) {
        continue;
      }
      const name = member.localName, t = target;
      if (member.repeated) {
        t[name] = [];
        continue;
      }
      switch (member.kind) {
        case "oneof":
          t[name] = {
            case: void 0
          };
          break;
        case "enum":
          t[name] = 0;
          break;
        case "map":
          t[name] = {};
          break;
        case "scalar":
          t[name] = scalarZeroValue(member.T, member.L);
          break;
      }
    }
  }
);
var Timestamp = class _Timestamp extends Message {
  constructor(data) {
    super();
    this.seconds = protoInt64.zero;
    this.nanos = 0;
    proto3.util.initPartial(data, this);
  }
  fromJson(json, options) {
    if (typeof json !== "string") {
      throw new Error("cannot decode google.protobuf.Timestamp from JSON: ".concat(proto3.json.debug(json)));
    }
    const matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
    if (!matches) {
      throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
    }
    const ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));
    if (Number.isNaN(ms)) {
      throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
    }
    if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
      throw new Error("cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
    }
    this.seconds = protoInt64.parse(ms / 1e3);
    this.nanos = 0;
    if (matches[7]) {
      this.nanos = parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1e9;
    }
    return this;
  }
  toJson(options) {
    const ms = Number(this.seconds) * 1e3;
    if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
      throw new Error("cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
    }
    if (this.nanos < 0) {
      throw new Error("cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative");
    }
    let z = "Z";
    if (this.nanos > 0) {
      const nanosStr = (this.nanos + 1e9).toString().substring(1);
      if (nanosStr.substring(3) === "000000") {
        z = "." + nanosStr.substring(0, 3) + "Z";
      } else if (nanosStr.substring(6) === "000") {
        z = "." + nanosStr.substring(0, 6) + "Z";
      } else {
        z = "." + nanosStr + "Z";
      }
    }
    return new Date(ms).toISOString().replace(".000Z", z);
  }
  toDate() {
    return new Date(Number(this.seconds) * 1e3 + Math.ceil(this.nanos / 1e6));
  }
  static now() {
    return _Timestamp.fromDate(/* @__PURE__ */ new Date());
  }
  static fromDate(date) {
    const ms = date.getTime();
    return new _Timestamp({
      seconds: protoInt64.parse(Math.floor(ms / 1e3)),
      nanos: ms % 1e3 * 1e6
    });
  }
  static fromBinary(bytes, options) {
    return new _Timestamp().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Timestamp().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Timestamp().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Timestamp, a, b);
  }
};
Timestamp.runtime = proto3;
Timestamp.typeName = "google.protobuf.Timestamp";
Timestamp.fields = proto3.util.newFieldList(() => [{
  no: 1,
  name: "seconds",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 2,
  name: "nanos",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}]);
var MetricsBatch = proto3.makeMessageType("livekit.MetricsBatch", () => [{
  no: 1,
  name: "timestamp_ms",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 2,
  name: "normalized_timestamp",
  kind: "message",
  T: Timestamp
}, {
  no: 3,
  name: "str_data",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 4,
  name: "time_series",
  kind: "message",
  T: TimeSeriesMetric,
  repeated: true
}, {
  no: 5,
  name: "events",
  kind: "message",
  T: EventMetric,
  repeated: true
}]);
var TimeSeriesMetric = proto3.makeMessageType("livekit.TimeSeriesMetric", () => [{
  no: 1,
  name: "label",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 2,
  name: "participant_identity",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 3,
  name: "track_sid",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 4,
  name: "samples",
  kind: "message",
  T: MetricSample,
  repeated: true
}, {
  no: 5,
  name: "rid",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}]);
var MetricSample = proto3.makeMessageType("livekit.MetricSample", () => [{
  no: 1,
  name: "timestamp_ms",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 2,
  name: "normalized_timestamp",
  kind: "message",
  T: Timestamp
}, {
  no: 3,
  name: "value",
  kind: "scalar",
  T: 2
  /* ScalarType.FLOAT */
}]);
var EventMetric = proto3.makeMessageType("livekit.EventMetric", () => [{
  no: 1,
  name: "label",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 2,
  name: "participant_identity",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 3,
  name: "track_sid",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 4,
  name: "start_timestamp_ms",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 5,
  name: "end_timestamp_ms",
  kind: "scalar",
  T: 3,
  opt: true
}, {
  no: 6,
  name: "normalized_start_timestamp",
  kind: "message",
  T: Timestamp
}, {
  no: 7,
  name: "normalized_end_timestamp",
  kind: "message",
  T: Timestamp,
  opt: true
}, {
  no: 8,
  name: "metadata",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 9,
  name: "rid",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}]);
var BackupCodecPolicy$1 = proto3.makeEnum("livekit.BackupCodecPolicy", [{
  no: 0,
  name: "REGRESSION"
}, {
  no: 1,
  name: "SIMULCAST"
}]);
var TrackType = proto3.makeEnum("livekit.TrackType", [{
  no: 0,
  name: "AUDIO"
}, {
  no: 1,
  name: "VIDEO"
}, {
  no: 2,
  name: "DATA"
}]);
var TrackSource = proto3.makeEnum("livekit.TrackSource", [{
  no: 0,
  name: "UNKNOWN"
}, {
  no: 1,
  name: "CAMERA"
}, {
  no: 2,
  name: "MICROPHONE"
}, {
  no: 3,
  name: "SCREEN_SHARE"
}, {
  no: 4,
  name: "SCREEN_SHARE_AUDIO"
}]);
var VideoQuality$1 = proto3.makeEnum("livekit.VideoQuality", [{
  no: 0,
  name: "LOW"
}, {
  no: 1,
  name: "MEDIUM"
}, {
  no: 2,
  name: "HIGH"
}, {
  no: 3,
  name: "OFF"
}]);
var ConnectionQuality$1 = proto3.makeEnum("livekit.ConnectionQuality", [{
  no: 0,
  name: "POOR"
}, {
  no: 1,
  name: "GOOD"
}, {
  no: 2,
  name: "EXCELLENT"
}, {
  no: 3,
  name: "LOST"
}]);
var ClientConfigSetting = proto3.makeEnum("livekit.ClientConfigSetting", [{
  no: 0,
  name: "UNSET"
}, {
  no: 1,
  name: "DISABLED"
}, {
  no: 2,
  name: "ENABLED"
}]);
var DisconnectReason = proto3.makeEnum("livekit.DisconnectReason", [{
  no: 0,
  name: "UNKNOWN_REASON"
}, {
  no: 1,
  name: "CLIENT_INITIATED"
}, {
  no: 2,
  name: "DUPLICATE_IDENTITY"
}, {
  no: 3,
  name: "SERVER_SHUTDOWN"
}, {
  no: 4,
  name: "PARTICIPANT_REMOVED"
}, {
  no: 5,
  name: "ROOM_DELETED"
}, {
  no: 6,
  name: "STATE_MISMATCH"
}, {
  no: 7,
  name: "JOIN_FAILURE"
}, {
  no: 8,
  name: "MIGRATION"
}, {
  no: 9,
  name: "SIGNAL_CLOSE"
}, {
  no: 10,
  name: "ROOM_CLOSED"
}, {
  no: 11,
  name: "USER_UNAVAILABLE"
}, {
  no: 12,
  name: "USER_REJECTED"
}, {
  no: 13,
  name: "SIP_TRUNK_FAILURE"
}]);
var ReconnectReason = proto3.makeEnum("livekit.ReconnectReason", [{
  no: 0,
  name: "RR_UNKNOWN"
}, {
  no: 1,
  name: "RR_SIGNAL_DISCONNECTED"
}, {
  no: 2,
  name: "RR_PUBLISHER_FAILED"
}, {
  no: 3,
  name: "RR_SUBSCRIBER_FAILED"
}, {
  no: 4,
  name: "RR_SWITCH_CANDIDATE"
}]);
var SubscriptionError = proto3.makeEnum("livekit.SubscriptionError", [{
  no: 0,
  name: "SE_UNKNOWN"
}, {
  no: 1,
  name: "SE_CODEC_UNSUPPORTED"
}, {
  no: 2,
  name: "SE_TRACK_NOTFOUND"
}]);
var AudioTrackFeature = proto3.makeEnum("livekit.AudioTrackFeature", [{
  no: 0,
  name: "TF_STEREO"
}, {
  no: 1,
  name: "TF_NO_DTX"
}, {
  no: 2,
  name: "TF_AUTO_GAIN_CONTROL"
}, {
  no: 3,
  name: "TF_ECHO_CANCELLATION"
}, {
  no: 4,
  name: "TF_NOISE_SUPPRESSION"
}, {
  no: 5,
  name: "TF_ENHANCED_NOISE_CANCELLATION"
}]);
var Room$1 = proto3.makeMessageType("livekit.Room", () => [{
  no: 1,
  name: "sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "name",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "empty_timeout",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 14,
  name: "departure_timeout",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 4,
  name: "max_participants",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 5,
  name: "creation_time",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 15,
  name: "creation_time_ms",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 6,
  name: "turn_password",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 7,
  name: "enabled_codecs",
  kind: "message",
  T: Codec,
  repeated: true
}, {
  no: 8,
  name: "metadata",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 9,
  name: "num_participants",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 11,
  name: "num_publishers",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 10,
  name: "active_recording",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 13,
  name: "version",
  kind: "message",
  T: TimedVersion
}]);
var Codec = proto3.makeMessageType("livekit.Codec", () => [{
  no: 1,
  name: "mime",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "fmtp_line",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var ParticipantPermission = proto3.makeMessageType("livekit.ParticipantPermission", () => [{
  no: 1,
  name: "can_subscribe",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 2,
  name: "can_publish",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 3,
  name: "can_publish_data",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 9,
  name: "can_publish_sources",
  kind: "enum",
  T: proto3.getEnumType(TrackSource),
  repeated: true
}, {
  no: 7,
  name: "hidden",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 8,
  name: "recorder",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 10,
  name: "can_update_metadata",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 11,
  name: "agent",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 12,
  name: "can_subscribe_metrics",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var ParticipantInfo = proto3.makeMessageType("livekit.ParticipantInfo", () => [{
  no: 1,
  name: "sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "identity",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "state",
  kind: "enum",
  T: proto3.getEnumType(ParticipantInfo_State)
}, {
  no: 4,
  name: "tracks",
  kind: "message",
  T: TrackInfo,
  repeated: true
}, {
  no: 5,
  name: "metadata",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 6,
  name: "joined_at",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 17,
  name: "joined_at_ms",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 9,
  name: "name",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 10,
  name: "version",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 11,
  name: "permission",
  kind: "message",
  T: ParticipantPermission
}, {
  no: 12,
  name: "region",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 13,
  name: "is_publisher",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 14,
  name: "kind",
  kind: "enum",
  T: proto3.getEnumType(ParticipantInfo_Kind)
}, {
  no: 15,
  name: "attributes",
  kind: "map",
  K: 9,
  V: {
    kind: "scalar",
    T: 9
    /* ScalarType.STRING */
  }
}, {
  no: 16,
  name: "disconnect_reason",
  kind: "enum",
  T: proto3.getEnumType(DisconnectReason)
}]);
var ParticipantInfo_State = proto3.makeEnum("livekit.ParticipantInfo.State", [{
  no: 0,
  name: "JOINING"
}, {
  no: 1,
  name: "JOINED"
}, {
  no: 2,
  name: "ACTIVE"
}, {
  no: 3,
  name: "DISCONNECTED"
}]);
var ParticipantInfo_Kind = proto3.makeEnum("livekit.ParticipantInfo.Kind", [{
  no: 0,
  name: "STANDARD"
}, {
  no: 1,
  name: "INGRESS"
}, {
  no: 2,
  name: "EGRESS"
}, {
  no: 3,
  name: "SIP"
}, {
  no: 4,
  name: "AGENT"
}]);
var Encryption_Type = proto3.makeEnum("livekit.Encryption.Type", [{
  no: 0,
  name: "NONE"
}, {
  no: 1,
  name: "GCM"
}, {
  no: 2,
  name: "CUSTOM"
}]);
var SimulcastCodecInfo = proto3.makeMessageType("livekit.SimulcastCodecInfo", () => [{
  no: 1,
  name: "mime_type",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "mid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "cid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 4,
  name: "layers",
  kind: "message",
  T: VideoLayer,
  repeated: true
}]);
var TrackInfo = proto3.makeMessageType("livekit.TrackInfo", () => [{
  no: 1,
  name: "sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "type",
  kind: "enum",
  T: proto3.getEnumType(TrackType)
}, {
  no: 3,
  name: "name",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 4,
  name: "muted",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 5,
  name: "width",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 6,
  name: "height",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 7,
  name: "simulcast",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 8,
  name: "disable_dtx",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 9,
  name: "source",
  kind: "enum",
  T: proto3.getEnumType(TrackSource)
}, {
  no: 10,
  name: "layers",
  kind: "message",
  T: VideoLayer,
  repeated: true
}, {
  no: 11,
  name: "mime_type",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 12,
  name: "mid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 13,
  name: "codecs",
  kind: "message",
  T: SimulcastCodecInfo,
  repeated: true
}, {
  no: 14,
  name: "stereo",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 15,
  name: "disable_red",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 16,
  name: "encryption",
  kind: "enum",
  T: proto3.getEnumType(Encryption_Type)
}, {
  no: 17,
  name: "stream",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 18,
  name: "version",
  kind: "message",
  T: TimedVersion
}, {
  no: 19,
  name: "audio_features",
  kind: "enum",
  T: proto3.getEnumType(AudioTrackFeature),
  repeated: true
}, {
  no: 20,
  name: "backup_codec_policy",
  kind: "enum",
  T: proto3.getEnumType(BackupCodecPolicy$1)
}]);
var VideoLayer = proto3.makeMessageType("livekit.VideoLayer", () => [{
  no: 1,
  name: "quality",
  kind: "enum",
  T: proto3.getEnumType(VideoQuality$1)
}, {
  no: 2,
  name: "width",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 3,
  name: "height",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 4,
  name: "bitrate",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 5,
  name: "ssrc",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}]);
var DataPacket = proto3.makeMessageType("livekit.DataPacket", () => [{
  no: 1,
  name: "kind",
  kind: "enum",
  T: proto3.getEnumType(DataPacket_Kind)
}, {
  no: 4,
  name: "participant_identity",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 5,
  name: "destination_identities",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 2,
  name: "user",
  kind: "message",
  T: UserPacket,
  oneof: "value"
}, {
  no: 3,
  name: "speaker",
  kind: "message",
  T: ActiveSpeakerUpdate,
  oneof: "value"
}, {
  no: 6,
  name: "sip_dtmf",
  kind: "message",
  T: SipDTMF,
  oneof: "value"
}, {
  no: 7,
  name: "transcription",
  kind: "message",
  T: Transcription,
  oneof: "value"
}, {
  no: 8,
  name: "metrics",
  kind: "message",
  T: MetricsBatch,
  oneof: "value"
}, {
  no: 9,
  name: "chat_message",
  kind: "message",
  T: ChatMessage,
  oneof: "value"
}, {
  no: 10,
  name: "rpc_request",
  kind: "message",
  T: RpcRequest,
  oneof: "value"
}, {
  no: 11,
  name: "rpc_ack",
  kind: "message",
  T: RpcAck,
  oneof: "value"
}, {
  no: 12,
  name: "rpc_response",
  kind: "message",
  T: RpcResponse,
  oneof: "value"
}, {
  no: 13,
  name: "stream_header",
  kind: "message",
  T: DataStream_Header,
  oneof: "value"
}, {
  no: 14,
  name: "stream_chunk",
  kind: "message",
  T: DataStream_Chunk,
  oneof: "value"
}, {
  no: 15,
  name: "stream_trailer",
  kind: "message",
  T: DataStream_Trailer,
  oneof: "value"
}]);
var DataPacket_Kind = proto3.makeEnum("livekit.DataPacket.Kind", [{
  no: 0,
  name: "RELIABLE"
}, {
  no: 1,
  name: "LOSSY"
}]);
var ActiveSpeakerUpdate = proto3.makeMessageType("livekit.ActiveSpeakerUpdate", () => [{
  no: 1,
  name: "speakers",
  kind: "message",
  T: SpeakerInfo,
  repeated: true
}]);
var SpeakerInfo = proto3.makeMessageType("livekit.SpeakerInfo", () => [{
  no: 1,
  name: "sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "level",
  kind: "scalar",
  T: 2
  /* ScalarType.FLOAT */
}, {
  no: 3,
  name: "active",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var UserPacket = proto3.makeMessageType("livekit.UserPacket", () => [{
  no: 1,
  name: "participant_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 5,
  name: "participant_identity",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "payload",
  kind: "scalar",
  T: 12
  /* ScalarType.BYTES */
}, {
  no: 3,
  name: "destination_sids",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 6,
  name: "destination_identities",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 4,
  name: "topic",
  kind: "scalar",
  T: 9,
  opt: true
}, {
  no: 8,
  name: "id",
  kind: "scalar",
  T: 9,
  opt: true
}, {
  no: 9,
  name: "start_time",
  kind: "scalar",
  T: 4,
  opt: true
}, {
  no: 10,
  name: "end_time",
  kind: "scalar",
  T: 4,
  opt: true
}, {
  no: 11,
  name: "nonce",
  kind: "scalar",
  T: 12
  /* ScalarType.BYTES */
}]);
var SipDTMF = proto3.makeMessageType("livekit.SipDTMF", () => [{
  no: 3,
  name: "code",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 4,
  name: "digit",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var Transcription = proto3.makeMessageType("livekit.Transcription", () => [{
  no: 2,
  name: "transcribed_participant_identity",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "track_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 4,
  name: "segments",
  kind: "message",
  T: TranscriptionSegment,
  repeated: true
}]);
var TranscriptionSegment = proto3.makeMessageType("livekit.TranscriptionSegment", () => [{
  no: 1,
  name: "id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "text",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "start_time",
  kind: "scalar",
  T: 4
  /* ScalarType.UINT64 */
}, {
  no: 4,
  name: "end_time",
  kind: "scalar",
  T: 4
  /* ScalarType.UINT64 */
}, {
  no: 5,
  name: "final",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 6,
  name: "language",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var ChatMessage = proto3.makeMessageType("livekit.ChatMessage", () => [{
  no: 1,
  name: "id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "timestamp",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 3,
  name: "edit_timestamp",
  kind: "scalar",
  T: 3,
  opt: true
}, {
  no: 4,
  name: "message",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 5,
  name: "deleted",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 6,
  name: "generated",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var RpcRequest = proto3.makeMessageType("livekit.RpcRequest", () => [{
  no: 1,
  name: "id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "method",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "payload",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 4,
  name: "response_timeout_ms",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 5,
  name: "version",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}]);
var RpcAck = proto3.makeMessageType("livekit.RpcAck", () => [{
  no: 1,
  name: "request_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var RpcResponse = proto3.makeMessageType("livekit.RpcResponse", () => [{
  no: 1,
  name: "request_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "payload",
  kind: "scalar",
  T: 9,
  oneof: "value"
}, {
  no: 3,
  name: "error",
  kind: "message",
  T: RpcError$1,
  oneof: "value"
}]);
var RpcError$1 = proto3.makeMessageType("livekit.RpcError", () => [{
  no: 1,
  name: "code",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 2,
  name: "message",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "data",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var ParticipantTracks = proto3.makeMessageType("livekit.ParticipantTracks", () => [{
  no: 1,
  name: "participant_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "track_sids",
  kind: "scalar",
  T: 9,
  repeated: true
}]);
var ServerInfo = proto3.makeMessageType("livekit.ServerInfo", () => [{
  no: 1,
  name: "edition",
  kind: "enum",
  T: proto3.getEnumType(ServerInfo_Edition)
}, {
  no: 2,
  name: "version",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "protocol",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}, {
  no: 4,
  name: "region",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 5,
  name: "node_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 6,
  name: "debug_info",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 7,
  name: "agent_protocol",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}]);
var ServerInfo_Edition = proto3.makeEnum("livekit.ServerInfo.Edition", [{
  no: 0,
  name: "Standard"
}, {
  no: 1,
  name: "Cloud"
}]);
var ClientInfo = proto3.makeMessageType("livekit.ClientInfo", () => [{
  no: 1,
  name: "sdk",
  kind: "enum",
  T: proto3.getEnumType(ClientInfo_SDK)
}, {
  no: 2,
  name: "version",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "protocol",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}, {
  no: 4,
  name: "os",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 5,
  name: "os_version",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 6,
  name: "device_model",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 7,
  name: "browser",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 8,
  name: "browser_version",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 9,
  name: "address",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 10,
  name: "network",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 11,
  name: "other_sdks",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var ClientInfo_SDK = proto3.makeEnum("livekit.ClientInfo.SDK", [{
  no: 0,
  name: "UNKNOWN"
}, {
  no: 1,
  name: "JS"
}, {
  no: 2,
  name: "SWIFT"
}, {
  no: 3,
  name: "ANDROID"
}, {
  no: 4,
  name: "FLUTTER"
}, {
  no: 5,
  name: "GO"
}, {
  no: 6,
  name: "UNITY"
}, {
  no: 7,
  name: "REACT_NATIVE"
}, {
  no: 8,
  name: "RUST"
}, {
  no: 9,
  name: "PYTHON"
}, {
  no: 10,
  name: "CPP"
}, {
  no: 11,
  name: "UNITY_WEB"
}, {
  no: 12,
  name: "NODE"
}]);
var ClientConfiguration = proto3.makeMessageType("livekit.ClientConfiguration", () => [{
  no: 1,
  name: "video",
  kind: "message",
  T: VideoConfiguration
}, {
  no: 2,
  name: "screen",
  kind: "message",
  T: VideoConfiguration
}, {
  no: 3,
  name: "resume_connection",
  kind: "enum",
  T: proto3.getEnumType(ClientConfigSetting)
}, {
  no: 4,
  name: "disabled_codecs",
  kind: "message",
  T: DisabledCodecs
}, {
  no: 5,
  name: "force_relay",
  kind: "enum",
  T: proto3.getEnumType(ClientConfigSetting)
}]);
var VideoConfiguration = proto3.makeMessageType("livekit.VideoConfiguration", () => [{
  no: 1,
  name: "hardware_encoder",
  kind: "enum",
  T: proto3.getEnumType(ClientConfigSetting)
}]);
var DisabledCodecs = proto3.makeMessageType("livekit.DisabledCodecs", () => [{
  no: 1,
  name: "codecs",
  kind: "message",
  T: Codec,
  repeated: true
}, {
  no: 2,
  name: "publish",
  kind: "message",
  T: Codec,
  repeated: true
}]);
var TimedVersion = proto3.makeMessageType("livekit.TimedVersion", () => [{
  no: 1,
  name: "unix_micro",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 2,
  name: "ticks",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}]);
var DataStream_OperationType = proto3.makeEnum("livekit.DataStream.OperationType", [{
  no: 0,
  name: "CREATE"
}, {
  no: 1,
  name: "UPDATE"
}, {
  no: 2,
  name: "DELETE"
}, {
  no: 3,
  name: "REACTION"
}]);
var DataStream_TextHeader = proto3.makeMessageType("livekit.DataStream.TextHeader", () => [{
  no: 1,
  name: "operation_type",
  kind: "enum",
  T: proto3.getEnumType(DataStream_OperationType)
}, {
  no: 2,
  name: "version",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}, {
  no: 3,
  name: "reply_to_stream_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 4,
  name: "attached_stream_ids",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 5,
  name: "generated",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}], {
  localName: "DataStream_TextHeader"
});
var DataStream_ByteHeader = proto3.makeMessageType("livekit.DataStream.ByteHeader", () => [{
  no: 1,
  name: "name",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}], {
  localName: "DataStream_ByteHeader"
});
var DataStream_Header = proto3.makeMessageType("livekit.DataStream.Header", () => [{
  no: 1,
  name: "stream_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "timestamp",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 3,
  name: "topic",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 4,
  name: "mime_type",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 5,
  name: "total_length",
  kind: "scalar",
  T: 4,
  opt: true
}, {
  no: 7,
  name: "encryption_type",
  kind: "enum",
  T: proto3.getEnumType(Encryption_Type)
}, {
  no: 8,
  name: "attributes",
  kind: "map",
  K: 9,
  V: {
    kind: "scalar",
    T: 9
    /* ScalarType.STRING */
  }
}, {
  no: 9,
  name: "text_header",
  kind: "message",
  T: DataStream_TextHeader,
  oneof: "content_header"
}, {
  no: 10,
  name: "byte_header",
  kind: "message",
  T: DataStream_ByteHeader,
  oneof: "content_header"
}], {
  localName: "DataStream_Header"
});
var DataStream_Chunk = proto3.makeMessageType("livekit.DataStream.Chunk", () => [{
  no: 1,
  name: "stream_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "chunk_index",
  kind: "scalar",
  T: 4
  /* ScalarType.UINT64 */
}, {
  no: 3,
  name: "content",
  kind: "scalar",
  T: 12
  /* ScalarType.BYTES */
}, {
  no: 4,
  name: "version",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}, {
  no: 5,
  name: "iv",
  kind: "scalar",
  T: 12,
  opt: true
}], {
  localName: "DataStream_Chunk"
});
var DataStream_Trailer = proto3.makeMessageType("livekit.DataStream.Trailer", () => [{
  no: 1,
  name: "stream_id",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "reason",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "attributes",
  kind: "map",
  K: 9,
  V: {
    kind: "scalar",
    T: 9
    /* ScalarType.STRING */
  }
}], {
  localName: "DataStream_Trailer"
});
var SignalTarget = proto3.makeEnum("livekit.SignalTarget", [{
  no: 0,
  name: "PUBLISHER"
}, {
  no: 1,
  name: "SUBSCRIBER"
}]);
var StreamState = proto3.makeEnum("livekit.StreamState", [{
  no: 0,
  name: "ACTIVE"
}, {
  no: 1,
  name: "PAUSED"
}]);
var CandidateProtocol = proto3.makeEnum("livekit.CandidateProtocol", [{
  no: 0,
  name: "UDP"
}, {
  no: 1,
  name: "TCP"
}, {
  no: 2,
  name: "TLS"
}]);
var SignalRequest = proto3.makeMessageType("livekit.SignalRequest", () => [{
  no: 1,
  name: "offer",
  kind: "message",
  T: SessionDescription,
  oneof: "message"
}, {
  no: 2,
  name: "answer",
  kind: "message",
  T: SessionDescription,
  oneof: "message"
}, {
  no: 3,
  name: "trickle",
  kind: "message",
  T: TrickleRequest,
  oneof: "message"
}, {
  no: 4,
  name: "add_track",
  kind: "message",
  T: AddTrackRequest,
  oneof: "message"
}, {
  no: 5,
  name: "mute",
  kind: "message",
  T: MuteTrackRequest,
  oneof: "message"
}, {
  no: 6,
  name: "subscription",
  kind: "message",
  T: UpdateSubscription,
  oneof: "message"
}, {
  no: 7,
  name: "track_setting",
  kind: "message",
  T: UpdateTrackSettings,
  oneof: "message"
}, {
  no: 8,
  name: "leave",
  kind: "message",
  T: LeaveRequest,
  oneof: "message"
}, {
  no: 10,
  name: "update_layers",
  kind: "message",
  T: UpdateVideoLayers,
  oneof: "message"
}, {
  no: 11,
  name: "subscription_permission",
  kind: "message",
  T: SubscriptionPermission,
  oneof: "message"
}, {
  no: 12,
  name: "sync_state",
  kind: "message",
  T: SyncState,
  oneof: "message"
}, {
  no: 13,
  name: "simulate",
  kind: "message",
  T: SimulateScenario,
  oneof: "message"
}, {
  no: 14,
  name: "ping",
  kind: "scalar",
  T: 3,
  oneof: "message"
}, {
  no: 15,
  name: "update_metadata",
  kind: "message",
  T: UpdateParticipantMetadata,
  oneof: "message"
}, {
  no: 16,
  name: "ping_req",
  kind: "message",
  T: Ping,
  oneof: "message"
}, {
  no: 17,
  name: "update_audio_track",
  kind: "message",
  T: UpdateLocalAudioTrack,
  oneof: "message"
}, {
  no: 18,
  name: "update_video_track",
  kind: "message",
  T: UpdateLocalVideoTrack,
  oneof: "message"
}]);
var SignalResponse = proto3.makeMessageType("livekit.SignalResponse", () => [{
  no: 1,
  name: "join",
  kind: "message",
  T: JoinResponse,
  oneof: "message"
}, {
  no: 2,
  name: "answer",
  kind: "message",
  T: SessionDescription,
  oneof: "message"
}, {
  no: 3,
  name: "offer",
  kind: "message",
  T: SessionDescription,
  oneof: "message"
}, {
  no: 4,
  name: "trickle",
  kind: "message",
  T: TrickleRequest,
  oneof: "message"
}, {
  no: 5,
  name: "update",
  kind: "message",
  T: ParticipantUpdate,
  oneof: "message"
}, {
  no: 6,
  name: "track_published",
  kind: "message",
  T: TrackPublishedResponse,
  oneof: "message"
}, {
  no: 8,
  name: "leave",
  kind: "message",
  T: LeaveRequest,
  oneof: "message"
}, {
  no: 9,
  name: "mute",
  kind: "message",
  T: MuteTrackRequest,
  oneof: "message"
}, {
  no: 10,
  name: "speakers_changed",
  kind: "message",
  T: SpeakersChanged,
  oneof: "message"
}, {
  no: 11,
  name: "room_update",
  kind: "message",
  T: RoomUpdate,
  oneof: "message"
}, {
  no: 12,
  name: "connection_quality",
  kind: "message",
  T: ConnectionQualityUpdate,
  oneof: "message"
}, {
  no: 13,
  name: "stream_state_update",
  kind: "message",
  T: StreamStateUpdate,
  oneof: "message"
}, {
  no: 14,
  name: "subscribed_quality_update",
  kind: "message",
  T: SubscribedQualityUpdate,
  oneof: "message"
}, {
  no: 15,
  name: "subscription_permission_update",
  kind: "message",
  T: SubscriptionPermissionUpdate,
  oneof: "message"
}, {
  no: 16,
  name: "refresh_token",
  kind: "scalar",
  T: 9,
  oneof: "message"
}, {
  no: 17,
  name: "track_unpublished",
  kind: "message",
  T: TrackUnpublishedResponse,
  oneof: "message"
}, {
  no: 18,
  name: "pong",
  kind: "scalar",
  T: 3,
  oneof: "message"
}, {
  no: 19,
  name: "reconnect",
  kind: "message",
  T: ReconnectResponse,
  oneof: "message"
}, {
  no: 20,
  name: "pong_resp",
  kind: "message",
  T: Pong,
  oneof: "message"
}, {
  no: 21,
  name: "subscription_response",
  kind: "message",
  T: SubscriptionResponse,
  oneof: "message"
}, {
  no: 22,
  name: "request_response",
  kind: "message",
  T: RequestResponse,
  oneof: "message"
}, {
  no: 23,
  name: "track_subscribed",
  kind: "message",
  T: TrackSubscribed,
  oneof: "message"
}]);
var SimulcastCodec = proto3.makeMessageType("livekit.SimulcastCodec", () => [{
  no: 1,
  name: "codec",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "cid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var AddTrackRequest = proto3.makeMessageType("livekit.AddTrackRequest", () => [{
  no: 1,
  name: "cid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "name",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "type",
  kind: "enum",
  T: proto3.getEnumType(TrackType)
}, {
  no: 4,
  name: "width",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 5,
  name: "height",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 6,
  name: "muted",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 7,
  name: "disable_dtx",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 8,
  name: "source",
  kind: "enum",
  T: proto3.getEnumType(TrackSource)
}, {
  no: 9,
  name: "layers",
  kind: "message",
  T: VideoLayer,
  repeated: true
}, {
  no: 10,
  name: "simulcast_codecs",
  kind: "message",
  T: SimulcastCodec,
  repeated: true
}, {
  no: 11,
  name: "sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 12,
  name: "stereo",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 13,
  name: "disable_red",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 14,
  name: "encryption",
  kind: "enum",
  T: proto3.getEnumType(Encryption_Type)
}, {
  no: 15,
  name: "stream",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 16,
  name: "backup_codec_policy",
  kind: "enum",
  T: proto3.getEnumType(BackupCodecPolicy$1)
}]);
var TrickleRequest = proto3.makeMessageType("livekit.TrickleRequest", () => [{
  no: 1,
  name: "candidateInit",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "target",
  kind: "enum",
  T: proto3.getEnumType(SignalTarget)
}, {
  no: 3,
  name: "final",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var MuteTrackRequest = proto3.makeMessageType("livekit.MuteTrackRequest", () => [{
  no: 1,
  name: "sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "muted",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var JoinResponse = proto3.makeMessageType("livekit.JoinResponse", () => [{
  no: 1,
  name: "room",
  kind: "message",
  T: Room$1
}, {
  no: 2,
  name: "participant",
  kind: "message",
  T: ParticipantInfo
}, {
  no: 3,
  name: "other_participants",
  kind: "message",
  T: ParticipantInfo,
  repeated: true
}, {
  no: 4,
  name: "server_version",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 5,
  name: "ice_servers",
  kind: "message",
  T: ICEServer,
  repeated: true
}, {
  no: 6,
  name: "subscriber_primary",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 7,
  name: "alternative_url",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 8,
  name: "client_configuration",
  kind: "message",
  T: ClientConfiguration
}, {
  no: 9,
  name: "server_region",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 10,
  name: "ping_timeout",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}, {
  no: 11,
  name: "ping_interval",
  kind: "scalar",
  T: 5
  /* ScalarType.INT32 */
}, {
  no: 12,
  name: "server_info",
  kind: "message",
  T: ServerInfo
}, {
  no: 13,
  name: "sif_trailer",
  kind: "scalar",
  T: 12
  /* ScalarType.BYTES */
}, {
  no: 14,
  name: "enabled_publish_codecs",
  kind: "message",
  T: Codec,
  repeated: true
}, {
  no: 15,
  name: "fast_publish",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var ReconnectResponse = proto3.makeMessageType("livekit.ReconnectResponse", () => [{
  no: 1,
  name: "ice_servers",
  kind: "message",
  T: ICEServer,
  repeated: true
}, {
  no: 2,
  name: "client_configuration",
  kind: "message",
  T: ClientConfiguration
}]);
var TrackPublishedResponse = proto3.makeMessageType("livekit.TrackPublishedResponse", () => [{
  no: 1,
  name: "cid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "track",
  kind: "message",
  T: TrackInfo
}]);
var TrackUnpublishedResponse = proto3.makeMessageType("livekit.TrackUnpublishedResponse", () => [{
  no: 1,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var SessionDescription = proto3.makeMessageType("livekit.SessionDescription", () => [{
  no: 1,
  name: "type",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "sdp",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var ParticipantUpdate = proto3.makeMessageType("livekit.ParticipantUpdate", () => [{
  no: 1,
  name: "participants",
  kind: "message",
  T: ParticipantInfo,
  repeated: true
}]);
var UpdateSubscription = proto3.makeMessageType("livekit.UpdateSubscription", () => [{
  no: 1,
  name: "track_sids",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 2,
  name: "subscribe",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 3,
  name: "participant_tracks",
  kind: "message",
  T: ParticipantTracks,
  repeated: true
}]);
var UpdateTrackSettings = proto3.makeMessageType("livekit.UpdateTrackSettings", () => [{
  no: 1,
  name: "track_sids",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 3,
  name: "disabled",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 4,
  name: "quality",
  kind: "enum",
  T: proto3.getEnumType(VideoQuality$1)
}, {
  no: 5,
  name: "width",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 6,
  name: "height",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 7,
  name: "fps",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 8,
  name: "priority",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}]);
var UpdateLocalAudioTrack = proto3.makeMessageType("livekit.UpdateLocalAudioTrack", () => [{
  no: 1,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "features",
  kind: "enum",
  T: proto3.getEnumType(AudioTrackFeature),
  repeated: true
}]);
var UpdateLocalVideoTrack = proto3.makeMessageType("livekit.UpdateLocalVideoTrack", () => [{
  no: 1,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "width",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 3,
  name: "height",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}]);
var LeaveRequest = proto3.makeMessageType("livekit.LeaveRequest", () => [{
  no: 1,
  name: "can_reconnect",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 2,
  name: "reason",
  kind: "enum",
  T: proto3.getEnumType(DisconnectReason)
}, {
  no: 3,
  name: "action",
  kind: "enum",
  T: proto3.getEnumType(LeaveRequest_Action)
}, {
  no: 4,
  name: "regions",
  kind: "message",
  T: RegionSettings
}]);
var LeaveRequest_Action = proto3.makeEnum("livekit.LeaveRequest.Action", [{
  no: 0,
  name: "DISCONNECT"
}, {
  no: 1,
  name: "RESUME"
}, {
  no: 2,
  name: "RECONNECT"
}]);
var UpdateVideoLayers = proto3.makeMessageType("livekit.UpdateVideoLayers", () => [{
  no: 1,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "layers",
  kind: "message",
  T: VideoLayer,
  repeated: true
}]);
var UpdateParticipantMetadata = proto3.makeMessageType("livekit.UpdateParticipantMetadata", () => [{
  no: 1,
  name: "metadata",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "name",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "attributes",
  kind: "map",
  K: 9,
  V: {
    kind: "scalar",
    T: 9
    /* ScalarType.STRING */
  }
}, {
  no: 4,
  name: "request_id",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}]);
var ICEServer = proto3.makeMessageType("livekit.ICEServer", () => [{
  no: 1,
  name: "urls",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 2,
  name: "username",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "credential",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var SpeakersChanged = proto3.makeMessageType("livekit.SpeakersChanged", () => [{
  no: 1,
  name: "speakers",
  kind: "message",
  T: SpeakerInfo,
  repeated: true
}]);
var RoomUpdate = proto3.makeMessageType("livekit.RoomUpdate", () => [{
  no: 1,
  name: "room",
  kind: "message",
  T: Room$1
}]);
var ConnectionQualityInfo = proto3.makeMessageType("livekit.ConnectionQualityInfo", () => [{
  no: 1,
  name: "participant_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "quality",
  kind: "enum",
  T: proto3.getEnumType(ConnectionQuality$1)
}, {
  no: 3,
  name: "score",
  kind: "scalar",
  T: 2
  /* ScalarType.FLOAT */
}]);
var ConnectionQualityUpdate = proto3.makeMessageType("livekit.ConnectionQualityUpdate", () => [{
  no: 1,
  name: "updates",
  kind: "message",
  T: ConnectionQualityInfo,
  repeated: true
}]);
var StreamStateInfo = proto3.makeMessageType("livekit.StreamStateInfo", () => [{
  no: 1,
  name: "participant_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "state",
  kind: "enum",
  T: proto3.getEnumType(StreamState)
}]);
var StreamStateUpdate = proto3.makeMessageType("livekit.StreamStateUpdate", () => [{
  no: 1,
  name: "stream_states",
  kind: "message",
  T: StreamStateInfo,
  repeated: true
}]);
var SubscribedQuality = proto3.makeMessageType("livekit.SubscribedQuality", () => [{
  no: 1,
  name: "quality",
  kind: "enum",
  T: proto3.getEnumType(VideoQuality$1)
}, {
  no: 2,
  name: "enabled",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var SubscribedCodec = proto3.makeMessageType("livekit.SubscribedCodec", () => [{
  no: 1,
  name: "codec",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "qualities",
  kind: "message",
  T: SubscribedQuality,
  repeated: true
}]);
var SubscribedQualityUpdate = proto3.makeMessageType("livekit.SubscribedQualityUpdate", () => [{
  no: 1,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "subscribed_qualities",
  kind: "message",
  T: SubscribedQuality,
  repeated: true
}, {
  no: 3,
  name: "subscribed_codecs",
  kind: "message",
  T: SubscribedCodec,
  repeated: true
}]);
var TrackPermission = proto3.makeMessageType("livekit.TrackPermission", () => [{
  no: 1,
  name: "participant_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "all_tracks",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 3,
  name: "track_sids",
  kind: "scalar",
  T: 9,
  repeated: true
}, {
  no: 4,
  name: "participant_identity",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var SubscriptionPermission = proto3.makeMessageType("livekit.SubscriptionPermission", () => [{
  no: 1,
  name: "all_participants",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}, {
  no: 2,
  name: "track_permissions",
  kind: "message",
  T: TrackPermission,
  repeated: true
}]);
var SubscriptionPermissionUpdate = proto3.makeMessageType("livekit.SubscriptionPermissionUpdate", () => [{
  no: 1,
  name: "participant_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "allowed",
  kind: "scalar",
  T: 8
  /* ScalarType.BOOL */
}]);
var SyncState = proto3.makeMessageType("livekit.SyncState", () => [{
  no: 1,
  name: "answer",
  kind: "message",
  T: SessionDescription
}, {
  no: 2,
  name: "subscription",
  kind: "message",
  T: UpdateSubscription
}, {
  no: 3,
  name: "publish_tracks",
  kind: "message",
  T: TrackPublishedResponse,
  repeated: true
}, {
  no: 4,
  name: "data_channels",
  kind: "message",
  T: DataChannelInfo,
  repeated: true
}, {
  no: 5,
  name: "offer",
  kind: "message",
  T: SessionDescription
}, {
  no: 6,
  name: "track_sids_disabled",
  kind: "scalar",
  T: 9,
  repeated: true
}]);
var DataChannelInfo = proto3.makeMessageType("livekit.DataChannelInfo", () => [{
  no: 1,
  name: "label",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "id",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 3,
  name: "target",
  kind: "enum",
  T: proto3.getEnumType(SignalTarget)
}]);
var SimulateScenario = proto3.makeMessageType("livekit.SimulateScenario", () => [{
  no: 1,
  name: "speaker_update",
  kind: "scalar",
  T: 5,
  oneof: "scenario"
}, {
  no: 2,
  name: "node_failure",
  kind: "scalar",
  T: 8,
  oneof: "scenario"
}, {
  no: 3,
  name: "migration",
  kind: "scalar",
  T: 8,
  oneof: "scenario"
}, {
  no: 4,
  name: "server_leave",
  kind: "scalar",
  T: 8,
  oneof: "scenario"
}, {
  no: 5,
  name: "switch_candidate_protocol",
  kind: "enum",
  T: proto3.getEnumType(CandidateProtocol),
  oneof: "scenario"
}, {
  no: 6,
  name: "subscriber_bandwidth",
  kind: "scalar",
  T: 3,
  oneof: "scenario"
}, {
  no: 7,
  name: "disconnect_signal_on_resume",
  kind: "scalar",
  T: 8,
  oneof: "scenario"
}, {
  no: 8,
  name: "disconnect_signal_on_resume_no_messages",
  kind: "scalar",
  T: 8,
  oneof: "scenario"
}, {
  no: 9,
  name: "leave_request_full_reconnect",
  kind: "scalar",
  T: 8,
  oneof: "scenario"
}]);
var Ping = proto3.makeMessageType("livekit.Ping", () => [{
  no: 1,
  name: "timestamp",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 2,
  name: "rtt",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}]);
var Pong = proto3.makeMessageType("livekit.Pong", () => [{
  no: 1,
  name: "last_ping_timestamp",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}, {
  no: 2,
  name: "timestamp",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}]);
var RegionSettings = proto3.makeMessageType("livekit.RegionSettings", () => [{
  no: 1,
  name: "regions",
  kind: "message",
  T: RegionInfo,
  repeated: true
}]);
var RegionInfo = proto3.makeMessageType("livekit.RegionInfo", () => [{
  no: 1,
  name: "region",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "url",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 3,
  name: "distance",
  kind: "scalar",
  T: 3
  /* ScalarType.INT64 */
}]);
var SubscriptionResponse = proto3.makeMessageType("livekit.SubscriptionResponse", () => [{
  no: 1,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}, {
  no: 2,
  name: "err",
  kind: "enum",
  T: proto3.getEnumType(SubscriptionError)
}]);
var RequestResponse = proto3.makeMessageType("livekit.RequestResponse", () => [{
  no: 1,
  name: "request_id",
  kind: "scalar",
  T: 13
  /* ScalarType.UINT32 */
}, {
  no: 2,
  name: "reason",
  kind: "enum",
  T: proto3.getEnumType(RequestResponse_Reason)
}, {
  no: 3,
  name: "message",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
var RequestResponse_Reason = proto3.makeEnum("livekit.RequestResponse.Reason", [{
  no: 0,
  name: "OK"
}, {
  no: 1,
  name: "NOT_FOUND"
}, {
  no: 2,
  name: "NOT_ALLOWED"
}, {
  no: 3,
  name: "LIMIT_EXCEEDED"
}]);
var TrackSubscribed = proto3.makeMessageType("livekit.TrackSubscribed", () => [{
  no: 1,
  name: "track_sid",
  kind: "scalar",
  T: 9
  /* ScalarType.STRING */
}]);
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var loglevel$1 = { exports: {} };
var loglevel = loglevel$1.exports;
var hasRequiredLoglevel;
function requireLoglevel() {
  if (hasRequiredLoglevel)
    return loglevel$1.exports;
  hasRequiredLoglevel = 1;
  (function(module) {
    (function(root, definition) {
      if (module.exports) {
        module.exports = definition();
      } else {
        root.log = definition();
      }
    })(loglevel, function() {
      var noop = function() {
      };
      var undefinedType = "undefined";
      var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
      var logMethods = ["trace", "debug", "info", "warn", "error"];
      var _loggersByName = {};
      var defaultLogger = null;
      function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === "function") {
          return method.bind(obj);
        } else {
          try {
            return Function.prototype.bind.call(method, obj);
          } catch (e2) {
            return function() {
              return Function.prototype.apply.apply(method, [obj, arguments]);
            };
          }
        }
      }
      function traceForIE() {
        if (console.log) {
          if (console.log.apply) {
            console.log.apply(console, arguments);
          } else {
            Function.prototype.apply.apply(console.log, [console, arguments]);
          }
        }
        if (console.trace)
          console.trace();
      }
      function realMethod(methodName) {
        if (methodName === "debug") {
          methodName = "log";
        }
        if (typeof console === undefinedType) {
          return false;
        } else if (methodName === "trace" && isIE) {
          return traceForIE;
        } else if (console[methodName] !== void 0) {
          return bindMethod(console, methodName);
        } else if (console.log !== void 0) {
          return bindMethod(console, "log");
        } else {
          return noop;
        }
      }
      function replaceLoggingMethods() {
        var level = this.getLevel();
        for (var i = 0; i < logMethods.length; i++) {
          var methodName = logMethods[i];
          this[methodName] = i < level ? noop : this.methodFactory(methodName, level, this.name);
        }
        this.log = this.debug;
        if (typeof console === undefinedType && level < this.levels.SILENT) {
          return "No console available for logging";
        }
      }
      function enableLoggingWhenConsoleArrives(methodName) {
        return function() {
          if (typeof console !== undefinedType) {
            replaceLoggingMethods.call(this);
            this[methodName].apply(this, arguments);
          }
        };
      }
      function defaultMethodFactory(methodName, _level, _loggerName) {
        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
      }
      function Logger(name, factory) {
        var self = this;
        var inheritedLevel;
        var defaultLevel;
        var userLevel;
        var storageKey = "loglevel";
        if (typeof name === "string") {
          storageKey += ":" + name;
        } else if (typeof name === "symbol") {
          storageKey = void 0;
        }
        function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || "silent").toUpperCase();
          if (typeof window === undefinedType || !storageKey)
            return;
          try {
            window.localStorage[storageKey] = levelName;
            return;
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {
          }
        }
        function getPersistedLevel() {
          var storedLevel;
          if (typeof window === undefinedType || !storageKey)
            return;
          try {
            storedLevel = window.localStorage[storageKey];
          } catch (ignore) {
          }
          if (typeof storedLevel === undefinedType) {
            try {
              var cookie = window.document.cookie;
              var cookieName = encodeURIComponent(storageKey);
              var location = cookie.indexOf(cookieName + "=");
              if (location !== -1) {
                storedLevel = /^([^;]+)/.exec(cookie.slice(location + cookieName.length + 1))[1];
              }
            } catch (ignore) {
            }
          }
          if (self.levels[storedLevel] === void 0) {
            storedLevel = void 0;
          }
          return storedLevel;
        }
        function clearPersistedLevel() {
          if (typeof window === undefinedType || !storageKey)
            return;
          try {
            window.localStorage.removeItem(storageKey);
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch (ignore) {
          }
        }
        function normalizeLevel(input) {
          var level = input;
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== void 0) {
            level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
            return level;
          } else {
            throw new TypeError("log.setLevel() called with invalid level: " + input);
          }
        }
        self.name = name;
        self.levels = {
          "TRACE": 0,
          "DEBUG": 1,
          "INFO": 2,
          "WARN": 3,
          "ERROR": 4,
          "SILENT": 5
        };
        self.methodFactory = factory || defaultMethodFactory;
        self.getLevel = function() {
          if (userLevel != null) {
            return userLevel;
          } else if (defaultLevel != null) {
            return defaultLevel;
          } else {
            return inheritedLevel;
          }
        };
        self.setLevel = function(level, persist) {
          userLevel = normalizeLevel(level);
          if (persist !== false) {
            persistLevelIfPossible(userLevel);
          }
          return replaceLoggingMethods.call(self);
        };
        self.setDefaultLevel = function(level) {
          defaultLevel = normalizeLevel(level);
          if (!getPersistedLevel()) {
            self.setLevel(level, false);
          }
        };
        self.resetLevel = function() {
          userLevel = null;
          clearPersistedLevel();
          replaceLoggingMethods.call(self);
        };
        self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
        };
        self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
        };
        self.rebuild = function() {
          if (defaultLogger !== self) {
            inheritedLevel = normalizeLevel(defaultLogger.getLevel());
          }
          replaceLoggingMethods.call(self);
          if (defaultLogger === self) {
            for (var childName in _loggersByName) {
              _loggersByName[childName].rebuild();
            }
          }
        };
        inheritedLevel = normalizeLevel(defaultLogger ? defaultLogger.getLevel() : "WARN");
        var initialLevel = getPersistedLevel();
        if (initialLevel != null) {
          userLevel = normalizeLevel(initialLevel);
        }
        replaceLoggingMethods.call(self);
      }
      defaultLogger = new Logger();
      defaultLogger.getLogger = function getLogger2(name) {
        if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }
        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(name, defaultLogger.methodFactory);
        }
        return logger;
      };
      var _log = typeof window !== undefinedType ? window.log : void 0;
      defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType && window.log === defaultLogger) {
          window.log = _log;
        }
        return defaultLogger;
      };
      defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
      };
      defaultLogger["default"] = defaultLogger;
      return defaultLogger;
    });
  })(loglevel$1);
  return loglevel$1.exports;
}
var loglevelExports = requireLoglevel();
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["trace"] = 0] = "trace";
  LogLevel2[LogLevel2["debug"] = 1] = "debug";
  LogLevel2[LogLevel2["info"] = 2] = "info";
  LogLevel2[LogLevel2["warn"] = 3] = "warn";
  LogLevel2[LogLevel2["error"] = 4] = "error";
  LogLevel2[LogLevel2["silent"] = 5] = "silent";
})(LogLevel || (LogLevel = {}));
var LoggerNames;
(function(LoggerNames2) {
  LoggerNames2["Default"] = "livekit";
  LoggerNames2["Room"] = "livekit-room";
  LoggerNames2["Participant"] = "livekit-participant";
  LoggerNames2["Track"] = "livekit-track";
  LoggerNames2["Publication"] = "livekit-track-publication";
  LoggerNames2["Engine"] = "livekit-engine";
  LoggerNames2["Signal"] = "livekit-signal";
  LoggerNames2["PCManager"] = "livekit-pc-manager";
  LoggerNames2["PCTransport"] = "livekit-pc-transport";
  LoggerNames2["E2EE"] = "lk-e2ee";
})(LoggerNames || (LoggerNames = {}));
var livekitLogger = loglevelExports.getLogger("livekit");
var livekitLoggers = Object.values(LoggerNames).map((name) => loglevelExports.getLogger(name));
livekitLogger.setDefaultLevel(LogLevel.info);
function getLogger(name) {
  const logger = loglevelExports.getLogger(name);
  logger.setDefaultLevel(livekitLogger.getLevel());
  return logger;
}
function setLogLevel(level, loggerName) {
  if (loggerName) {
    loglevelExports.getLogger(loggerName).setLevel(level);
  } else {
    for (const logger of livekitLoggers) {
      logger.setLevel(level);
    }
  }
}
function setLogExtension(extension, logger) {
  const loggers = logger ? [logger] : livekitLoggers;
  loggers.forEach((logR) => {
    const originalFactory = logR.methodFactory;
    logR.methodFactory = (methodName, configLevel, loggerName) => {
      const rawMethod = originalFactory(methodName, configLevel, loggerName);
      const logLevel = LogLevel[methodName];
      const needLog = logLevel >= configLevel && logLevel < LogLevel.silent;
      return (msg, context) => {
        if (context)
          rawMethod(msg, context);
        else
          rawMethod(msg);
        if (needLog) {
          extension(logLevel, msg, context);
        }
      };
    };
    logR.setLevel(logR.getLevel());
  });
}
var workerLogger = loglevelExports.getLogger("lk-e2ee");
var maxRetryDelay = 7e3;
var DEFAULT_RETRY_DELAYS_IN_MS = [0, 300, 2 * 2 * 300, 3 * 3 * 300, 4 * 4 * 300, maxRetryDelay, maxRetryDelay, maxRetryDelay, maxRetryDelay, maxRetryDelay];
var DefaultReconnectPolicy = class {
  constructor(retryDelays) {
    this._retryDelays = retryDelays !== void 0 ? [...retryDelays] : DEFAULT_RETRY_DELAYS_IN_MS;
  }
  nextRetryDelayInMs(context) {
    if (context.retryCount >= this._retryDelays.length)
      return null;
    const retryDelay = this._retryDelays[context.retryCount];
    if (context.retryCount <= 1)
      return retryDelay;
    return retryDelay + Math.random() * 1e3;
  }
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e2) {
        reject(e2);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __values(o2) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o2[s], i = 0;
  if (m)
    return m.call(o2);
  if (o2 && typeof o2.length === "number")
    return {
      next: function() {
        if (o2 && i >= o2.length)
          o2 = void 0;
        return { value: o2 && o2[i++], done: !o2 };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __asyncValues(o2) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o2[Symbol.asyncIterator], i;
  return m ? m.call(o2) : (o2 = typeof __values === "function" ? __values(o2) : o2[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o2[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o2[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
var events = { exports: {} };
var hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents)
    return events.exports;
  hasRequiredEvents = 1;
  var R = typeof Reflect === "object" ? Reflect : null;
  var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };
  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target);
    };
  }
  function ProcessEmitWarning(warning) {
    if (console && console.warn)
      console.warn(warning);
  }
  var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
    return value !== value;
  };
  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  events.exports = EventEmitter;
  events.exports.once = once;
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.prototype._events = void 0;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = void 0;
  var defaultMaxListeners = 10;
  function checkListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
  }
  Object.defineProperty(EventEmitter, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
      }
      defaultMaxListeners = arg;
    }
  });
  EventEmitter.init = function() {
    if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || void 0;
  };
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
    }
    this._maxListeners = n;
    return this;
  };
  function _getMaxListeners(that) {
    if (that._maxListeners === void 0)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }
  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
  };
  EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++)
      args.push(arguments[i]);
    var doError = type === "error";
    var events2 = this._events;
    if (events2 !== void 0)
      doError = doError && events2.error === void 0;
    else if (!doError)
      return false;
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        throw er;
      }
      var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
      err.context = er;
      throw err;
    }
    var handler = events2[type];
    if (handler === void 0)
      return false;
    if (typeof handler === "function") {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }
    return true;
  };
  function _addListener(target, type, listener, prepend) {
    var m;
    var events2;
    var existing;
    checkListener(listener);
    events2 = target._events;
    if (events2 === void 0) {
      events2 = target._events = /* @__PURE__ */ Object.create(null);
      target._eventsCount = 0;
    } else {
      if (events2.newListener !== void 0) {
        target.emit("newListener", type, listener.listener ? listener.listener : listener);
        events2 = target._events;
      }
      existing = events2[type];
    }
    if (existing === void 0) {
      existing = events2[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === "function") {
        existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }
    return target;
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };
  function onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0)
        return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
  function _onceWrap(target, type, listener) {
    var state = {
      fired: false,
      wrapFn: void 0,
      target,
      type,
      listener
    };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }
  EventEmitter.prototype.once = function once2(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    checkListener(listener);
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events2, position, i, originalListener;
    checkListener(listener);
    events2 = this._events;
    if (events2 === void 0)
      return this;
    list = events2[type];
    if (list === void 0)
      return this;
    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else {
        delete events2[type];
        if (events2.removeListener)
          this.emit("removeListener", type, list.listener || listener);
      }
    } else if (typeof list !== "function") {
      position = -1;
      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }
      if (position < 0)
        return this;
      if (position === 0)
        list.shift();
      else {
        spliceOne(list, position);
      }
      if (list.length === 1)
        events2[type] = list[0];
      if (events2.removeListener !== void 0)
        this.emit("removeListener", type, originalListener || listener);
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events2, i;
    events2 = this._events;
    if (events2 === void 0)
      return this;
    if (events2.removeListener === void 0) {
      if (arguments.length === 0) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      } else if (events2[type] !== void 0) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else
          delete events2[type];
      }
      return this;
    }
    if (arguments.length === 0) {
      var keys = Object.keys(events2);
      var key;
      for (i = 0; i < keys.length; ++i) {
        key = keys[i];
        if (key === "removeListener")
          continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners("removeListener");
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
      return this;
    }
    listeners = events2[type];
    if (typeof listeners === "function") {
      this.removeListener(type, listeners);
    } else if (listeners !== void 0) {
      for (i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(type, listeners[i]);
      }
    }
    return this;
  };
  function _listeners(target, type, unwrap) {
    var events2 = target._events;
    if (events2 === void 0)
      return [];
    var evlistener = events2[type];
    if (evlistener === void 0)
      return [];
    if (typeof evlistener === "function")
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }
  EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };
  EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };
  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };
  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events2 = this._events;
    if (events2 !== void 0) {
      var evlistener = events2[type];
      if (typeof evlistener === "function") {
        return 1;
      } else if (evlistener !== void 0) {
        return evlistener.length;
      }
    }
    return 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };
  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }
  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
      list[index] = list[index + 1];
    list.pop();
  }
  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }
  function once(emitter, name) {
    return new Promise(function(resolve, reject) {
      function errorListener(err) {
        emitter.removeListener(name, resolver);
        reject(err);
      }
      function resolver() {
        if (typeof emitter.removeListener === "function") {
          emitter.removeListener("error", errorListener);
        }
        resolve([].slice.call(arguments));
      }
      eventTargetAgnosticAddListener(emitter, name, resolver, {
        once: true
      });
      if (name !== "error") {
        addErrorHandlerIfEventEmitter(emitter, errorListener, {
          once: true
        });
      }
    });
  }
  function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === "function") {
      eventTargetAgnosticAddListener(emitter, "error", handler, flags);
    }
  }
  function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
      if (flags.once) {
        emitter.once(name, listener);
      } else {
        emitter.on(name, listener);
      }
    } else if (typeof emitter.addEventListener === "function") {
      emitter.addEventListener(name, function wrapListener(arg) {
        if (flags.once) {
          emitter.removeEventListener(name, wrapListener);
        }
        listener(arg);
      });
    } else {
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    }
  }
  return events.exports;
}
var eventsExports = requireEvents();
var logDisabled_ = true;
var deprecationWarnings_ = true;
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}
function wrapPeerConnectionEvent(window2, eventNameToWrap, wrapper) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  const proto = window2.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e2) => {
      const modifiedEvent = wrapper(e2);
      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };
    this._eventMap = this._eventMap || {};
    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = /* @__PURE__ */ new Map();
    }
    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
    return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
  };
  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
    this._eventMap[eventNameToWrap].delete(cb);
    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }
    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }
    return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
  };
  Object.defineProperty(proto, "on" + eventNameToWrap, {
    get() {
      return this["_on" + eventNameToWrap];
    },
    set(cb) {
      if (this["_on" + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap, this["_on" + eventNameToWrap]);
        delete this["_on" + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap, this["_on" + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}
function disableLog(bool) {
  if (typeof bool !== "boolean") {
    return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
  }
  logDisabled_ = bool;
  return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
}
function disableWarnings(bool) {
  if (typeof bool !== "boolean") {
    return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
  }
  deprecationWarnings_ = !bool;
  return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
}
function log() {
  if (typeof window === "object") {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== "undefined" && typeof console.log === "function") {
      console.log.apply(console, arguments);
    }
  }
}
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
}
function detectBrowser(window2) {
  const result = {
    browser: null,
    version: null
  };
  if (typeof window2 === "undefined" || !window2.navigator || !window2.navigator.userAgent) {
    result.browser = "Not a browser.";
    return result;
  }
  const {
    navigator: navigator2
  } = window2;
  if (navigator2.userAgentData && navigator2.userAgentData.brands) {
    const chromium = navigator2.userAgentData.brands.find((brand) => {
      return brand.brand === "Chromium";
    });
    if (chromium) {
      return {
        browser: "chrome",
        version: parseInt(chromium.version, 10)
      };
    }
  }
  if (navigator2.mozGetUserMedia) {
    result.browser = "firefox";
    result.version = extractVersion(navigator2.userAgent, /Firefox\/(\d+)\./, 1);
  } else if (navigator2.webkitGetUserMedia || window2.isSecureContext === false && window2.webkitRTCPeerConnection) {
    result.browser = "chrome";
    result.version = extractVersion(navigator2.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (window2.RTCPeerConnection && navigator2.userAgent.match(/AppleWebKit\/(\d+)\./)) {
    result.browser = "safari";
    result.version = extractVersion(navigator2.userAgent, /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window2.RTCRtpTransceiver && "currentDirection" in window2.RTCRtpTransceiver.prototype;
  } else {
    result.browser = "Not a supported browser.";
    return result;
  }
  return result;
}
function isObject(val) {
  return Object.prototype.toString.call(val) === "[object Object]";
}
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }
  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === void 0 || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, {
      [key]: value
    });
  }, {});
}
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach((name) => {
    if (name.endsWith("Id")) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith("Ids")) {
      base[name].forEach((id) => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
  const filteredResult = /* @__PURE__ */ new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach((value) => {
    if (value.type === "track" && value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach((trackStat) => {
    result.forEach((stats) => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}
var logging = log;
function shimGetUserMedia$2(window2, browserDetails2) {
  const navigator2 = window2 && window2.navigator;
  if (!navigator2.mediaDevices) {
    return;
  }
  const constraintsToChrome_ = function(c) {
    if (typeof c !== "object" || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach((key) => {
      if (key === "require" || key === "advanced" || key === "mediaSource") {
        return;
      }
      const r2 = typeof c[key] === "object" ? c[key] : {
        ideal: c[key]
      };
      if (r2.exact !== void 0 && typeof r2.exact === "number") {
        r2.min = r2.max = r2.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name === "deviceId" ? "sourceId" : name;
      };
      if (r2.ideal !== void 0) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r2.ideal === "number") {
          oc[oldname_("min", key)] = r2.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_("max", key)] = r2.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_("", key)] = r2.ideal;
          cc.optional.push(oc);
        }
      }
      if (r2.exact !== void 0 && typeof r2.exact !== "number") {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_("", key)] = r2.exact;
      } else {
        ["min", "max"].forEach((mix) => {
          if (r2[mix] !== void 0) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r2[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };
  const shimConstraints_ = function(constraints, func) {
    if (browserDetails2.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === "object") {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, "autoGainControl", "googAutoGainControl");
      remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === "object") {
      let face = constraints.video.facingMode;
      face = face && (typeof face === "object" ? face : {
        ideal: face
      });
      const getSupportedFacingModeLies = browserDetails2.version < 66;
      if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator2.mediaDevices.getSupportedConstraints && navigator2.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === "environment" || face.ideal === "environment") {
          matches = ["back", "rear"];
        } else if (face.exact === "user" || face.ideal === "user") {
          matches = ["front"];
        }
        if (matches) {
          return navigator2.mediaDevices.enumerateDevices().then((devices) => {
            devices = devices.filter((d) => d.kind === "videoinput");
            let dev = devices.find((d) => matches.some((match) => d.label.toLowerCase().includes(match)));
            if (!dev && devices.length && matches.includes("back")) {
              dev = devices[devices.length - 1];
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {
                exact: dev.deviceId
              } : {
                ideal: dev.deviceId
              };
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging("chrome: " + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging("chrome: " + JSON.stringify(constraints));
    return func(constraints);
  };
  const shimError_ = function(e2) {
    if (browserDetails2.version >= 64) {
      return e2;
    }
    return {
      name: {
        PermissionDeniedError: "NotAllowedError",
        PermissionDismissedError: "NotAllowedError",
        InvalidStateError: "NotAllowedError",
        DevicesNotFoundError: "NotFoundError",
        ConstraintNotSatisfiedError: "OverconstrainedError",
        TrackStartError: "NotReadableError",
        MediaDeviceFailedDueToShutdown: "NotAllowedError",
        MediaDeviceKillSwitchOn: "NotAllowedError",
        TabCaptureError: "AbortError",
        ScreenCaptureError: "AbortError",
        DeviceCaptureError: "AbortError"
      }[e2.name] || e2.name,
      message: e2.message,
      constraint: e2.constraint || e2.constraintName,
      toString() {
        return this.name + (this.message && ": ") + this.message;
      }
    };
  };
  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, (c) => {
      navigator2.webkitGetUserMedia(c, onSuccess, (e2) => {
        if (onError) {
          onError(shimError_(e2));
        }
      });
    });
  };
  navigator2.getUserMedia = getUserMedia_.bind(navigator2);
  if (navigator2.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
    navigator2.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, (c) => origGetUserMedia(c).then((stream) => {
        if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          throw new DOMException("", "NotFoundError");
        }
        return stream;
      }, (e2) => Promise.reject(shimError_(e2))));
    };
  }
}
function shimMediaStream(window2) {
  window2.MediaStream = window2.MediaStream || window2.webkitMediaStream;
}
function shimOnTrack$1(window2) {
  if (typeof window2 === "object" && window2.RTCPeerConnection && !("ontrack" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "ontrack", {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener("track", this._ontrack);
        }
        this.addEventListener("track", this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      if (!this._ontrackpoly) {
        this._ontrackpoly = (e2) => {
          e2.stream.addEventListener("addtrack", (te) => {
            let receiver;
            if (window2.RTCPeerConnection.prototype.getReceivers) {
              receiver = this.getReceivers().find((r2) => r2.track && r2.track.id === te.track.id);
            } else {
              receiver = {
                track: te.track
              };
            }
            const event = new Event("track");
            event.track = te.track;
            event.receiver = receiver;
            event.transceiver = {
              receiver
            };
            event.streams = [e2.stream];
            this.dispatchEvent(event);
          });
          e2.stream.getTracks().forEach((track) => {
            let receiver;
            if (window2.RTCPeerConnection.prototype.getReceivers) {
              receiver = this.getReceivers().find((r2) => r2.track && r2.track.id === track.id);
            } else {
              receiver = {
                track
              };
            }
            const event = new Event("track");
            event.track = track;
            event.receiver = receiver;
            event.transceiver = {
              receiver
            };
            event.streams = [e2.stream];
            this.dispatchEvent(event);
          });
        };
        this.addEventListener("addstream", this._ontrackpoly);
      }
      return origSetRemoteDescription.apply(this, arguments);
    };
  } else {
    wrapPeerConnectionEvent(window2, "track", (e2) => {
      if (!e2.transceiver) {
        Object.defineProperty(e2, "transceiver", {
          value: {
            receiver: e2.receiver
          }
        });
      }
      return e2;
    });
  }
}
function shimGetSendersWithDtmf(window2) {
  if (typeof window2 === "object" && window2.RTCPeerConnection && !("getSenders" in window2.RTCPeerConnection.prototype) && "createDTMFSender" in window2.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === void 0) {
            if (track.kind === "audio") {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };
    if (!window2.RTCPeerConnection.prototype.getSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice();
      };
      const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
      window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        let sender = origAddTrack.apply(this, arguments);
        if (!sender) {
          sender = shimSenderWithDtmf(this, track);
          this._senders.push(sender);
        }
        return sender;
      };
      const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
      window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        origRemoveTrack.apply(this, arguments);
        const idx = this._senders.indexOf(sender);
        if (idx !== -1) {
          this._senders.splice(idx, 1);
        }
      };
    }
    const origAddStream = window2.RTCPeerConnection.prototype.addStream;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach((track) => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };
    const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._senders = this._senders || [];
      origRemoveStream.apply(this, [stream]);
      stream.getTracks().forEach((track) => {
        const sender = this._senders.find((s) => s.track === track);
        if (sender) {
          this._senders.splice(this._senders.indexOf(sender), 1);
        }
      });
    };
  } else if (typeof window2 === "object" && window2.RTCPeerConnection && "getSenders" in window2.RTCPeerConnection.prototype && "createDTMFSender" in window2.RTCPeerConnection.prototype && window2.RTCRtpSender && !("dtmf" in window2.RTCRtpSender.prototype)) {
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach((sender) => sender._pc = this);
      return senders;
    };
    Object.defineProperty(window2.RTCRtpSender.prototype, "dtmf", {
      get() {
        if (this._dtmf === void 0) {
          if (this.track.kind === "audio") {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}
function shimSenderReceiverGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender && window2.RTCRtpReceiver)) {
    return;
  }
  if (!("getStats" in window2.RTCRtpSender.prototype)) {
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender) => sender._pc = this);
        return senders;
      };
    }
    const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window2.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then((result) => (
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        filterStats(result, sender.track, true)
      ));
    };
  }
  if (!("getStats" in window2.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        const receivers = origGetReceivers.apply(this, []);
        receivers.forEach((receiver) => receiver._pc = this);
        return receivers;
      };
    }
    wrapPeerConnectionEvent(window2, "track", (e2) => {
      e2.receiver._pc = e2.srcElement;
      return e2;
    });
    window2.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then((result) => filterStats(result, receiver.track, false));
    };
  }
  if (!("getStats" in window2.RTCRtpSender.prototype && "getStats" in window2.RTCRtpReceiver.prototype)) {
    return;
  }
  const origGetStats = window2.RTCPeerConnection.prototype.getStats;
  window2.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 && arguments[0] instanceof window2.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach((s) => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach((r2) => {
        if (r2.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r2;
          }
        }
        return r2.track === track;
      });
      if (err || sender && receiver) {
        return Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError"));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
    }
    return origGetStats.apply(this, arguments);
  };
}
function shimAddTrackRemoveTrackWithNative(window2) {
  window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    return Object.keys(this._shimmedLocalStreams).map((streamId) => this._shimmedLocalStreams[streamId][0]);
  };
  const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
  window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (!stream) {
      return origAddTrack.apply(this, arguments);
    }
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    const sender = origAddTrack.apply(this, arguments);
    if (!this._shimmedLocalStreams[stream.id]) {
      this._shimmedLocalStreams[stream.id] = [stream, sender];
    } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
      this._shimmedLocalStreams[stream.id].push(sender);
    }
    return sender;
  };
  const origAddStream = window2.RTCPeerConnection.prototype.addStream;
  window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    stream.getTracks().forEach((track) => {
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException("Track already exists.", "InvalidAccessError");
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders().filter((newSender) => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };
  const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    delete this._shimmedLocalStreams[stream.id];
    return origRemoveStream.apply(this, arguments);
  };
  const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
  window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    if (sender) {
      Object.keys(this._shimmedLocalStreams).forEach((streamId) => {
        const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
        if (idx !== -1) {
          this._shimmedLocalStreams[streamId].splice(idx, 1);
        }
        if (this._shimmedLocalStreams[streamId].length === 1) {
          delete this._shimmedLocalStreams[streamId];
        }
      });
    }
    return origRemoveTrack.apply(this, arguments);
  };
}
function shimAddTrackRemoveTrack(window2, browserDetails2) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (window2.RTCPeerConnection.prototype.addTrack && browserDetails2.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window2);
  }
  const origGetLocalStreams = window2.RTCPeerConnection.prototype.getLocalStreams;
  window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    const nativeStreams = origGetLocalStreams.apply(this);
    this._reverseStreams = this._reverseStreams || {};
    return nativeStreams.map((stream) => this._reverseStreams[stream.id]);
  };
  const origAddStream = window2.RTCPeerConnection.prototype.addStream;
  window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    stream.getTracks().forEach((track) => {
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException("Track already exists.", "InvalidAccessError");
      }
    });
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window2.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };
  const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
    delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
    delete this._streams[stream.id];
  };
  window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (this.signalingState === "closed") {
      throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
    }
    const streams = [].slice.call(arguments, 1);
    if (streams.length !== 1 || !streams[0].getTracks().find((t) => t === track)) {
      throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
    }
    const alreadyExists = this.getSenders().find((s) => s.track === track);
    if (alreadyExists) {
      throw new DOMException("Track already exists.", "InvalidAccessError");
    }
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    const oldStream = this._streams[stream.id];
    if (oldStream) {
      oldStream.addTrack(track);
      Promise.resolve().then(() => {
        this.dispatchEvent(new Event("negotiationneeded"));
      });
    } else {
      const newStream = new window2.MediaStream([track]);
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      this.addStream(newStream);
    }
    return this.getSenders().find((s) => s.track === track);
  };
  function replaceInternalStreamId(pc, description) {
    let sdp2 = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach((internalId) => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp2 = sdp2.replace(new RegExp(internalStream.id, "g"), externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp2
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp2 = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach((internalId) => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp2 = sdp2.replace(new RegExp(externalStream.id, "g"), internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp2
    });
  }
  ["createOffer", "createAnswer"].forEach(function(method) {
    const nativeMethod = window2.RTCPeerConnection.prototype[method];
    const methodObj = {
      [method]() {
        const args = arguments;
        const isLegacyCall = arguments.length && typeof arguments[0] === "function";
        if (isLegacyCall) {
          return nativeMethod.apply(this, [(description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          }, (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          }, arguments[2]]);
        }
        return nativeMethod.apply(this, arguments).then((description) => replaceInternalStreamId(this, description));
      }
    };
    window2.RTCPeerConnection.prototype[method] = methodObj[method];
  });
  const origSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
  window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    if (!arguments.length || !arguments[0].type) {
      return origSetLocalDescription.apply(this, arguments);
    }
    arguments[0] = replaceExternalStreamId(this, arguments[0]);
    return origSetLocalDescription.apply(this, arguments);
  };
  const origLocalDescription = Object.getOwnPropertyDescriptor(window2.RTCPeerConnection.prototype, "localDescription");
  Object.defineProperty(window2.RTCPeerConnection.prototype, "localDescription", {
    get() {
      const description = origLocalDescription.get.apply(this);
      if (description.type === "") {
        return description;
      }
      return replaceInternalStreamId(this, description);
    }
  });
  window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    if (this.signalingState === "closed") {
      throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
    }
    if (!sender._pc) {
      throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
    }
    const isLocal = sender._pc === this;
    if (!isLocal) {
      throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
    }
    this._streams = this._streams || {};
    let stream;
    Object.keys(this._streams).forEach((streamid) => {
      const hasTrack = this._streams[streamid].getTracks().find((track) => sender.track === track);
      if (hasTrack) {
        stream = this._streams[streamid];
      }
    });
    if (stream) {
      if (stream.getTracks().length === 1) {
        this.removeStream(this._reverseStreams[stream.id]);
      } else {
        stream.removeTrack(sender.track);
      }
      this.dispatchEvent(new Event("negotiationneeded"));
    }
  };
}
function shimPeerConnection$1(window2, browserDetails2) {
  if (!window2.RTCPeerConnection && window2.webkitRTCPeerConnection) {
    window2.RTCPeerConnection = window2.webkitRTCPeerConnection;
  }
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (browserDetails2.version < 53) {
    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = {
        [method]() {
          arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        }
      };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  }
}
function fixNegotiationNeeded(window2, browserDetails2) {
  wrapPeerConnectionEvent(window2, "negotiationneeded", (e2) => {
    const pc = e2.target;
    if (browserDetails2.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === "plan-b") {
      if (pc.signalingState !== "stable") {
        return;
      }
    }
    return e2;
  });
}
var chromeShim = Object.freeze({
  __proto__: null,
  fixNegotiationNeeded,
  shimAddTrackRemoveTrack,
  shimAddTrackRemoveTrackWithNative,
  shimGetSendersWithDtmf,
  shimGetUserMedia: shimGetUserMedia$2,
  shimMediaStream,
  shimOnTrack: shimOnTrack$1,
  shimPeerConnection: shimPeerConnection$1,
  shimSenderReceiverGetStats
});
function shimGetUserMedia$1(window2, browserDetails2) {
  const navigator2 = window2 && window2.navigator;
  const MediaStreamTrack2 = window2 && window2.MediaStreamTrack;
  navigator2.getUserMedia = function(constraints, onSuccess, onError) {
    deprecated("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia");
    navigator2.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
  if (!(browserDetails2.version > 55 && "autoGainControl" in navigator2.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };
    const nativeGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
    navigator2.mediaDevices.getUserMedia = function(c) {
      if (typeof c === "object" && typeof c.audio === "object") {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, "autoGainControl", "mozAutoGainControl");
        remap(c.audio, "noiseSuppression", "mozNoiseSuppression");
      }
      return nativeGetUserMedia(c);
    };
    if (MediaStreamTrack2 && MediaStreamTrack2.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack2.prototype.getSettings;
      MediaStreamTrack2.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, "mozAutoGainControl", "autoGainControl");
        remap(obj, "mozNoiseSuppression", "noiseSuppression");
        return obj;
      };
    }
    if (MediaStreamTrack2 && MediaStreamTrack2.prototype.applyConstraints) {
      const nativeApplyConstraints = MediaStreamTrack2.prototype.applyConstraints;
      MediaStreamTrack2.prototype.applyConstraints = function(c) {
        if (this.kind === "audio" && typeof c === "object") {
          c = JSON.parse(JSON.stringify(c));
          remap(c, "autoGainControl", "mozAutoGainControl");
          remap(c, "noiseSuppression", "mozNoiseSuppression");
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}
function shimGetDisplayMedia(window2, preferredMediaSource) {
  if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
    return;
  }
  if (!window2.navigator.mediaDevices) {
    return;
  }
  window2.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
    if (!(constraints && constraints.video)) {
      const err = new DOMException("getDisplayMedia without video constraints is undefined");
      err.name = "NotFoundError";
      err.code = 8;
      return Promise.reject(err);
    }
    if (constraints.video === true) {
      constraints.video = {
        mediaSource: preferredMediaSource
      };
    } else {
      constraints.video.mediaSource = preferredMediaSource;
    }
    return window2.navigator.mediaDevices.getUserMedia(constraints);
  };
}
function shimOnTrack(window2) {
  if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
    Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
}
function shimPeerConnection(window2, browserDetails2) {
  if (typeof window2 !== "object" || !(window2.RTCPeerConnection || window2.mozRTCPeerConnection)) {
    return;
  }
  if (!window2.RTCPeerConnection && window2.mozRTCPeerConnection) {
    window2.RTCPeerConnection = window2.mozRTCPeerConnection;
  }
  if (browserDetails2.version < 53) {
    ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = {
        [method]() {
          arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        }
      };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  }
  const modernStatsTypes = {
    inboundrtp: "inbound-rtp",
    outboundrtp: "outbound-rtp",
    candidatepair: "candidate-pair",
    localcandidate: "local-candidate",
    remotecandidate: "remote-candidate"
  };
  const nativeGetStats = window2.RTCPeerConnection.prototype.getStats;
  window2.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null]).then((stats) => {
      if (browserDetails2.version < 53 && !onSucc) {
        try {
          stats.forEach((stat) => {
            stat.type = modernStatsTypes[stat.type] || stat.type;
          });
        } catch (e2) {
          if (e2.name !== "TypeError") {
            throw e2;
          }
          stats.forEach((stat, i) => {
            stats.set(i, Object.assign({}, stat, {
              type: modernStatsTypes[stat.type] || stat.type
            }));
          });
        }
      }
      return stats;
    }).then(onSucc, onErr);
  };
}
function shimSenderGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
    return;
  }
  if (window2.RTCRtpSender && "getStats" in window2.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach((sender) => sender._pc = this);
      return senders;
    };
  }
  const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window2.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
  };
}
function shimReceiverGetStats(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
    return;
  }
  if (window2.RTCRtpSender && "getStats" in window2.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach((receiver) => receiver._pc = this);
      return receivers;
    };
  }
  wrapPeerConnectionEvent(window2, "track", (e2) => {
    e2.receiver._pc = e2.srcElement;
    return e2;
  });
  window2.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}
function shimRemoveStream(window2) {
  if (!window2.RTCPeerConnection || "removeStream" in window2.RTCPeerConnection.prototype) {
    return;
  }
  window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    deprecated("removeStream", "removeTrack");
    this.getSenders().forEach((sender) => {
      if (sender.track && stream.getTracks().includes(sender.track)) {
        this.removeTrack(sender);
      }
    });
  };
}
function shimRTCDataChannel(window2) {
  if (window2.DataChannel && !window2.RTCDataChannel) {
    window2.RTCDataChannel = window2.DataChannel;
  }
}
function shimAddTransceiver(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window2.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window2.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
      this.setParametersPromises = [];
      let sendEncodings = arguments[1] && arguments[1].sendEncodings;
      if (sendEncodings === void 0) {
        sendEncodings = [];
      }
      sendEncodings = [...sendEncodings];
      const shouldPerformCheck = sendEncodings.length > 0;
      if (shouldPerformCheck) {
        sendEncodings.forEach((encodingParam) => {
          if ("rid" in encodingParam) {
            const ridRegex = /^[a-z0-9]{0,16}$/i;
            if (!ridRegex.test(encodingParam.rid)) {
              throw new TypeError("Invalid RID value provided.");
            }
          }
          if ("scaleResolutionDownBy" in encodingParam) {
            if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1)) {
              throw new RangeError("scale_resolution_down_by must be >= 1.0");
            }
          }
          if ("maxFramerate" in encodingParam) {
            if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
              throw new RangeError("max_framerate must be >= 0.0");
            }
          }
        });
      }
      const transceiver = origAddTransceiver.apply(this, arguments);
      if (shouldPerformCheck) {
        const {
          sender
        } = transceiver;
        const params = sender.getParameters();
        if (!("encodings" in params) || // Avoid being fooled by patched getParameters() below.
        params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
          params.encodings = sendEncodings;
          sender.sendEncodings = sendEncodings;
          this.setParametersPromises.push(sender.setParameters(params).then(() => {
            delete sender.sendEncodings;
          }).catch(() => {
            delete sender.sendEncodings;
          }));
        }
      }
      return transceiver;
    };
  }
}
function shimGetParameters(window2) {
  if (!(typeof window2 === "object" && window2.RTCRtpSender)) {
    return;
  }
  const origGetParameters = window2.RTCRtpSender.prototype.getParameters;
  if (origGetParameters) {
    window2.RTCRtpSender.prototype.getParameters = function getParameters() {
      const params = origGetParameters.apply(this, arguments);
      if (!("encodings" in params)) {
        params.encodings = [].concat(this.sendEncodings || [{}]);
      }
      return params;
    };
  }
}
function shimCreateOffer(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
  window2.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(() => {
        return origCreateOffer.apply(this, arguments);
      }).finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateOffer.apply(this, arguments);
  };
}
function shimCreateAnswer(window2) {
  if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window2.RTCPeerConnection.prototype.createAnswer;
  window2.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(() => {
        return origCreateAnswer.apply(this, arguments);
      }).finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}
var firefoxShim = Object.freeze({
  __proto__: null,
  shimAddTransceiver,
  shimCreateAnswer,
  shimCreateOffer,
  shimGetDisplayMedia,
  shimGetParameters,
  shimGetUserMedia: shimGetUserMedia$1,
  shimOnTrack,
  shimPeerConnection,
  shimRTCDataChannel,
  shimReceiverGetStats,
  shimRemoveStream,
  shimSenderGetStats
});
function shimLocalStreamsAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  if (!("getLocalStreams" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      return this._localStreams;
    };
  }
  if (!("addStream" in window2.RTCPeerConnection.prototype)) {
    const _addTrack = window2.RTCPeerConnection.prototype.addTrack;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      stream.getAudioTracks().forEach((track) => _addTrack.call(this, track, stream));
      stream.getVideoTracks().forEach((track) => _addTrack.call(this, track, stream));
    };
    window2.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
      for (var _len = arguments.length, streams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        streams[_key - 1] = arguments[_key];
      }
      if (streams) {
        streams.forEach((stream) => {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
        });
      }
      return _addTrack.apply(this, arguments);
    };
  }
  if (!("removeStream" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      const index = this._localStreams.indexOf(stream);
      if (index === -1) {
        return;
      }
      this._localStreams.splice(index, 1);
      const tracks = stream.getTracks();
      this.getSenders().forEach((sender) => {
        if (tracks.includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
  }
}
function shimRemoteStreamsAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  if (!("getRemoteStreams" in window2.RTCPeerConnection.prototype)) {
    window2.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
      return this._remoteStreams ? this._remoteStreams : [];
    };
  }
  if (!("onaddstream" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "onaddstream", {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener("addstream", this._onaddstream);
          this.removeEventListener("track", this._onaddstreampoly);
        }
        this.addEventListener("addstream", this._onaddstream = f);
        this.addEventListener("track", this._onaddstreampoly = (e2) => {
          e2.streams.forEach((stream) => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event("addstream");
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      const pc = this;
      if (!this._onaddstreampoly) {
        this.addEventListener("track", this._onaddstreampoly = function(e2) {
          e2.streams.forEach((stream) => {
            if (!pc._remoteStreams) {
              pc._remoteStreams = [];
            }
            if (pc._remoteStreams.indexOf(stream) >= 0) {
              return;
            }
            pc._remoteStreams.push(stream);
            const event = new Event("addstream");
            event.stream = stream;
            pc.dispatchEvent(event);
          });
        });
      }
      return origSetRemoteDescription.apply(pc, arguments);
    };
  }
}
function shimCallbacksAPI(window2) {
  if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
    return;
  }
  const prototype = window2.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;
  prototype.createOffer = function createOffer(successCallback, failureCallback) {
    const options = arguments.length >= 2 ? arguments[2] : arguments[0];
    const promise = origCreateOffer.apply(this, [options]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
    const options = arguments.length >= 2 ? arguments[2] : arguments[0];
    const promise = origCreateAnswer.apply(this, [options]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;
  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;
  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}
function shimGetUserMedia(window2) {
  const navigator2 = window2 && window2.navigator;
  if (navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
    const mediaDevices = navigator2.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator2.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }
  if (!navigator2.getUserMedia && navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
    navigator2.getUserMedia = (function getUserMedia(constraints, cb, errcb) {
      navigator2.mediaDevices.getUserMedia(constraints).then(cb, errcb);
    }).bind(navigator2);
  }
}
function shimConstraints(constraints) {
  if (constraints && constraints.video !== void 0) {
    return Object.assign({}, constraints, {
      video: compactObject(constraints.video)
    });
  }
  return constraints;
}
function shimRTCIceServerUrls(window2) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  const OrigPeerConnection = window2.RTCPeerConnection;
  window2.RTCPeerConnection = function RTCPeerConnection2(pcConfig, pcConstraints) {
    if (pcConfig && pcConfig.iceServers) {
      const newIceServers = [];
      for (let i = 0; i < pcConfig.iceServers.length; i++) {
        let server = pcConfig.iceServers[i];
        if (server.urls === void 0 && server.url) {
          deprecated("RTCIceServer.url", "RTCIceServer.urls");
          server = JSON.parse(JSON.stringify(server));
          server.urls = server.url;
          delete server.url;
          newIceServers.push(server);
        } else {
          newIceServers.push(pcConfig.iceServers[i]);
        }
      }
      pcConfig.iceServers = newIceServers;
    }
    return new OrigPeerConnection(pcConfig, pcConstraints);
  };
  window2.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  if ("generateCertificate" in OrigPeerConnection) {
    Object.defineProperty(window2.RTCPeerConnection, "generateCertificate", {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}
function shimTrackEventTransceiver(window2) {
  if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
    Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
}
function shimCreateOfferLegacy(window2) {
  const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
  window2.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
    if (offerOptions) {
      if (typeof offerOptions.offerToReceiveAudio !== "undefined") {
        offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
      }
      const audioTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "audio");
      if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
        if (audioTransceiver.direction === "sendrecv") {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection("sendonly");
          } else {
            audioTransceiver.direction = "sendonly";
          }
        } else if (audioTransceiver.direction === "recvonly") {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection("inactive");
          } else {
            audioTransceiver.direction = "inactive";
          }
        }
      } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
        this.addTransceiver("audio", {
          direction: "recvonly"
        });
      }
      if (typeof offerOptions.offerToReceiveVideo !== "undefined") {
        offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
      }
      const videoTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "video");
      if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
        if (videoTransceiver.direction === "sendrecv") {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection("sendonly");
          } else {
            videoTransceiver.direction = "sendonly";
          }
        } else if (videoTransceiver.direction === "recvonly") {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection("inactive");
          } else {
            videoTransceiver.direction = "inactive";
          }
        }
      } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
        this.addTransceiver("video", {
          direction: "recvonly"
        });
      }
    }
    return origCreateOffer.apply(this, arguments);
  };
}
function shimAudioContext(window2) {
  if (typeof window2 !== "object" || window2.AudioContext) {
    return;
  }
  window2.AudioContext = window2.webkitAudioContext;
}
var safariShim = Object.freeze({
  __proto__: null,
  shimAudioContext,
  shimCallbacksAPI,
  shimConstraints,
  shimCreateOfferLegacy,
  shimGetUserMedia,
  shimLocalStreamsAPI,
  shimRTCIceServerUrls,
  shimRemoteStreamsAPI,
  shimTrackEventTransceiver
});
var sdp$1 = { exports: {} };
var hasRequiredSdp;
function requireSdp() {
  if (hasRequiredSdp)
    return sdp$1.exports;
  hasRequiredSdp = 1;
  (function(module) {
    const SDPUtils2 = {};
    SDPUtils2.generateIdentifier = function() {
      return Math.random().toString(36).substring(2, 12);
    };
    SDPUtils2.localCName = SDPUtils2.generateIdentifier();
    SDPUtils2.splitLines = function(blob) {
      return blob.trim().split("\n").map((line) => line.trim());
    };
    SDPUtils2.splitSections = function(blob) {
      const parts = blob.split("\nm=");
      return parts.map((part, index) => (index > 0 ? "m=" + part : part).trim() + "\r\n");
    };
    SDPUtils2.getDescription = function(blob) {
      const sections = SDPUtils2.splitSections(blob);
      return sections && sections[0];
    };
    SDPUtils2.getMediaSections = function(blob) {
      const sections = SDPUtils2.splitSections(blob);
      sections.shift();
      return sections;
    };
    SDPUtils2.matchPrefix = function(blob, prefix) {
      return SDPUtils2.splitLines(blob).filter((line) => line.indexOf(prefix) === 0);
    };
    SDPUtils2.parseCandidate = function(line) {
      let parts;
      if (line.indexOf("a=candidate:") === 0) {
        parts = line.substring(12).split(" ");
      } else {
        parts = line.substring(10).split(" ");
      }
      const candidate = {
        foundation: parts[0],
        component: {
          1: "rtp",
          2: "rtcp"
        }[parts[1]] || parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4],
        // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };
      for (let i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case "raddr":
            candidate.relatedAddress = parts[i + 1];
            break;
          case "rport":
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case "tcptype":
            candidate.tcpType = parts[i + 1];
            break;
          case "ufrag":
            candidate.ufrag = parts[i + 1];
            candidate.usernameFragment = parts[i + 1];
            break;
          default:
            if (candidate[parts[i]] === void 0) {
              candidate[parts[i]] = parts[i + 1];
            }
            break;
        }
      }
      return candidate;
    };
    SDPUtils2.writeCandidate = function(candidate) {
      const sdp2 = [];
      sdp2.push(candidate.foundation);
      const component = candidate.component;
      if (component === "rtp") {
        sdp2.push(1);
      } else if (component === "rtcp") {
        sdp2.push(2);
      } else {
        sdp2.push(component);
      }
      sdp2.push(candidate.protocol.toUpperCase());
      sdp2.push(candidate.priority);
      sdp2.push(candidate.address || candidate.ip);
      sdp2.push(candidate.port);
      const type = candidate.type;
      sdp2.push("typ");
      sdp2.push(type);
      if (type !== "host" && candidate.relatedAddress && candidate.relatedPort) {
        sdp2.push("raddr");
        sdp2.push(candidate.relatedAddress);
        sdp2.push("rport");
        sdp2.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
        sdp2.push("tcptype");
        sdp2.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp2.push("ufrag");
        sdp2.push(candidate.usernameFragment || candidate.ufrag);
      }
      return "candidate:" + sdp2.join(" ");
    };
    SDPUtils2.parseIceOptions = function(line) {
      return line.substring(14).split(" ");
    };
    SDPUtils2.parseRtpMap = function(line) {
      let parts = line.substring(9).split(" ");
      const parsed = {
        payloadType: parseInt(parts.shift(), 10)
        // was: id
      };
      parts = parts[0].split("/");
      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10);
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      parsed.numChannels = parsed.channels;
      return parsed;
    };
    SDPUtils2.writeRtpMap = function(codec) {
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      const channels = codec.channels || codec.numChannels || 1;
      return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
    };
    SDPUtils2.parseExtmap = function(line) {
      const parts = line.substring(9).split(" ");
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
        uri: parts[1],
        attributes: parts.slice(2).join(" ")
      };
    };
    SDPUtils2.writeExtmap = function(headerExtension) {
      return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + (headerExtension.attributes ? " " + headerExtension.attributes : "") + "\r\n";
    };
    SDPUtils2.parseFmtp = function(line) {
      const parsed = {};
      let kv;
      const parts = line.substring(line.indexOf(" ") + 1).split(";");
      for (let j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split("=");
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };
    SDPUtils2.writeFmtp = function(codec) {
      let line = "";
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        const params = [];
        Object.keys(codec.parameters).forEach((param) => {
          if (codec.parameters[param] !== void 0) {
            params.push(param + "=" + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
      }
      return line;
    };
    SDPUtils2.parseRtcpFb = function(line) {
      const parts = line.substring(line.indexOf(" ") + 1).split(" ");
      return {
        type: parts.shift(),
        parameter: parts.join(" ")
      };
    };
    SDPUtils2.writeRtcpFb = function(codec) {
      let lines = "";
      let pt = codec.payloadType;
      if (codec.preferredPayloadType !== void 0) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        codec.rtcpFeedback.forEach((fb) => {
          lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
        });
      }
      return lines;
    };
    SDPUtils2.parseSsrcMedia = function(line) {
      const sp = line.indexOf(" ");
      const parts = {
        ssrc: parseInt(line.substring(7, sp), 10)
      };
      const colon = line.indexOf(":", sp);
      if (colon > -1) {
        parts.attribute = line.substring(sp + 1, colon);
        parts.value = line.substring(colon + 1);
      } else {
        parts.attribute = line.substring(sp + 1);
      }
      return parts;
    };
    SDPUtils2.parseSsrcGroup = function(line) {
      const parts = line.substring(13).split(" ");
      return {
        semantics: parts.shift(),
        ssrcs: parts.map((ssrc) => parseInt(ssrc, 10))
      };
    };
    SDPUtils2.getMid = function(mediaSection) {
      const mid = SDPUtils2.matchPrefix(mediaSection, "a=mid:")[0];
      if (mid) {
        return mid.substring(6);
      }
    };
    SDPUtils2.parseFingerprint = function(line) {
      const parts = line.substring(14).split(" ");
      return {
        algorithm: parts[0].toLowerCase(),
        // algorithm is case-sensitive in Edge.
        value: parts[1].toUpperCase()
        // the definition is upper-case in RFC 4572.
      };
    };
    SDPUtils2.getDtlsParameters = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.matchPrefix(mediaSection + sessionpart, "a=fingerprint:");
      return {
        role: "auto",
        fingerprints: lines.map(SDPUtils2.parseFingerprint)
      };
    };
    SDPUtils2.writeDtlsParameters = function(params, setupType) {
      let sdp2 = "a=setup:" + setupType + "\r\n";
      params.fingerprints.forEach((fp) => {
        sdp2 += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
      });
      return sdp2;
    };
    SDPUtils2.parseCryptoLine = function(line) {
      const parts = line.substring(9).split(" ");
      return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
      };
    };
    SDPUtils2.writeCryptoLine = function(parameters) {
      return "a=crypto:" + parameters.tag + " " + parameters.cryptoSuite + " " + (typeof parameters.keyParams === "object" ? SDPUtils2.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? " " + parameters.sessionParams.join(" ") : "") + "\r\n";
    };
    SDPUtils2.parseCryptoKeyParams = function(keyParams) {
      if (keyParams.indexOf("inline:") !== 0) {
        return null;
      }
      const parts = keyParams.substring(7).split("|");
      return {
        keyMethod: "inline",
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(":")[0] : void 0,
        mkiLength: parts[2] ? parts[2].split(":")[1] : void 0
      };
    };
    SDPUtils2.writeCryptoKeyParams = function(keyParams) {
      return keyParams.keyMethod + ":" + keyParams.keySalt + (keyParams.lifeTime ? "|" + keyParams.lifeTime : "") + (keyParams.mkiValue && keyParams.mkiLength ? "|" + keyParams.mkiValue + ":" + keyParams.mkiLength : "");
    };
    SDPUtils2.getCryptoParameters = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.matchPrefix(mediaSection + sessionpart, "a=crypto:");
      return lines.map(SDPUtils2.parseCryptoLine);
    };
    SDPUtils2.getIceParameters = function(mediaSection, sessionpart) {
      const ufrag = SDPUtils2.matchPrefix(mediaSection + sessionpart, "a=ice-ufrag:")[0];
      const pwd = SDPUtils2.matchPrefix(mediaSection + sessionpart, "a=ice-pwd:")[0];
      if (!(ufrag && pwd)) {
        return null;
      }
      return {
        usernameFragment: ufrag.substring(12),
        password: pwd.substring(10)
      };
    };
    SDPUtils2.writeIceParameters = function(params) {
      let sdp2 = "a=ice-ufrag:" + params.usernameFragment + "\r\na=ice-pwd:" + params.password + "\r\n";
      if (params.iceLite) {
        sdp2 += "a=ice-lite\r\n";
      }
      return sdp2;
    };
    SDPUtils2.parseRtpParameters = function(mediaSection) {
      const description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      const lines = SDPUtils2.splitLines(mediaSection);
      const mline = lines[0].split(" ");
      description.profile = mline[2];
      for (let i = 3; i < mline.length; i++) {
        const pt = mline[i];
        const rtpmapline = SDPUtils2.matchPrefix(mediaSection, "a=rtpmap:" + pt + " ")[0];
        if (rtpmapline) {
          const codec = SDPUtils2.parseRtpMap(rtpmapline);
          const fmtps = SDPUtils2.matchPrefix(mediaSection, "a=fmtp:" + pt + " ");
          codec.parameters = fmtps.length ? SDPUtils2.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-fb:" + pt + " ").map(SDPUtils2.parseRtcpFb);
          description.codecs.push(codec);
          switch (codec.name.toUpperCase()) {
            case "RED":
            case "ULPFEC":
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
          }
        }
      }
      SDPUtils2.matchPrefix(mediaSection, "a=extmap:").forEach((line) => {
        description.headerExtensions.push(SDPUtils2.parseExtmap(line));
      });
      const wildcardRtcpFb = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-fb:* ").map(SDPUtils2.parseRtcpFb);
      description.codecs.forEach((codec) => {
        wildcardRtcpFb.forEach((fb) => {
          const duplicate = codec.rtcpFeedback.find((existingFeedback) => {
            return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
          });
          if (!duplicate) {
            codec.rtcpFeedback.push(fb);
          }
        });
      });
      return description;
    };
    SDPUtils2.writeRtpDescription = function(kind, caps) {
      let sdp2 = "";
      sdp2 += "m=" + kind + " ";
      sdp2 += caps.codecs.length > 0 ? "9" : "0";
      sdp2 += " " + (caps.profile || "UDP/TLS/RTP/SAVPF") + " ";
      sdp2 += caps.codecs.map((codec) => {
        if (codec.preferredPayloadType !== void 0) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(" ") + "\r\n";
      sdp2 += "c=IN IP4 0.0.0.0\r\n";
      sdp2 += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
      caps.codecs.forEach((codec) => {
        sdp2 += SDPUtils2.writeRtpMap(codec);
        sdp2 += SDPUtils2.writeFmtp(codec);
        sdp2 += SDPUtils2.writeRtcpFb(codec);
      });
      let maxptime = 0;
      caps.codecs.forEach((codec) => {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp2 += "a=maxptime:" + maxptime + "\r\n";
      }
      if (caps.headerExtensions) {
        caps.headerExtensions.forEach((extension) => {
          sdp2 += SDPUtils2.writeExtmap(extension);
        });
      }
      return sdp2;
    };
    SDPUtils2.parseRtpEncodingParameters = function(mediaSection) {
      const encodingParameters = [];
      const description = SDPUtils2.parseRtpParameters(mediaSection);
      const hasRed = description.fecMechanisms.indexOf("RED") !== -1;
      const hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
      const ssrcs = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((parts) => parts.attribute === "cname");
      const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      let secondarySsrc;
      const flows = SDPUtils2.matchPrefix(mediaSection, "a=ssrc-group:FID").map((line) => {
        const parts = line.substring(17).split(" ");
        return parts.map((part) => parseInt(part, 10));
      });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }
      description.codecs.forEach((codec) => {
        if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
          let encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = {
              ssrc: secondarySsrc
            };
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? "red+ulpfec" : "red"
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }
      let bandwidth = SDPUtils2.matchPrefix(mediaSection, "b=");
      if (bandwidth.length) {
        if (bandwidth[0].indexOf("b=TIAS:") === 0) {
          bandwidth = parseInt(bandwidth[0].substring(7), 10);
        } else if (bandwidth[0].indexOf("b=AS:") === 0) {
          bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1e3 * 0.95 - 50 * 40 * 8;
        } else {
          bandwidth = void 0;
        }
        encodingParameters.forEach((params) => {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };
    SDPUtils2.parseRtcpParameters = function(mediaSection) {
      const rtcpParameters = {};
      const remoteSsrc = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((obj) => obj.attribute === "cname")[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }
      const rsize = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-rsize");
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;
      const mux = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-mux");
      rtcpParameters.mux = mux.length > 0;
      return rtcpParameters;
    };
    SDPUtils2.writeRtcpParameters = function(rtcpParameters) {
      let sdp2 = "";
      if (rtcpParameters.reducedSize) {
        sdp2 += "a=rtcp-rsize\r\n";
      }
      if (rtcpParameters.mux) {
        sdp2 += "a=rtcp-mux\r\n";
      }
      if (rtcpParameters.ssrc !== void 0 && rtcpParameters.cname) {
        sdp2 += "a=ssrc:" + rtcpParameters.ssrc + " cname:" + rtcpParameters.cname + "\r\n";
      }
      return sdp2;
    };
    SDPUtils2.parseMsid = function(mediaSection) {
      let parts;
      const spec = SDPUtils2.matchPrefix(mediaSection, "a=msid:");
      if (spec.length === 1) {
        parts = spec[0].substring(7).split(" ");
        return {
          stream: parts[0],
          track: parts[1]
        };
      }
      const planB = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils2.parseSsrcMedia(line)).filter((msidParts) => msidParts.attribute === "msid");
      if (planB.length > 0) {
        parts = planB[0].value.split(" ");
        return {
          stream: parts[0],
          track: parts[1]
        };
      }
    };
    SDPUtils2.parseSctpDescription = function(mediaSection) {
      const mline = SDPUtils2.parseMLine(mediaSection);
      const maxSizeLine = SDPUtils2.matchPrefix(mediaSection, "a=max-message-size:");
      let maxMessageSize;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      const sctpPort = SDPUtils2.matchPrefix(mediaSection, "a=sctp-port:");
      if (sctpPort.length > 0) {
        return {
          port: parseInt(sctpPort[0].substring(12), 10),
          protocol: mline.fmt,
          maxMessageSize
        };
      }
      const sctpMapLines = SDPUtils2.matchPrefix(mediaSection, "a=sctpmap:");
      if (sctpMapLines.length > 0) {
        const parts = sctpMapLines[0].substring(10).split(" ");
        return {
          port: parseInt(parts[0], 10),
          protocol: parts[1],
          maxMessageSize
        };
      }
    };
    SDPUtils2.writeSctpDescription = function(media, sctp) {
      let output = [];
      if (media.protocol !== "DTLS/SCTP") {
        output = ["m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctp-port:" + sctp.port + "\r\n"];
      } else {
        output = ["m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"];
      }
      if (sctp.maxMessageSize !== void 0) {
        output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
      }
      return output.join("");
    };
    SDPUtils2.generateSessionId = function() {
      return Math.random().toString().substr(2, 22);
    };
    SDPUtils2.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
      let sessionId;
      const version2 = sessVer !== void 0 ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils2.generateSessionId();
      }
      const user = sessUser || "thisisadapterortc";
      return "v=0\r\no=" + user + " " + sessionId + " " + version2 + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
    };
    SDPUtils2.getDirection = function(mediaSection, sessionpart) {
      const lines = SDPUtils2.splitLines(mediaSection);
      for (let i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case "a=sendrecv":
          case "a=sendonly":
          case "a=recvonly":
          case "a=inactive":
            return lines[i].substring(2);
        }
      }
      if (sessionpart) {
        return SDPUtils2.getDirection(sessionpart);
      }
      return "sendrecv";
    };
    SDPUtils2.getKind = function(mediaSection) {
      const lines = SDPUtils2.splitLines(mediaSection);
      const mline = lines[0].split(" ");
      return mline[0].substring(2);
    };
    SDPUtils2.isRejected = function(mediaSection) {
      return mediaSection.split(" ", 2)[1] === "0";
    };
    SDPUtils2.parseMLine = function(mediaSection) {
      const lines = SDPUtils2.splitLines(mediaSection);
      const parts = lines[0].substring(2).split(" ");
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(" ")
      };
    };
    SDPUtils2.parseOLine = function(mediaSection) {
      const line = SDPUtils2.matchPrefix(mediaSection, "o=")[0];
      const parts = line.substring(2).split(" ");
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };
    SDPUtils2.isValidSDP = function(blob) {
      if (typeof blob !== "string" || blob.length === 0) {
        return false;
      }
      const lines = SDPUtils2.splitLines(blob);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== "=") {
          return false;
        }
      }
      return true;
    };
    {
      module.exports = SDPUtils2;
    }
  })(sdp$1);
  return sdp$1.exports;
}
var sdpExports = requireSdp();
var SDPUtils = getDefaultExportFromCjs(sdpExports);
var sdp = _mergeNamespaces({
  __proto__: null,
  default: SDPUtils
}, [sdpExports]);
function shimRTCIceCandidate(window2) {
  if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "foundation" in window2.RTCIceCandidate.prototype) {
    return;
  }
  const NativeRTCIceCandidate = window2.RTCIceCandidate;
  window2.RTCIceCandidate = function RTCIceCandidate2(args) {
    if (typeof args === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substring(2);
    }
    if (args.candidate && args.candidate.length) {
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = SDPUtils.parseCandidate(args.candidate);
      for (const key in parsedCandidate) {
        if (!(key in nativeCandidate)) {
          Object.defineProperty(nativeCandidate, key, {
            value: parsedCandidate[key]
          });
        }
      }
      nativeCandidate.toJSON = function toJSON() {
        return {
          candidate: nativeCandidate.candidate,
          sdpMid: nativeCandidate.sdpMid,
          sdpMLineIndex: nativeCandidate.sdpMLineIndex,
          usernameFragment: nativeCandidate.usernameFragment
        };
      };
      return nativeCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window2.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
  wrapPeerConnectionEvent(window2, "icecandidate", (e2) => {
    if (e2.candidate) {
      Object.defineProperty(e2, "candidate", {
        value: new window2.RTCIceCandidate(e2.candidate),
        writable: "false"
      });
    }
    return e2;
  });
}
function shimRTCIceCandidateRelayProtocol(window2) {
  if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "relayProtocol" in window2.RTCIceCandidate.prototype) {
    return;
  }
  wrapPeerConnectionEvent(window2, "icecandidate", (e2) => {
    if (e2.candidate) {
      const parsedCandidate = SDPUtils.parseCandidate(e2.candidate.candidate);
      if (parsedCandidate.type === "relay") {
        e2.candidate.relayProtocol = {
          0: "tls",
          1: "tcp",
          2: "udp"
        }[parsedCandidate.priority >> 24];
      }
    }
    return e2;
  });
}
function shimMaxMessageSize(window2, browserDetails2) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (!("sctp" in window2.RTCPeerConnection.prototype)) {
    Object.defineProperty(window2.RTCPeerConnection.prototype, "sctp", {
      get() {
        return typeof this._sctp === "undefined" ? null : this._sctp;
      }
    });
  }
  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = SDPUtils.splitSections(description.sdp);
    sections.shift();
    return sections.some((mediaSection) => {
      const mLine = SDPUtils.parseMLine(mediaSection);
      return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
    });
  };
  const getRemoteFirefoxVersion = function(description) {
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version2 = parseInt(match[1], 10);
    return version2 !== version2 ? -1 : version2;
  };
  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    let canSendMaxMessageSize = 65536;
    if (browserDetails2.browser === "firefox") {
      if (browserDetails2.version < 57) {
        if (remoteIsFirefox === -1) {
          canSendMaxMessageSize = 16384;
        } else {
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails2.version < 60) {
        canSendMaxMessageSize = browserDetails2.version === 57 ? 65535 : 65536;
      } else {
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };
  const getMaxMessageSize = function(description, remoteIsFirefox) {
    let maxMessageSize = 65536;
    if (browserDetails2.browser === "firefox" && browserDetails2.version === 57) {
      maxMessageSize = 65535;
    }
    const match = SDPUtils.matchPrefix(description.sdp, "a=max-message-size:");
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substring(19), 10);
    } else if (browserDetails2.browser === "firefox" && remoteIsFirefox !== -1) {
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };
  const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
  window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
    this._sctp = null;
    if (browserDetails2.browser === "chrome" && browserDetails2.version >= 76) {
      const {
        sdpSemantics
      } = this.getConfiguration();
      if (sdpSemantics === "plan-b") {
        Object.defineProperty(this, "sctp", {
          get() {
            return typeof this._sctp === "undefined" ? null : this._sctp;
          },
          enumerable: true,
          configurable: true
        });
      }
    }
    if (sctpInDescription(arguments[0])) {
      const isFirefox = getRemoteFirefoxVersion(arguments[0]);
      const canSendMMS = getCanSendMaxMessageSize(isFirefox);
      const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
      let maxMessageSize;
      if (canSendMMS === 0 && remoteMMS === 0) {
        maxMessageSize = Number.POSITIVE_INFINITY;
      } else if (canSendMMS === 0 || remoteMMS === 0) {
        maxMessageSize = Math.max(canSendMMS, remoteMMS);
      } else {
        maxMessageSize = Math.min(canSendMMS, remoteMMS);
      }
      const sctp = {};
      Object.defineProperty(sctp, "maxMessageSize", {
        get() {
          return maxMessageSize;
        }
      });
      this._sctp = sctp;
    }
    return origSetRemoteDescription.apply(this, arguments);
  };
}
function shimSendThrowTypeError(window2) {
  if (!(window2.RTCPeerConnection && "createDataChannel" in window2.RTCPeerConnection.prototype)) {
    return;
  }
  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel = window2.RTCPeerConnection.prototype.createDataChannel;
  window2.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
    const dataChannel = origCreateDataChannel.apply(this, arguments);
    wrapDcSend(dataChannel, this);
    return dataChannel;
  };
  wrapPeerConnectionEvent(window2, "datachannel", (e2) => {
    wrapDcSend(e2.channel, e2.target);
    return e2;
  });
}
function shimConnectionState(window2) {
  if (!window2.RTCPeerConnection || "connectionState" in window2.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window2.RTCPeerConnection.prototype;
  Object.defineProperty(proto, "connectionState", {
    get() {
      return {
        completed: "connected",
        checking: "connecting"
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, "onconnectionstatechange", {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener("connectionstatechange", this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener("connectionstatechange", this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
  ["setLocalDescription", "setRemoteDescription"].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = (e2) => {
          const pc = e2.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event("connectionstatechange", e2);
            pc.dispatchEvent(newEvent);
          }
          return e2;
        };
        this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly);
      }
      return origMethod.apply(this, arguments);
    };
  });
}
function removeExtmapAllowMixed(window2, browserDetails2) {
  if (!window2.RTCPeerConnection) {
    return;
  }
  if (browserDetails2.browser === "chrome" && browserDetails2.version >= 71) {
    return;
  }
  if (browserDetails2.browser === "safari" && browserDetails2.version >= 605) {
    return;
  }
  const nativeSRD = window2.RTCPeerConnection.prototype.setRemoteDescription;
  window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
      const sdp2 = desc.sdp.split("\n").filter((line) => {
        return line.trim() !== "a=extmap-allow-mixed";
      }).join("\n");
      if (window2.RTCSessionDescription && desc instanceof window2.RTCSessionDescription) {
        arguments[0] = new window2.RTCSessionDescription({
          type: desc.type,
          sdp: sdp2
        });
      } else {
        desc.sdp = sdp2;
      }
    }
    return nativeSRD.apply(this, arguments);
  };
}
function shimAddIceCandidateNullOrEmpty(window2, browserDetails2) {
  if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeAddIceCandidate = window2.RTCPeerConnection.prototype.addIceCandidate;
  if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
    return;
  }
  window2.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
    if (!arguments[0]) {
      if (arguments[1]) {
        arguments[1].apply(null);
      }
      return Promise.resolve();
    }
    if ((browserDetails2.browser === "chrome" && browserDetails2.version < 78 || browserDetails2.browser === "firefox" && browserDetails2.version < 68 || browserDetails2.browser === "safari") && arguments[0] && arguments[0].candidate === "") {
      return Promise.resolve();
    }
    return nativeAddIceCandidate.apply(this, arguments);
  };
}
function shimParameterlessSetLocalDescription(window2, browserDetails2) {
  if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
  if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
    return;
  }
  window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    let desc = arguments[0] || {};
    if (typeof desc !== "object" || desc.type && desc.sdp) {
      return nativeSetLocalDescription.apply(this, arguments);
    }
    desc = {
      type: desc.type,
      sdp: desc.sdp
    };
    if (!desc.type) {
      switch (this.signalingState) {
        case "stable":
        case "have-local-offer":
        case "have-remote-pranswer":
          desc.type = "offer";
          break;
        default:
          desc.type = "answer";
          break;
      }
    }
    if (desc.sdp || desc.type !== "offer" && desc.type !== "answer") {
      return nativeSetLocalDescription.apply(this, [desc]);
    }
    const func = desc.type === "offer" ? this.createOffer : this.createAnswer;
    return func.apply(this).then((d) => nativeSetLocalDescription.apply(this, [d]));
  };
}
var commonShim = Object.freeze({
  __proto__: null,
  removeExtmapAllowMixed,
  shimAddIceCandidateNullOrEmpty,
  shimConnectionState,
  shimMaxMessageSize,
  shimParameterlessSetLocalDescription,
  shimRTCIceCandidate,
  shimRTCIceCandidateRelayProtocol,
  shimSendThrowTypeError
});
function adapterFactory() {
  let {
    window: window2
  } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    shimChrome: true,
    shimFirefox: true,
    shimSafari: true
  };
  const logging2 = log;
  const browserDetails2 = detectBrowser(window2);
  const adapter = {
    browserDetails: browserDetails2,
    commonShim,
    extractVersion,
    disableLog,
    disableWarnings,
    // Expose sdp as a convenience. For production apps include directly.
    sdp
  };
  switch (browserDetails2.browser) {
    case "chrome":
      if (!chromeShim || !shimPeerConnection$1 || !options.shimChrome) {
        logging2("Chrome shim is not included in this adapter release.");
        return adapter;
      }
      if (browserDetails2.version === null) {
        logging2("Chrome shim can not determine version, not shimming.");
        return adapter;
      }
      logging2("adapter.js shimming chrome.");
      adapter.browserShim = chromeShim;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails2);
      shimParameterlessSetLocalDescription(window2);
      shimGetUserMedia$2(window2, browserDetails2);
      shimMediaStream(window2);
      shimPeerConnection$1(window2, browserDetails2);
      shimOnTrack$1(window2);
      shimAddTrackRemoveTrack(window2, browserDetails2);
      shimGetSendersWithDtmf(window2);
      shimSenderReceiverGetStats(window2);
      fixNegotiationNeeded(window2, browserDetails2);
      shimRTCIceCandidate(window2);
      shimRTCIceCandidateRelayProtocol(window2);
      shimConnectionState(window2);
      shimMaxMessageSize(window2, browserDetails2);
      shimSendThrowTypeError(window2);
      removeExtmapAllowMixed(window2, browserDetails2);
      break;
    case "firefox":
      if (!firefoxShim || !shimPeerConnection || !options.shimFirefox) {
        logging2("Firefox shim is not included in this adapter release.");
        return adapter;
      }
      logging2("adapter.js shimming firefox.");
      adapter.browserShim = firefoxShim;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails2);
      shimParameterlessSetLocalDescription(window2);
      shimGetUserMedia$1(window2, browserDetails2);
      shimPeerConnection(window2, browserDetails2);
      shimOnTrack(window2);
      shimRemoveStream(window2);
      shimSenderGetStats(window2);
      shimReceiverGetStats(window2);
      shimRTCDataChannel(window2);
      shimAddTransceiver(window2);
      shimGetParameters(window2);
      shimCreateOffer(window2);
      shimCreateAnswer(window2);
      shimRTCIceCandidate(window2);
      shimConnectionState(window2);
      shimMaxMessageSize(window2, browserDetails2);
      shimSendThrowTypeError(window2);
      break;
    case "safari":
      if (!safariShim || !options.shimSafari) {
        logging2("Safari shim is not included in this adapter release.");
        return adapter;
      }
      logging2("adapter.js shimming safari.");
      adapter.browserShim = safariShim;
      shimAddIceCandidateNullOrEmpty(window2, browserDetails2);
      shimParameterlessSetLocalDescription(window2);
      shimRTCIceServerUrls(window2);
      shimCreateOfferLegacy(window2);
      shimCallbacksAPI(window2);
      shimLocalStreamsAPI(window2);
      shimRemoteStreamsAPI(window2);
      shimTrackEventTransceiver(window2);
      shimGetUserMedia(window2);
      shimAudioContext(window2);
      shimRTCIceCandidate(window2);
      shimRTCIceCandidateRelayProtocol(window2);
      shimMaxMessageSize(window2, browserDetails2);
      shimSendThrowTypeError(window2);
      removeExtmapAllowMixed(window2, browserDetails2);
      break;
    default:
      logging2("Unsupported browser!");
      break;
  }
  return adapter;
}
adapterFactory({
  window: typeof window === "undefined" ? void 0 : window
});
var ENCRYPTION_ALGORITHM = "AES-GCM";
var DECRYPTION_FAILURE_TOLERANCE = 10;
var E2EE_FLAG = "lk_e2ee";
var SALT = "LKFrameEncryptionKey";
var KEY_PROVIDER_DEFAULTS = {
  sharedKey: false,
  ratchetSalt: SALT,
  ratchetWindowSize: 8,
  failureTolerance: DECRYPTION_FAILURE_TOLERANCE,
  keyringSize: 16
};
var KeyProviderEvent;
(function(KeyProviderEvent2) {
  KeyProviderEvent2["SetKey"] = "setKey";
  KeyProviderEvent2["RatchetRequest"] = "ratchetRequest";
  KeyProviderEvent2["KeyRatcheted"] = "keyRatcheted";
})(KeyProviderEvent || (KeyProviderEvent = {}));
var KeyHandlerEvent;
(function(KeyHandlerEvent2) {
  KeyHandlerEvent2["KeyRatcheted"] = "keyRatcheted";
})(KeyHandlerEvent || (KeyHandlerEvent = {}));
var EncryptionEvent;
(function(EncryptionEvent2) {
  EncryptionEvent2["ParticipantEncryptionStatusChanged"] = "participantEncryptionStatusChanged";
  EncryptionEvent2["EncryptionError"] = "encryptionError";
})(EncryptionEvent || (EncryptionEvent = {}));
var CryptorEvent;
(function(CryptorEvent2) {
  CryptorEvent2["Error"] = "cryptorError";
})(CryptorEvent || (CryptorEvent = {}));
function isE2EESupported() {
  return isInsertableStreamSupported() || isScriptTransformSupported();
}
function isScriptTransformSupported() {
  return typeof window.RTCRtpScriptTransform !== "undefined";
}
function isInsertableStreamSupported() {
  return typeof window.RTCRtpSender !== "undefined" && // @ts-ignore
  typeof window.RTCRtpSender.prototype.createEncodedStreams !== "undefined";
}
function isVideoFrame(frame) {
  return "type" in frame;
}
function importKey(keyBytes_1) {
  return __awaiter(this, arguments, void 0, function(keyBytes) {
    let algorithm = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      name: ENCRYPTION_ALGORITHM
    };
    let usage = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "encrypt";
    return function* () {
      return crypto.subtle.importKey("raw", keyBytes, algorithm, false, usage === "derive" ? ["deriveBits", "deriveKey"] : ["encrypt", "decrypt"]);
    }();
  });
}
function createKeyMaterialFromString(password) {
  return __awaiter(this, void 0, void 0, function* () {
    let enc = new TextEncoder();
    const keyMaterial = yield crypto.subtle.importKey("raw", enc.encode(password), {
      name: "PBKDF2"
    }, false, ["deriveBits", "deriveKey"]);
    return keyMaterial;
  });
}
function createKeyMaterialFromBuffer(cryptoBuffer) {
  return __awaiter(this, void 0, void 0, function* () {
    const keyMaterial = yield crypto.subtle.importKey("raw", cryptoBuffer, "HKDF", false, ["deriveBits", "deriveKey"]);
    return keyMaterial;
  });
}
function getAlgoOptions(algorithmName, salt) {
  const textEncoder = new TextEncoder();
  const encodedSalt = textEncoder.encode(salt);
  switch (algorithmName) {
    case "HKDF":
      return {
        name: "HKDF",
        salt: encodedSalt,
        hash: "SHA-256",
        info: new ArrayBuffer(128)
      };
    case "PBKDF2": {
      return {
        name: "PBKDF2",
        salt: encodedSalt,
        hash: "SHA-256",
        iterations: 1e5
      };
    }
    default:
      throw new Error("algorithm ".concat(algorithmName, " is currently unsupported"));
  }
}
function deriveKeys(material, salt) {
  return __awaiter(this, void 0, void 0, function* () {
    const algorithmOptions = getAlgoOptions(material.algorithm.name, salt);
    const encryptionKey = yield crypto.subtle.deriveKey(algorithmOptions, material, {
      name: ENCRYPTION_ALGORITHM,
      length: 128
    }, false, ["encrypt", "decrypt"]);
    return {
      material,
      encryptionKey
    };
  });
}
function createE2EEKey() {
  return window.crypto.getRandomValues(new Uint8Array(32));
}
function ratchet(material, salt) {
  return __awaiter(this, void 0, void 0, function* () {
    const algorithmOptions = getAlgoOptions(material.algorithm.name, salt);
    return crypto.subtle.deriveBits(algorithmOptions, material, 256);
  });
}
function needsRbspUnescaping(frameData) {
  for (var i = 0; i < frameData.length - 3; i++) {
    if (frameData[i] == 0 && frameData[i + 1] == 0 && frameData[i + 2] == 3)
      return true;
  }
  return false;
}
function parseRbsp(stream) {
  const dataOut = [];
  var length = stream.length;
  for (var i = 0; i < stream.length; ) {
    if (length - i >= 3 && !stream[i] && !stream[i + 1] && stream[i + 2] == 3) {
      dataOut.push(stream[i++]);
      dataOut.push(stream[i++]);
      i++;
    } else {
      dataOut.push(stream[i++]);
    }
  }
  return new Uint8Array(dataOut);
}
var kZerosInStartSequence = 2;
var kEmulationByte = 3;
function writeRbsp(data_in) {
  const dataOut = [];
  var numConsecutiveZeros = 0;
  for (var i = 0; i < data_in.length; ++i) {
    var byte = data_in[i];
    if (byte <= kEmulationByte && numConsecutiveZeros >= kZerosInStartSequence) {
      dataOut.push(kEmulationByte);
      numConsecutiveZeros = 0;
    }
    dataOut.push(byte);
    if (byte == 0) {
      ++numConsecutiveZeros;
    } else {
      numConsecutiveZeros = 0;
    }
  }
  return new Uint8Array(dataOut);
}
var BaseKeyProvider = class extends eventsExports.EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super();
    this.onKeyRatcheted = (material, keyIndex) => {
      livekitLogger.debug("key ratcheted event received", {
        material,
        keyIndex
      });
    };
    this.keyInfoMap = /* @__PURE__ */ new Map();
    this.options = Object.assign(Object.assign({}, KEY_PROVIDER_DEFAULTS), options);
    this.on(KeyProviderEvent.KeyRatcheted, this.onKeyRatcheted);
  }
  /**
   * callback to invoke once a key has been set for a participant
   * @param key
   * @param participantIdentity
   * @param keyIndex
   */
  onSetEncryptionKey(key, participantIdentity, keyIndex) {
    const keyInfo = {
      key,
      participantIdentity,
      keyIndex
    };
    if (!this.options.sharedKey && !participantIdentity) {
      throw new Error("participant identity needs to be passed for encryption key if sharedKey option is false");
    }
    this.keyInfoMap.set("".concat(participantIdentity !== null && participantIdentity !== void 0 ? participantIdentity : "shared", "-").concat(keyIndex !== null && keyIndex !== void 0 ? keyIndex : 0), keyInfo);
    this.emit(KeyProviderEvent.SetKey, keyInfo);
  }
  getKeys() {
    return Array.from(this.keyInfoMap.values());
  }
  getOptions() {
    return this.options;
  }
  ratchetKey(participantIdentity, keyIndex) {
    this.emit(KeyProviderEvent.RatchetRequest, participantIdentity, keyIndex);
  }
};
var ExternalE2EEKeyProvider = class extends BaseKeyProvider {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const opts = Object.assign(Object.assign({}, options), {
      sharedKey: true,
      // for a shared key provider failing to decrypt for a specific participant
      // should not mark the key as invalid, so we accept wrong keys forever
      // and won't try to auto-ratchet
      ratchetWindowSize: 0,
      failureTolerance: -1
    });
    super(opts);
  }
  /**
   * Accepts a passphrase that's used to create the crypto keys.
   * When passing in a string, PBKDF2 is used.
   * When passing in an Array buffer of cryptographically random numbers, HKDF is being used. (recommended)
   * @param key
   */
  setKey(key) {
    return __awaiter(this, void 0, void 0, function* () {
      const derivedKey = typeof key === "string" ? yield createKeyMaterialFromString(key) : yield createKeyMaterialFromBuffer(key);
      this.onSetEncryptionKey(derivedKey);
    });
  }
};
var LivekitError = class extends Error {
  constructor(code, message) {
    super(message || "an error has occured");
    this.name = "LiveKitError";
    this.code = code;
  }
};
var ConnectionErrorReason;
(function(ConnectionErrorReason2) {
  ConnectionErrorReason2[ConnectionErrorReason2["NotAllowed"] = 0] = "NotAllowed";
  ConnectionErrorReason2[ConnectionErrorReason2["ServerUnreachable"] = 1] = "ServerUnreachable";
  ConnectionErrorReason2[ConnectionErrorReason2["InternalError"] = 2] = "InternalError";
  ConnectionErrorReason2[ConnectionErrorReason2["Cancelled"] = 3] = "Cancelled";
  ConnectionErrorReason2[ConnectionErrorReason2["LeaveRequest"] = 4] = "LeaveRequest";
})(ConnectionErrorReason || (ConnectionErrorReason = {}));
var ConnectionError = class extends LivekitError {
  constructor(message, reason, status, context) {
    super(1, message);
    this.name = "ConnectionError";
    this.status = status;
    this.reason = reason;
    this.context = context;
    this.reasonName = ConnectionErrorReason[reason];
  }
};
var DeviceUnsupportedError = class extends LivekitError {
  constructor(message) {
    super(21, message !== null && message !== void 0 ? message : "device is unsupported");
    this.name = "DeviceUnsupportedError";
  }
};
var TrackInvalidError = class extends LivekitError {
  constructor(message) {
    super(20, message !== null && message !== void 0 ? message : "track is invalid");
    this.name = "TrackInvalidError";
  }
};
var UnsupportedServer = class extends LivekitError {
  constructor(message) {
    super(10, message !== null && message !== void 0 ? message : "unsupported server");
    this.name = "UnsupportedServer";
  }
};
var UnexpectedConnectionState = class extends LivekitError {
  constructor(message) {
    super(12, message !== null && message !== void 0 ? message : "unexpected connection state");
    this.name = "UnexpectedConnectionState";
  }
};
var NegotiationError = class extends LivekitError {
  constructor(message) {
    super(13, message !== null && message !== void 0 ? message : "unable to negotiate");
    this.name = "NegotiationError";
  }
};
var PublishDataError = class extends LivekitError {
  constructor(message) {
    super(14, message !== null && message !== void 0 ? message : "unable to publish data");
    this.name = "PublishDataError";
  }
};
var SignalRequestError = class extends LivekitError {
  constructor(message, reason) {
    super(15, message);
    this.reason = reason;
    this.reasonName = typeof reason === "string" ? reason : RequestResponse_Reason[reason];
  }
};
var MediaDeviceFailure;
(function(MediaDeviceFailure2) {
  MediaDeviceFailure2["PermissionDenied"] = "PermissionDenied";
  MediaDeviceFailure2["NotFound"] = "NotFound";
  MediaDeviceFailure2["DeviceInUse"] = "DeviceInUse";
  MediaDeviceFailure2["Other"] = "Other";
})(MediaDeviceFailure || (MediaDeviceFailure = {}));
(function(MediaDeviceFailure2) {
  function getFailure(error) {
    if (error && "name" in error) {
      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        return MediaDeviceFailure2.NotFound;
      }
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        return MediaDeviceFailure2.PermissionDenied;
      }
      if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        return MediaDeviceFailure2.DeviceInUse;
      }
      return MediaDeviceFailure2.Other;
    }
  }
  MediaDeviceFailure2.getFailure = getFailure;
})(MediaDeviceFailure || (MediaDeviceFailure = {}));
var CryptorErrorReason;
(function(CryptorErrorReason2) {
  CryptorErrorReason2[CryptorErrorReason2["InvalidKey"] = 0] = "InvalidKey";
  CryptorErrorReason2[CryptorErrorReason2["MissingKey"] = 1] = "MissingKey";
  CryptorErrorReason2[CryptorErrorReason2["InternalError"] = 2] = "InternalError";
})(CryptorErrorReason || (CryptorErrorReason = {}));
var CryptorError = class extends LivekitError {
  constructor(message) {
    let reason = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : CryptorErrorReason.InternalError;
    let participantIdentity = arguments.length > 2 ? arguments[2] : void 0;
    super(40, message);
    this.reason = reason;
    this.participantIdentity = participantIdentity;
  }
};
var RoomEvent;
(function(RoomEvent2) {
  RoomEvent2["Connected"] = "connected";
  RoomEvent2["Reconnecting"] = "reconnecting";
  RoomEvent2["SignalReconnecting"] = "signalReconnecting";
  RoomEvent2["Reconnected"] = "reconnected";
  RoomEvent2["Disconnected"] = "disconnected";
  RoomEvent2["ConnectionStateChanged"] = "connectionStateChanged";
  RoomEvent2["MediaDevicesChanged"] = "mediaDevicesChanged";
  RoomEvent2["ParticipantConnected"] = "participantConnected";
  RoomEvent2["ParticipantDisconnected"] = "participantDisconnected";
  RoomEvent2["TrackPublished"] = "trackPublished";
  RoomEvent2["TrackSubscribed"] = "trackSubscribed";
  RoomEvent2["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
  RoomEvent2["TrackUnpublished"] = "trackUnpublished";
  RoomEvent2["TrackUnsubscribed"] = "trackUnsubscribed";
  RoomEvent2["TrackMuted"] = "trackMuted";
  RoomEvent2["TrackUnmuted"] = "trackUnmuted";
  RoomEvent2["LocalTrackPublished"] = "localTrackPublished";
  RoomEvent2["LocalTrackUnpublished"] = "localTrackUnpublished";
  RoomEvent2["LocalAudioSilenceDetected"] = "localAudioSilenceDetected";
  RoomEvent2["ActiveSpeakersChanged"] = "activeSpeakersChanged";
  RoomEvent2["ParticipantMetadataChanged"] = "participantMetadataChanged";
  RoomEvent2["ParticipantNameChanged"] = "participantNameChanged";
  RoomEvent2["ParticipantAttributesChanged"] = "participantAttributesChanged";
  RoomEvent2["RoomMetadataChanged"] = "roomMetadataChanged";
  RoomEvent2["DataReceived"] = "dataReceived";
  RoomEvent2["SipDTMFReceived"] = "sipDTMFReceived";
  RoomEvent2["TranscriptionReceived"] = "transcriptionReceived";
  RoomEvent2["ConnectionQualityChanged"] = "connectionQualityChanged";
  RoomEvent2["TrackStreamStateChanged"] = "trackStreamStateChanged";
  RoomEvent2["TrackSubscriptionPermissionChanged"] = "trackSubscriptionPermissionChanged";
  RoomEvent2["TrackSubscriptionStatusChanged"] = "trackSubscriptionStatusChanged";
  RoomEvent2["AudioPlaybackStatusChanged"] = "audioPlaybackChanged";
  RoomEvent2["VideoPlaybackStatusChanged"] = "videoPlaybackChanged";
  RoomEvent2["MediaDevicesError"] = "mediaDevicesError";
  RoomEvent2["ParticipantPermissionsChanged"] = "participantPermissionsChanged";
  RoomEvent2["SignalConnected"] = "signalConnected";
  RoomEvent2["RecordingStatusChanged"] = "recordingStatusChanged";
  RoomEvent2["ParticipantEncryptionStatusChanged"] = "participantEncryptionStatusChanged";
  RoomEvent2["EncryptionError"] = "encryptionError";
  RoomEvent2["DCBufferStatusChanged"] = "dcBufferStatusChanged";
  RoomEvent2["ActiveDeviceChanged"] = "activeDeviceChanged";
  RoomEvent2["ChatMessage"] = "chatMessage";
  RoomEvent2["LocalTrackSubscribed"] = "localTrackSubscribed";
  RoomEvent2["MetricsReceived"] = "metricsReceived";
})(RoomEvent || (RoomEvent = {}));
var ParticipantEvent;
(function(ParticipantEvent2) {
  ParticipantEvent2["TrackPublished"] = "trackPublished";
  ParticipantEvent2["TrackSubscribed"] = "trackSubscribed";
  ParticipantEvent2["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
  ParticipantEvent2["TrackUnpublished"] = "trackUnpublished";
  ParticipantEvent2["TrackUnsubscribed"] = "trackUnsubscribed";
  ParticipantEvent2["TrackMuted"] = "trackMuted";
  ParticipantEvent2["TrackUnmuted"] = "trackUnmuted";
  ParticipantEvent2["LocalTrackPublished"] = "localTrackPublished";
  ParticipantEvent2["LocalTrackUnpublished"] = "localTrackUnpublished";
  ParticipantEvent2["ParticipantMetadataChanged"] = "participantMetadataChanged";
  ParticipantEvent2["ParticipantNameChanged"] = "participantNameChanged";
  ParticipantEvent2["DataReceived"] = "dataReceived";
  ParticipantEvent2["SipDTMFReceived"] = "sipDTMFReceived";
  ParticipantEvent2["TranscriptionReceived"] = "transcriptionReceived";
  ParticipantEvent2["IsSpeakingChanged"] = "isSpeakingChanged";
  ParticipantEvent2["ConnectionQualityChanged"] = "connectionQualityChanged";
  ParticipantEvent2["TrackStreamStateChanged"] = "trackStreamStateChanged";
  ParticipantEvent2["TrackSubscriptionPermissionChanged"] = "trackSubscriptionPermissionChanged";
  ParticipantEvent2["TrackSubscriptionStatusChanged"] = "trackSubscriptionStatusChanged";
  ParticipantEvent2["MediaDevicesError"] = "mediaDevicesError";
  ParticipantEvent2["AudioStreamAcquired"] = "audioStreamAcquired";
  ParticipantEvent2["ParticipantPermissionsChanged"] = "participantPermissionsChanged";
  ParticipantEvent2["PCTrackAdded"] = "pcTrackAdded";
  ParticipantEvent2["AttributesChanged"] = "attributesChanged";
  ParticipantEvent2["LocalTrackSubscribed"] = "localTrackSubscribed";
  ParticipantEvent2["ChatMessage"] = "chatMessage";
})(ParticipantEvent || (ParticipantEvent = {}));
var EngineEvent;
(function(EngineEvent2) {
  EngineEvent2["TransportsCreated"] = "transportsCreated";
  EngineEvent2["Connected"] = "connected";
  EngineEvent2["Disconnected"] = "disconnected";
  EngineEvent2["Resuming"] = "resuming";
  EngineEvent2["Resumed"] = "resumed";
  EngineEvent2["Restarting"] = "restarting";
  EngineEvent2["Restarted"] = "restarted";
  EngineEvent2["SignalResumed"] = "signalResumed";
  EngineEvent2["SignalRestarted"] = "signalRestarted";
  EngineEvent2["Closing"] = "closing";
  EngineEvent2["MediaTrackAdded"] = "mediaTrackAdded";
  EngineEvent2["ActiveSpeakersUpdate"] = "activeSpeakersUpdate";
  EngineEvent2["DataPacketReceived"] = "dataPacketReceived";
  EngineEvent2["RTPVideoMapUpdate"] = "rtpVideoMapUpdate";
  EngineEvent2["DCBufferStatusChanged"] = "dcBufferStatusChanged";
  EngineEvent2["ParticipantUpdate"] = "participantUpdate";
  EngineEvent2["RoomUpdate"] = "roomUpdate";
  EngineEvent2["SpeakersChanged"] = "speakersChanged";
  EngineEvent2["StreamStateChanged"] = "streamStateChanged";
  EngineEvent2["ConnectionQualityUpdate"] = "connectionQualityUpdate";
  EngineEvent2["SubscriptionError"] = "subscriptionError";
  EngineEvent2["SubscriptionPermissionUpdate"] = "subscriptionPermissionUpdate";
  EngineEvent2["RemoteMute"] = "remoteMute";
  EngineEvent2["SubscribedQualityUpdate"] = "subscribedQualityUpdate";
  EngineEvent2["LocalTrackUnpublished"] = "localTrackUnpublished";
  EngineEvent2["LocalTrackSubscribed"] = "localTrackSubscribed";
  EngineEvent2["Offline"] = "offline";
  EngineEvent2["SignalRequestResponse"] = "signalRequestResponse";
})(EngineEvent || (EngineEvent = {}));
var TrackEvent;
(function(TrackEvent2) {
  TrackEvent2["Message"] = "message";
  TrackEvent2["Muted"] = "muted";
  TrackEvent2["Unmuted"] = "unmuted";
  TrackEvent2["Restarted"] = "restarted";
  TrackEvent2["Ended"] = "ended";
  TrackEvent2["Subscribed"] = "subscribed";
  TrackEvent2["Unsubscribed"] = "unsubscribed";
  TrackEvent2["UpdateSettings"] = "updateSettings";
  TrackEvent2["UpdateSubscription"] = "updateSubscription";
  TrackEvent2["AudioPlaybackStarted"] = "audioPlaybackStarted";
  TrackEvent2["AudioPlaybackFailed"] = "audioPlaybackFailed";
  TrackEvent2["AudioSilenceDetected"] = "audioSilenceDetected";
  TrackEvent2["VisibilityChanged"] = "visibilityChanged";
  TrackEvent2["VideoDimensionsChanged"] = "videoDimensionsChanged";
  TrackEvent2["VideoPlaybackStarted"] = "videoPlaybackStarted";
  TrackEvent2["VideoPlaybackFailed"] = "videoPlaybackFailed";
  TrackEvent2["ElementAttached"] = "elementAttached";
  TrackEvent2["ElementDetached"] = "elementDetached";
  TrackEvent2["UpstreamPaused"] = "upstreamPaused";
  TrackEvent2["UpstreamResumed"] = "upstreamResumed";
  TrackEvent2["SubscriptionPermissionChanged"] = "subscriptionPermissionChanged";
  TrackEvent2["SubscriptionStatusChanged"] = "subscriptionStatusChanged";
  TrackEvent2["SubscriptionFailed"] = "subscriptionFailed";
  TrackEvent2["TrackProcessorUpdate"] = "trackProcessorUpdate";
  TrackEvent2["AudioTrackFeatureUpdate"] = "audioTrackFeatureUpdate";
  TrackEvent2["TranscriptionReceived"] = "transcriptionReceived";
  TrackEvent2["TimeSyncUpdate"] = "timeSyncUpdate";
})(TrackEvent || (TrackEvent = {}));
function cloneDeep(value) {
  if (typeof value === "undefined") {
    return;
  }
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  } else {
    return JSON.parse(JSON.stringify(value));
  }
}
var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
var browserDetails;
function getBrowser(userAgent) {
  let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  if (typeof userAgent === "undefined" && typeof navigator === "undefined") {
    return;
  }
  const ua = (userAgent !== null && userAgent !== void 0 ? userAgent : navigator.userAgent).toLowerCase();
  if (browserDetails === void 0 || force) {
    const browser = browsersList.find((_ref) => {
      let {
        test
      } = _ref;
      return test.test(ua);
    });
    browserDetails = browser === null || browser === void 0 ? void 0 : browser.describe(ua);
  }
  return browserDetails;
}
var browsersList = [
  {
    test: /firefox|iceweasel|fxios/i,
    describe(ua) {
      const browser = {
        name: "Firefox",
        version: getMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua),
        os: ua.toLowerCase().includes("fxios") ? "iOS" : void 0,
        osVersion: getOSVersion(ua)
      };
      return browser;
    }
  },
  {
    test: /chrom|crios|crmo/i,
    describe(ua) {
      const browser = {
        name: "Chrome",
        version: getMatch(/(?:chrome|chromium|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua),
        os: ua.toLowerCase().includes("crios") ? "iOS" : void 0,
        osVersion: getOSVersion(ua)
      };
      return browser;
    }
  },
  /* Safari */
  {
    test: /safari|applewebkit/i,
    describe(ua) {
      const browser = {
        name: "Safari",
        version: getMatch(commonVersionIdentifier, ua),
        os: ua.includes("mobile/") ? "iOS" : "macOS",
        osVersion: getOSVersion(ua)
      };
      return browser;
    }
  }
];
function getMatch(exp, ua) {
  let id = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  const match = ua.match(exp);
  return match && match.length >= id && match[id] || "";
}
function getOSVersion(ua) {
  return ua.includes("mac os") ? getMatch(/\(.+?(\d+_\d+(:?_\d+)?)/, ua, 1).replace(/_/g, ".") : void 0;
}
var version$1 = "2.9.1";
var version = version$1;
var protocolVersion = 15;
var CriticalTimers = class {
};
CriticalTimers.setTimeout = function() {
  return setTimeout(...arguments);
};
CriticalTimers.setInterval = // eslint-disable-next-line @typescript-eslint/no-implied-eval
function() {
  return setInterval(...arguments);
};
CriticalTimers.clearTimeout = function() {
  return clearTimeout(...arguments);
};
CriticalTimers.clearInterval = function() {
  return clearInterval(...arguments);
};
var BACKGROUND_REACTION_DELAY = 5e3;
var recycledElements = [];
var VideoQuality;
(function(VideoQuality2) {
  VideoQuality2[VideoQuality2["LOW"] = 0] = "LOW";
  VideoQuality2[VideoQuality2["MEDIUM"] = 1] = "MEDIUM";
  VideoQuality2[VideoQuality2["HIGH"] = 2] = "HIGH";
})(VideoQuality || (VideoQuality = {}));
var Track = class _Track extends eventsExports.EventEmitter {
  constructor(mediaTrack, kind) {
    let loggerOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var _a;
    super();
    this.attachedElements = [];
    this.isMuted = false;
    this.streamState = _Track.StreamState.Active;
    this.isInBackground = false;
    this._currentBitrate = 0;
    this.log = livekitLogger;
    this.appVisibilityChangedListener = () => {
      if (this.backgroundTimeout) {
        clearTimeout(this.backgroundTimeout);
      }
      if (document.visibilityState === "hidden") {
        this.backgroundTimeout = setTimeout(() => this.handleAppVisibilityChanged(), BACKGROUND_REACTION_DELAY);
      } else {
        this.handleAppVisibilityChanged();
      }
    };
    this.log = getLogger((_a = loggerOptions.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.Track);
    this.loggerContextCb = loggerOptions.loggerContextCb;
    this.setMaxListeners(100);
    this.kind = kind;
    this._mediaStreamTrack = mediaTrack;
    this._mediaStreamID = mediaTrack.id;
    this.source = _Track.Source.Unknown;
  }
  get logContext() {
    var _a;
    return Object.assign(Object.assign({}, (_a = this.loggerContextCb) === null || _a === void 0 ? void 0 : _a.call(this)), getLogContextFromTrack(this));
  }
  /** current receive bits per second */
  get currentBitrate() {
    return this._currentBitrate;
  }
  get mediaStreamTrack() {
    return this._mediaStreamTrack;
  }
  /**
   * @internal
   * used for keep mediaStream's first id, since it's id might change
   * if we disable/enable a track
   */
  get mediaStreamID() {
    return this._mediaStreamID;
  }
  attach(element) {
    let elementType = "audio";
    if (this.kind === _Track.Kind.Video) {
      elementType = "video";
    }
    if (this.attachedElements.length === 0 && this.kind === _Track.Kind.Video) {
      this.addAppVisibilityListener();
    }
    if (!element) {
      if (elementType === "audio") {
        recycledElements.forEach((e2) => {
          if (e2.parentElement === null && !element) {
            element = e2;
          }
        });
        if (element) {
          recycledElements.splice(recycledElements.indexOf(element), 1);
        }
      }
      if (!element) {
        element = document.createElement(elementType);
      }
    }
    if (!this.attachedElements.includes(element)) {
      this.attachedElements.push(element);
    }
    attachToElement(this.mediaStreamTrack, element);
    const allMediaStreamTracks = element.srcObject.getTracks();
    const hasAudio = allMediaStreamTracks.some((tr) => tr.kind === "audio");
    element.play().then(() => {
      this.emit(hasAudio ? TrackEvent.AudioPlaybackStarted : TrackEvent.VideoPlaybackStarted);
    }).catch((e2) => {
      if (e2.name === "NotAllowedError") {
        this.emit(hasAudio ? TrackEvent.AudioPlaybackFailed : TrackEvent.VideoPlaybackFailed, e2);
      } else if (e2.name === "AbortError") {
        livekitLogger.debug("".concat(hasAudio ? "audio" : "video", " playback aborted, likely due to new play request"));
      } else {
        livekitLogger.warn("could not playback ".concat(hasAudio ? "audio" : "video"), e2);
      }
      if (hasAudio && element && allMediaStreamTracks.some((tr) => tr.kind === "video") && e2.name === "NotAllowedError") {
        element.muted = true;
        element.play().catch(() => {
        });
      }
    });
    this.emit(TrackEvent.ElementAttached, element);
    return element;
  }
  detach(element) {
    try {
      if (element) {
        detachTrack(this.mediaStreamTrack, element);
        const idx = this.attachedElements.indexOf(element);
        if (idx >= 0) {
          this.attachedElements.splice(idx, 1);
          this.recycleElement(element);
          this.emit(TrackEvent.ElementDetached, element);
        }
        return element;
      }
      const detached = [];
      this.attachedElements.forEach((elm) => {
        detachTrack(this.mediaStreamTrack, elm);
        detached.push(elm);
        this.recycleElement(elm);
        this.emit(TrackEvent.ElementDetached, elm);
      });
      this.attachedElements = [];
      return detached;
    } finally {
      if (this.attachedElements.length === 0) {
        this.removeAppVisibilityListener();
      }
    }
  }
  stop() {
    this.stopMonitor();
    this._mediaStreamTrack.stop();
  }
  enable() {
    this._mediaStreamTrack.enabled = true;
  }
  disable() {
    this._mediaStreamTrack.enabled = false;
  }
  /* @internal */
  stopMonitor() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    if (this.timeSyncHandle) {
      cancelAnimationFrame(this.timeSyncHandle);
    }
  }
  /** @internal */
  updateLoggerOptions(loggerOptions) {
    if (loggerOptions.loggerName) {
      this.log = getLogger(loggerOptions.loggerName);
    }
    if (loggerOptions.loggerContextCb) {
      this.loggerContextCb = loggerOptions.loggerContextCb;
    }
  }
  recycleElement(element) {
    if (element instanceof HTMLAudioElement) {
      let shouldCache = true;
      element.pause();
      recycledElements.forEach((e2) => {
        if (!e2.parentElement) {
          shouldCache = false;
        }
      });
      if (shouldCache) {
        recycledElements.push(element);
      }
    }
  }
  handleAppVisibilityChanged() {
    return __awaiter(this, void 0, void 0, function* () {
      this.isInBackground = document.visibilityState === "hidden";
      if (!this.isInBackground && this.kind === _Track.Kind.Video) {
        setTimeout(() => this.attachedElements.forEach((el) => el.play().catch(() => {
        })), 0);
      }
    });
  }
  addAppVisibilityListener() {
    if (isWeb()) {
      this.isInBackground = document.visibilityState === "hidden";
      document.addEventListener("visibilitychange", this.appVisibilityChangedListener);
    } else {
      this.isInBackground = false;
    }
  }
  removeAppVisibilityListener() {
    if (isWeb()) {
      document.removeEventListener("visibilitychange", this.appVisibilityChangedListener);
    }
  }
};
function attachToElement(track, element) {
  let mediaStream;
  if (element.srcObject instanceof MediaStream) {
    mediaStream = element.srcObject;
  } else {
    mediaStream = new MediaStream();
  }
  let existingTracks;
  if (track.kind === "audio") {
    existingTracks = mediaStream.getAudioTracks();
  } else {
    existingTracks = mediaStream.getVideoTracks();
  }
  if (!existingTracks.includes(track)) {
    existingTracks.forEach((et) => {
      mediaStream.removeTrack(et);
    });
    mediaStream.addTrack(track);
  }
  if (!isSafari() || !(element instanceof HTMLVideoElement)) {
    element.autoplay = true;
  }
  element.muted = mediaStream.getAudioTracks().length === 0;
  if (element instanceof HTMLVideoElement) {
    element.playsInline = true;
  }
  if (element.srcObject !== mediaStream) {
    element.srcObject = mediaStream;
    if ((isSafari() || isFireFox()) && element instanceof HTMLVideoElement) {
      setTimeout(() => {
        element.srcObject = mediaStream;
        element.play().catch(() => {
        });
      }, 0);
    }
  }
}
function detachTrack(track, element) {
  if (element.srcObject instanceof MediaStream) {
    const mediaStream = element.srcObject;
    mediaStream.removeTrack(track);
    if (mediaStream.getTracks().length > 0) {
      element.srcObject = mediaStream;
    } else {
      element.srcObject = null;
    }
  }
}
(function(Track2) {
  let Kind;
  (function(Kind2) {
    Kind2["Audio"] = "audio";
    Kind2["Video"] = "video";
    Kind2["Unknown"] = "unknown";
  })(Kind = Track2.Kind || (Track2.Kind = {}));
  let Source;
  (function(Source2) {
    Source2["Camera"] = "camera";
    Source2["Microphone"] = "microphone";
    Source2["ScreenShare"] = "screen_share";
    Source2["ScreenShareAudio"] = "screen_share_audio";
    Source2["Unknown"] = "unknown";
  })(Source = Track2.Source || (Track2.Source = {}));
  let StreamState$1;
  (function(StreamState2) {
    StreamState2["Active"] = "active";
    StreamState2["Paused"] = "paused";
    StreamState2["Unknown"] = "unknown";
  })(StreamState$1 = Track2.StreamState || (Track2.StreamState = {}));
  function kindToProto(k) {
    switch (k) {
      case Kind.Audio:
        return TrackType.AUDIO;
      case Kind.Video:
        return TrackType.VIDEO;
      default:
        return TrackType.DATA;
    }
  }
  Track2.kindToProto = kindToProto;
  function kindFromProto(t) {
    switch (t) {
      case TrackType.AUDIO:
        return Kind.Audio;
      case TrackType.VIDEO:
        return Kind.Video;
      default:
        return Kind.Unknown;
    }
  }
  Track2.kindFromProto = kindFromProto;
  function sourceToProto(s) {
    switch (s) {
      case Source.Camera:
        return TrackSource.CAMERA;
      case Source.Microphone:
        return TrackSource.MICROPHONE;
      case Source.ScreenShare:
        return TrackSource.SCREEN_SHARE;
      case Source.ScreenShareAudio:
        return TrackSource.SCREEN_SHARE_AUDIO;
      default:
        return TrackSource.UNKNOWN;
    }
  }
  Track2.sourceToProto = sourceToProto;
  function sourceFromProto(s) {
    switch (s) {
      case TrackSource.CAMERA:
        return Source.Camera;
      case TrackSource.MICROPHONE:
        return Source.Microphone;
      case TrackSource.SCREEN_SHARE:
        return Source.ScreenShare;
      case TrackSource.SCREEN_SHARE_AUDIO:
        return Source.ScreenShareAudio;
      default:
        return Source.Unknown;
    }
  }
  Track2.sourceFromProto = sourceFromProto;
  function streamStateFromProto(s) {
    switch (s) {
      case StreamState.ACTIVE:
        return StreamState$1.Active;
      case StreamState.PAUSED:
        return StreamState$1.Paused;
      default:
        return StreamState$1.Unknown;
    }
  }
  Track2.streamStateFromProto = streamStateFromProto;
})(Track);
var VideoPreset = class {
  constructor(widthOrOptions, height, maxBitrate, maxFramerate, priority) {
    if (typeof widthOrOptions === "object") {
      this.width = widthOrOptions.width;
      this.height = widthOrOptions.height;
      this.aspectRatio = widthOrOptions.aspectRatio;
      this.encoding = {
        maxBitrate: widthOrOptions.maxBitrate,
        maxFramerate: widthOrOptions.maxFramerate,
        priority: widthOrOptions.priority
      };
    } else if (height !== void 0 && maxBitrate !== void 0) {
      this.width = widthOrOptions;
      this.height = height;
      this.aspectRatio = widthOrOptions / height;
      this.encoding = {
        maxBitrate,
        maxFramerate,
        priority
      };
    } else {
      throw new TypeError("Unsupported options: provide at least width, height and maxBitrate");
    }
  }
  get resolution() {
    return {
      width: this.width,
      height: this.height,
      frameRate: this.encoding.maxFramerate,
      aspectRatio: this.aspectRatio
    };
  }
};
var backupCodecs = ["vp8", "h264"];
var videoCodecs = ["vp8", "h264", "vp9", "av1"];
function isBackupCodec(codec) {
  return !!backupCodecs.find((backup) => backup === codec);
}
var BackupCodecPolicy;
(function(BackupCodecPolicy2) {
  BackupCodecPolicy2[BackupCodecPolicy2["REGRESSION"] = 0] = "REGRESSION";
  BackupCodecPolicy2[BackupCodecPolicy2["SIMULCAST"] = 1] = "SIMULCAST";
})(BackupCodecPolicy || (BackupCodecPolicy = {}));
var AudioPresets;
(function(AudioPresets2) {
  AudioPresets2.telephone = {
    maxBitrate: 12e3
  };
  AudioPresets2.speech = {
    maxBitrate: 24e3
  };
  AudioPresets2.music = {
    maxBitrate: 48e3
  };
  AudioPresets2.musicStereo = {
    maxBitrate: 64e3
  };
  AudioPresets2.musicHighQuality = {
    maxBitrate: 96e3
  };
  AudioPresets2.musicHighQualityStereo = {
    maxBitrate: 128e3
  };
})(AudioPresets || (AudioPresets = {}));
var VideoPresets = {
  h90: new VideoPreset(160, 90, 9e4, 20),
  h180: new VideoPreset(320, 180, 16e4, 20),
  h216: new VideoPreset(384, 216, 18e4, 20),
  h360: new VideoPreset(640, 360, 45e4, 20),
  h540: new VideoPreset(960, 540, 8e5, 25),
  h720: new VideoPreset(1280, 720, 17e5, 30),
  h1080: new VideoPreset(1920, 1080, 3e6, 30),
  h1440: new VideoPreset(2560, 1440, 5e6, 30),
  h2160: new VideoPreset(3840, 2160, 8e6, 30)
};
var VideoPresets43 = {
  h120: new VideoPreset(160, 120, 7e4, 20),
  h180: new VideoPreset(240, 180, 125e3, 20),
  h240: new VideoPreset(320, 240, 14e4, 20),
  h360: new VideoPreset(480, 360, 33e4, 20),
  h480: new VideoPreset(640, 480, 5e5, 20),
  h540: new VideoPreset(720, 540, 6e5, 25),
  h720: new VideoPreset(960, 720, 13e5, 30),
  h1080: new VideoPreset(1440, 1080, 23e5, 30),
  h1440: new VideoPreset(1920, 1440, 38e5, 30)
};
var ScreenSharePresets = {
  h360fps3: new VideoPreset(640, 360, 2e5, 3, "medium"),
  h360fps15: new VideoPreset(640, 360, 4e5, 15, "medium"),
  h720fps5: new VideoPreset(1280, 720, 8e5, 5, "medium"),
  h720fps15: new VideoPreset(1280, 720, 15e5, 15, "medium"),
  h720fps30: new VideoPreset(1280, 720, 2e6, 30, "medium"),
  h1080fps15: new VideoPreset(1920, 1080, 25e5, 15, "medium"),
  h1080fps30: new VideoPreset(1920, 1080, 5e6, 30, "medium"),
  // original resolution, without resizing
  original: new VideoPreset(0, 0, 7e6, 30, "medium")
};
var separator = "|";
var ddExtensionURI = "https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension";
function unpackStreamId(packed) {
  const parts = packed.split(separator);
  if (parts.length > 1) {
    return [parts[0], packed.substr(parts[0].length + 1)];
  }
  return [packed, ""];
}
function sleep(duration) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve) => CriticalTimers.setTimeout(resolve, duration));
  });
}
function supportsTransceiver() {
  return "addTransceiver" in RTCPeerConnection.prototype;
}
function supportsAddTrack() {
  return "addTrack" in RTCPeerConnection.prototype;
}
function supportsAdaptiveStream() {
  return typeof ResizeObserver !== void 0 && typeof IntersectionObserver !== void 0;
}
function supportsDynacast() {
  return supportsTransceiver();
}
function supportsAV1() {
  if (!("getCapabilities" in RTCRtpSender)) {
    return false;
  }
  if (isSafari()) {
    return false;
  }
  const capabilities = RTCRtpSender.getCapabilities("video");
  let hasAV1 = false;
  if (capabilities) {
    for (const codec of capabilities.codecs) {
      if (codec.mimeType === "video/AV1") {
        hasAV1 = true;
        break;
      }
    }
  }
  return hasAV1;
}
function supportsVP9() {
  if (!("getCapabilities" in RTCRtpSender)) {
    return false;
  }
  if (isFireFox()) {
    return false;
  }
  if (isSafari()) {
    const browser = getBrowser();
    if ((browser === null || browser === void 0 ? void 0 : browser.version) && compareVersions(browser.version, "16") < 0) {
      return false;
    }
  }
  const capabilities = RTCRtpSender.getCapabilities("video");
  let hasVP9 = false;
  if (capabilities) {
    for (const codec of capabilities.codecs) {
      if (codec.mimeType === "video/VP9") {
        hasVP9 = true;
        break;
      }
    }
  }
  return hasVP9;
}
function isSVCCodec(codec) {
  return codec === "av1" || codec === "vp9";
}
function supportsSetSinkId(elm) {
  if (!document) {
    return false;
  }
  if (!elm) {
    elm = document.createElement("audio");
  }
  return "setSinkId" in elm;
}
function isBrowserSupported() {
  if (typeof RTCPeerConnection === "undefined") {
    return false;
  }
  return supportsTransceiver() || supportsAddTrack();
}
function isFireFox() {
  var _a;
  return ((_a = getBrowser()) === null || _a === void 0 ? void 0 : _a.name) === "Firefox";
}
function isSafari() {
  var _a;
  return ((_a = getBrowser()) === null || _a === void 0 ? void 0 : _a.name) === "Safari";
}
function isSafari17() {
  const b = getBrowser();
  return (b === null || b === void 0 ? void 0 : b.name) === "Safari" && b.version.startsWith("17.");
}
function isMobile() {
  var _a, _b;
  if (!isWeb())
    return false;
  return (
    // @ts-expect-error `userAgentData` is not yet part of typescript
    (_b = (_a = navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.mobile) !== null && _b !== void 0 ? _b : /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent)
  );
}
function isE2EESimulcastSupported() {
  const browser = getBrowser();
  const supportedSafariVersion = "17.2";
  if (browser) {
    if (browser.name !== "Safari" && browser.os !== "iOS") {
      return true;
    } else if (browser.os === "iOS" && browser.osVersion && compareVersions(supportedSafariVersion, browser.osVersion) >= 0) {
      return true;
    } else if (browser.name === "Safari" && compareVersions(supportedSafariVersion, browser.version) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}
function isWeb() {
  return typeof document !== "undefined";
}
function isReactNative() {
  return navigator.product == "ReactNative";
}
function isCloud(serverUrl) {
  return serverUrl.hostname.endsWith(".livekit.cloud") || serverUrl.hostname.endsWith(".livekit.run");
}
function getLKReactNativeInfo() {
  if (global && global.LiveKitReactNativeGlobal) {
    return global.LiveKitReactNativeGlobal;
  }
  return void 0;
}
function getReactNativeOs() {
  if (!isReactNative()) {
    return void 0;
  }
  let info = getLKReactNativeInfo();
  if (info) {
    return info.platform;
  }
  return void 0;
}
function getDevicePixelRatio() {
  if (isWeb()) {
    return window.devicePixelRatio;
  }
  if (isReactNative()) {
    let info = getLKReactNativeInfo();
    if (info) {
      return info.devicePixelRatio;
    }
  }
  return 1;
}
function compareVersions(v1, v2) {
  const parts1 = v1.split(".");
  const parts2 = v2.split(".");
  const k = Math.min(parts1.length, parts2.length);
  for (let i = 0; i < k; ++i) {
    const p1 = parseInt(parts1[i], 10);
    const p2 = parseInt(parts2[i], 10);
    if (p1 > p2)
      return 1;
    if (p1 < p2)
      return -1;
    if (i === k - 1 && p1 === p2)
      return 0;
  }
  if (v1 === "" && v2 !== "") {
    return -1;
  } else if (v2 === "") {
    return 1;
  }
  return parts1.length == parts2.length ? 0 : parts1.length < parts2.length ? -1 : 1;
}
function roDispatchCallback(entries) {
  for (const entry of entries) {
    entry.target.handleResize(entry);
  }
}
function ioDispatchCallback(entries) {
  for (const entry of entries) {
    entry.target.handleVisibilityChanged(entry);
  }
}
var resizeObserver = null;
var getResizeObserver = () => {
  if (!resizeObserver)
    resizeObserver = new ResizeObserver(roDispatchCallback);
  return resizeObserver;
};
var intersectionObserver = null;
var getIntersectionObserver = () => {
  if (!intersectionObserver) {
    intersectionObserver = new IntersectionObserver(ioDispatchCallback, {
      root: null,
      rootMargin: "0px"
    });
  }
  return intersectionObserver;
};
function getClientInfo() {
  var _a;
  const info = new ClientInfo({
    sdk: ClientInfo_SDK.JS,
    protocol: protocolVersion,
    version
  });
  if (isReactNative()) {
    info.os = (_a = getReactNativeOs()) !== null && _a !== void 0 ? _a : "";
  }
  return info;
}
var emptyVideoStreamTrack;
function getEmptyVideoStreamTrack() {
  if (!emptyVideoStreamTrack) {
    emptyVideoStreamTrack = createDummyVideoStreamTrack();
  }
  return emptyVideoStreamTrack.clone();
}
function createDummyVideoStreamTrack() {
  let width = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 16;
  let height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 16;
  let enabled = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  let paintContent = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (paintContent && ctx) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "grey";
    ctx.fill();
  }
  const dummyStream = canvas.captureStream();
  const [dummyTrack] = dummyStream.getTracks();
  if (!dummyTrack) {
    throw Error("Could not get empty media stream video track");
  }
  dummyTrack.enabled = enabled;
  return dummyTrack;
}
var emptyAudioStreamTrack;
function getEmptyAudioStreamTrack() {
  if (!emptyAudioStreamTrack) {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, 0);
    const dst = ctx.createMediaStreamDestination();
    oscillator.connect(gain);
    gain.connect(dst);
    oscillator.start();
    [emptyAudioStreamTrack] = dst.stream.getAudioTracks();
    if (!emptyAudioStreamTrack) {
      throw Error("Could not get empty media stream audio track");
    }
    emptyAudioStreamTrack.enabled = false;
  }
  return emptyAudioStreamTrack.clone();
}
var Future = class {
  constructor(futureBase, onFinally) {
    this.onFinally = onFinally;
    this.promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
      this.resolve = resolve;
      this.reject = reject;
      if (futureBase) {
        yield futureBase(resolve, reject);
      }
    })).finally(() => {
      var _a;
      return (_a = this.onFinally) === null || _a === void 0 ? void 0 : _a.call(this);
    });
  }
};
function createAudioAnalyser(track, options) {
  const opts = Object.assign({
    cloneTrack: false,
    fftSize: 2048,
    smoothingTimeConstant: 0.8,
    minDecibels: -100,
    maxDecibels: -80
  }, options);
  const audioContext = getNewAudioContext();
  if (!audioContext) {
    throw new Error("Audio Context not supported on this browser");
  }
  const streamTrack = opts.cloneTrack ? track.mediaStreamTrack.clone() : track.mediaStreamTrack;
  const mediaStreamSource = audioContext.createMediaStreamSource(new MediaStream([streamTrack]));
  const analyser = audioContext.createAnalyser();
  analyser.minDecibels = opts.minDecibels;
  analyser.maxDecibels = opts.maxDecibels;
  analyser.fftSize = opts.fftSize;
  analyser.smoothingTimeConstant = opts.smoothingTimeConstant;
  mediaStreamSource.connect(analyser);
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  const calculateVolume = () => {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (const amplitude of dataArray) {
      sum += Math.pow(amplitude / 255, 2);
    }
    const volume = Math.sqrt(sum / dataArray.length);
    return volume;
  };
  const cleanup = () => __awaiter(this, void 0, void 0, function* () {
    yield audioContext.close();
    if (opts.cloneTrack) {
      streamTrack.stop();
    }
  });
  return {
    calculateVolume,
    analyser,
    cleanup
  };
}
function isVideoCodec(maybeCodec) {
  return videoCodecs.includes(maybeCodec);
}
function unwrapConstraint(constraint) {
  if (typeof constraint === "string" || typeof constraint === "number") {
    return constraint;
  }
  if (Array.isArray(constraint)) {
    return constraint[0];
  }
  if (constraint.exact) {
    if (Array.isArray(constraint.exact)) {
      return constraint.exact[0];
    }
    return constraint.exact;
  }
  if (constraint.ideal) {
    if (Array.isArray(constraint.ideal)) {
      return constraint.ideal[0];
    }
    return constraint.ideal;
  }
  throw Error("could not unwrap constraint");
}
function toWebsocketUrl(url) {
  if (url.startsWith("http")) {
    return url.replace(/^(http)/, "ws");
  }
  return url;
}
function toHttpUrl(url) {
  if (url.startsWith("ws")) {
    return url.replace(/^(ws)/, "http");
  }
  return url;
}
function extractTranscriptionSegments(transcription, firstReceivedTimesMap) {
  return transcription.segments.map((_ref) => {
    let {
      id,
      text,
      language,
      startTime,
      endTime,
      final
    } = _ref;
    var _a;
    const firstReceivedTime = (_a = firstReceivedTimesMap.get(id)) !== null && _a !== void 0 ? _a : Date.now();
    const lastReceivedTime = Date.now();
    if (final) {
      firstReceivedTimesMap.delete(id);
    } else {
      firstReceivedTimesMap.set(id, firstReceivedTime);
    }
    return {
      id,
      text,
      startTime: Number.parseInt(startTime.toString()),
      endTime: Number.parseInt(endTime.toString()),
      final,
      language,
      firstReceivedTime,
      lastReceivedTime
    };
  });
}
function extractChatMessage(msg) {
  const {
    id,
    timestamp,
    message,
    editTimestamp
  } = msg;
  return {
    id,
    timestamp: Number.parseInt(timestamp.toString()),
    editTimestamp: editTimestamp ? Number.parseInt(editTimestamp.toString()) : void 0,
    message
  };
}
function getDisconnectReasonFromConnectionError(e2) {
  switch (e2.reason) {
    case ConnectionErrorReason.LeaveRequest:
      return e2.context;
    case ConnectionErrorReason.Cancelled:
      return DisconnectReason.CLIENT_INITIATED;
    case ConnectionErrorReason.NotAllowed:
      return DisconnectReason.USER_REJECTED;
    case ConnectionErrorReason.ServerUnreachable:
      return DisconnectReason.JOIN_FAILURE;
    default:
      return DisconnectReason.UNKNOWN_REASON;
  }
}
function bigIntToNumber(value) {
  return value !== void 0 ? Number(value) : void 0;
}
function numberToBigInt(value) {
  return value !== void 0 ? BigInt(value) : void 0;
}
function isLocalTrack(track) {
  return !!track && !(track instanceof MediaStreamTrack) && track.isLocal;
}
function isAudioTrack(track) {
  return !!track && track.kind == Track.Kind.Audio;
}
function isVideoTrack(track) {
  return !!track && track.kind == Track.Kind.Video;
}
function isLocalVideoTrack(track) {
  return isLocalTrack(track) && isVideoTrack(track);
}
function isLocalAudioTrack(track) {
  return isLocalTrack(track) && isAudioTrack(track);
}
function isRemoteTrack(track) {
  return !!track && !track.isLocal;
}
function isRemotePub(pub) {
  return !!pub && !pub.isLocal;
}
function isRemoteVideoTrack(track) {
  return isRemoteTrack(track) && isVideoTrack(track);
}
function isLocalParticipant(p) {
  return p.isLocal;
}
function isRemoteParticipant(p) {
  return !p.isLocal;
}
function mergeDefaultOptions(options, audioDefaults2, videoDefaults2) {
  var _a, _b, _c;
  var _d, _e;
  const {
    optionsWithoutProcessor,
    audioProcessor,
    videoProcessor
  } = extractProcessorsFromOptions(options !== null && options !== void 0 ? options : {});
  const clonedOptions = (_a = cloneDeep(optionsWithoutProcessor)) !== null && _a !== void 0 ? _a : {};
  if (clonedOptions.audio === true)
    clonedOptions.audio = {};
  if (clonedOptions.video === true)
    clonedOptions.video = {};
  if (clonedOptions.audio) {
    mergeObjectWithoutOverwriting(clonedOptions.audio, audioDefaults2);
    (_b = (_d = clonedOptions.audio).deviceId) !== null && _b !== void 0 ? _b : _d.deviceId = "default";
    if (audioProcessor) {
      clonedOptions.audio.processor = audioProcessor;
    }
  }
  if (clonedOptions.video) {
    mergeObjectWithoutOverwriting(clonedOptions.video, videoDefaults2);
    (_c = (_e = clonedOptions.video).deviceId) !== null && _c !== void 0 ? _c : _e.deviceId = "default";
    if (videoProcessor) {
      clonedOptions.video.processor = videoProcessor;
    }
  }
  return clonedOptions;
}
function mergeObjectWithoutOverwriting(mainObject, objectToMerge) {
  Object.keys(objectToMerge).forEach((key) => {
    if (mainObject[key] === void 0)
      mainObject[key] = objectToMerge[key];
  });
  return mainObject;
}
function constraintsForOptions(options) {
  var _a, _b;
  var _c, _d;
  const constraints = {};
  if (options.video) {
    if (typeof options.video === "object") {
      const videoOptions = {};
      const target = videoOptions;
      const source = options.video;
      Object.keys(source).forEach((key) => {
        switch (key) {
          case "resolution":
            mergeObjectWithoutOverwriting(target, source.resolution);
            break;
          default:
            target[key] = source[key];
        }
      });
      constraints.video = videoOptions;
      (_a = (_c = constraints.video).deviceId) !== null && _a !== void 0 ? _a : _c.deviceId = "default";
    } else {
      constraints.video = options.video ? {
        deviceId: "default"
      } : false;
    }
  } else {
    constraints.video = false;
  }
  if (options.audio) {
    if (typeof options.audio === "object") {
      constraints.audio = options.audio;
      (_b = (_d = constraints.audio).deviceId) !== null && _b !== void 0 ? _b : _d.deviceId = "default";
    } else {
      constraints.audio = {
        deviceId: "default"
      };
    }
  } else {
    constraints.audio = false;
  }
  return constraints;
}
function detectSilence(track_1) {
  return __awaiter(this, arguments, void 0, function(track) {
    let timeOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 200;
    return function* () {
      const ctx = getNewAudioContext();
      if (ctx) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const source = ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
        source.connect(analyser);
        yield sleep(timeOffset);
        analyser.getByteTimeDomainData(dataArray);
        const someNoise = dataArray.some((sample) => sample !== 128 && sample !== 0);
        ctx.close();
        return !someNoise;
      }
      return false;
    }();
  });
}
function getNewAudioContext() {
  const AudioContext2 = (
    // @ts-ignore
    typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)
  );
  if (AudioContext2) {
    return new AudioContext2({
      latencyHint: "interactive"
    });
  }
}
function sourceToKind(source) {
  if (source === Track.Source.Microphone) {
    return "audioinput";
  } else if (source === Track.Source.Camera) {
    return "videoinput";
  } else {
    return void 0;
  }
}
function screenCaptureToDisplayMediaStreamOptions(options) {
  var _a, _b;
  let videoConstraints = (_a = options.video) !== null && _a !== void 0 ? _a : true;
  if (options.resolution && options.resolution.width > 0 && options.resolution.height > 0) {
    videoConstraints = typeof videoConstraints === "boolean" ? {} : videoConstraints;
    if (isSafari()) {
      videoConstraints = Object.assign(Object.assign({}, videoConstraints), {
        width: {
          max: options.resolution.width
        },
        height: {
          max: options.resolution.height
        },
        frameRate: options.resolution.frameRate
      });
    } else {
      videoConstraints = Object.assign(Object.assign({}, videoConstraints), {
        width: {
          ideal: options.resolution.width
        },
        height: {
          ideal: options.resolution.height
        },
        frameRate: options.resolution.frameRate
      });
    }
  }
  return {
    audio: (_b = options.audio) !== null && _b !== void 0 ? _b : false,
    video: videoConstraints,
    // @ts-expect-error support for experimental display media features
    controller: options.controller,
    selfBrowserSurface: options.selfBrowserSurface,
    surfaceSwitching: options.surfaceSwitching,
    systemAudio: options.systemAudio,
    preferCurrentTab: options.preferCurrentTab
  };
}
function mimeTypeToVideoCodecString(mimeType) {
  return mimeType.split("/")[1].toLowerCase();
}
function getTrackPublicationInfo(tracks) {
  const infos = [];
  tracks.forEach((track) => {
    if (track.track !== void 0) {
      infos.push(new TrackPublishedResponse({
        cid: track.track.mediaStreamID,
        track: track.trackInfo
      }));
    }
  });
  return infos;
}
function getLogContextFromTrack(track) {
  if ("mediaStreamTrack" in track) {
    return {
      trackID: track.sid,
      source: track.source,
      muted: track.isMuted,
      enabled: track.mediaStreamTrack.enabled,
      kind: track.kind,
      streamID: track.mediaStreamID,
      streamTrackID: track.mediaStreamTrack.id
    };
  } else {
    return {
      trackID: track.trackSid,
      enabled: track.isEnabled,
      muted: track.isMuted,
      trackInfo: Object.assign({
        mimeType: track.mimeType,
        name: track.trackName,
        encrypted: track.isEncrypted,
        kind: track.kind,
        source: track.source
      }, track.track ? getLogContextFromTrack(track.track) : {})
    };
  }
}
function supportsSynchronizationSources() {
  return typeof RTCRtpReceiver !== "undefined" && "getSynchronizationSources" in RTCRtpReceiver;
}
function diffAttributes(oldValues, newValues) {
  var _a;
  if (oldValues === void 0) {
    oldValues = {};
  }
  if (newValues === void 0) {
    newValues = {};
  }
  const allKeys = [...Object.keys(newValues), ...Object.keys(oldValues)];
  const diff = {};
  for (const key of allKeys) {
    if (oldValues[key] !== newValues[key]) {
      diff[key] = (_a = newValues[key]) !== null && _a !== void 0 ? _a : "";
    }
  }
  return diff;
}
function extractProcessorsFromOptions(options) {
  const newOptions = Object.assign({}, options);
  let audioProcessor;
  let videoProcessor;
  if (typeof newOptions.audio === "object" && newOptions.audio.processor) {
    audioProcessor = newOptions.audio.processor;
    newOptions.audio = Object.assign(Object.assign({}, newOptions.audio), {
      processor: void 0
    });
  }
  if (typeof newOptions.video === "object" && newOptions.video.processor) {
    videoProcessor = newOptions.video.processor;
    newOptions.video = Object.assign(Object.assign({}, newOptions.video), {
      processor: void 0
    });
  }
  return {
    audioProcessor,
    videoProcessor,
    optionsWithoutProcessor: newOptions
  };
}
var E2EEManager = class extends eventsExports.EventEmitter {
  constructor(options) {
    super();
    this.onWorkerMessage = (ev) => {
      var _a, _b;
      const {
        kind,
        data
      } = ev.data;
      switch (kind) {
        case "error":
          livekitLogger.error(data.error.message);
          this.emit(EncryptionEvent.EncryptionError, data.error);
          break;
        case "initAck":
          if (data.enabled) {
            this.keyProvider.getKeys().forEach((keyInfo) => {
              this.postKey(keyInfo);
            });
          }
          break;
        case "enable":
          if (data.enabled) {
            this.keyProvider.getKeys().forEach((keyInfo) => {
              this.postKey(keyInfo);
            });
          }
          if (this.encryptionEnabled !== data.enabled && data.participantIdentity === ((_a = this.room) === null || _a === void 0 ? void 0 : _a.localParticipant.identity)) {
            this.emit(EncryptionEvent.ParticipantEncryptionStatusChanged, data.enabled, this.room.localParticipant);
            this.encryptionEnabled = data.enabled;
          } else if (data.participantIdentity) {
            const participant = (_b = this.room) === null || _b === void 0 ? void 0 : _b.getParticipantByIdentity(data.participantIdentity);
            if (!participant) {
              throw TypeError("couldn't set encryption status, participant not found".concat(data.participantIdentity));
            }
            this.emit(EncryptionEvent.ParticipantEncryptionStatusChanged, data.enabled, participant);
          }
          break;
        case "ratchetKey":
          this.keyProvider.emit(KeyProviderEvent.KeyRatcheted, data.material, data.keyIndex);
          break;
      }
    };
    this.onWorkerError = (ev) => {
      livekitLogger.error("e2ee worker encountered an error:", {
        error: ev.error
      });
      this.emit(EncryptionEvent.EncryptionError, ev.error);
    };
    this.keyProvider = options.keyProvider;
    this.worker = options.worker;
    this.encryptionEnabled = false;
  }
  /**
   * @internal
   */
  setup(room) {
    if (!isE2EESupported()) {
      throw new DeviceUnsupportedError("tried to setup end-to-end encryption on an unsupported browser");
    }
    livekitLogger.info("setting up e2ee");
    if (room !== this.room) {
      this.room = room;
      this.setupEventListeners(room, this.keyProvider);
      const msg = {
        kind: "init",
        data: {
          keyProviderOptions: this.keyProvider.getOptions(),
          loglevel: workerLogger.getLevel()
        }
      };
      if (this.worker) {
        livekitLogger.info("initializing worker", {
          worker: this.worker
        });
        this.worker.onmessage = this.onWorkerMessage;
        this.worker.onerror = this.onWorkerError;
        this.worker.postMessage(msg);
      }
    }
  }
  /**
   * @internal
   */
  setParticipantCryptorEnabled(enabled, participantIdentity) {
    livekitLogger.debug("set e2ee to ".concat(enabled, " for participant ").concat(participantIdentity));
    this.postEnable(enabled, participantIdentity);
  }
  /**
   * @internal
   */
  setSifTrailer(trailer) {
    if (!trailer || trailer.length === 0) {
      livekitLogger.warn("ignoring server sent trailer as it's empty");
    } else {
      this.postSifTrailer(trailer);
    }
  }
  setupEngine(engine) {
    engine.on(EngineEvent.RTPVideoMapUpdate, (rtpMap) => {
      this.postRTPMap(rtpMap);
    });
  }
  setupEventListeners(room, keyProvider) {
    room.on(RoomEvent.TrackPublished, (pub, participant) => this.setParticipantCryptorEnabled(pub.trackInfo.encryption !== Encryption_Type.NONE, participant.identity));
    room.on(RoomEvent.ConnectionStateChanged, (state) => {
      if (state === ConnectionState.Connected) {
        room.remoteParticipants.forEach((participant) => {
          participant.trackPublications.forEach((pub) => {
            this.setParticipantCryptorEnabled(pub.trackInfo.encryption !== Encryption_Type.NONE, participant.identity);
          });
        });
      }
    }).on(RoomEvent.TrackUnsubscribed, (track, _2, participant) => {
      var _a;
      const msg = {
        kind: "removeTransform",
        data: {
          participantIdentity: participant.identity,
          trackId: track.mediaStreamID
        }
      };
      (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage(msg);
    }).on(RoomEvent.TrackSubscribed, (track, pub, participant) => {
      this.setupE2EEReceiver(track, participant.identity, pub.trackInfo);
    }).on(RoomEvent.SignalConnected, () => {
      if (!this.room) {
        throw new TypeError("expected room to be present on signal connect");
      }
      keyProvider.getKeys().forEach((keyInfo) => {
        this.postKey(keyInfo);
      });
      this.setParticipantCryptorEnabled(this.room.localParticipant.isE2EEEnabled, this.room.localParticipant.identity);
    });
    room.localParticipant.on(ParticipantEvent.LocalTrackPublished, (publication) => __awaiter(this, void 0, void 0, function* () {
      this.setupE2EESender(publication.track, publication.track.sender);
    }));
    keyProvider.on(KeyProviderEvent.SetKey, (keyInfo) => this.postKey(keyInfo)).on(KeyProviderEvent.RatchetRequest, (participantId, keyIndex) => this.postRatchetRequest(participantId, keyIndex));
  }
  postRatchetRequest(participantIdentity, keyIndex) {
    if (!this.worker) {
      throw Error("could not ratchet key, worker is missing");
    }
    const msg = {
      kind: "ratchetRequest",
      data: {
        participantIdentity,
        keyIndex
      }
    };
    this.worker.postMessage(msg);
  }
  postKey(_ref) {
    let {
      key,
      participantIdentity,
      keyIndex
    } = _ref;
    var _a;
    if (!this.worker) {
      throw Error("could not set key, worker is missing");
    }
    const msg = {
      kind: "setKey",
      data: {
        participantIdentity,
        isPublisher: participantIdentity === ((_a = this.room) === null || _a === void 0 ? void 0 : _a.localParticipant.identity),
        key,
        keyIndex
      }
    };
    this.worker.postMessage(msg);
  }
  postEnable(enabled, participantIdentity) {
    if (this.worker) {
      const enableMsg = {
        kind: "enable",
        data: {
          enabled,
          participantIdentity
        }
      };
      this.worker.postMessage(enableMsg);
    } else {
      throw new ReferenceError("failed to enable e2ee, worker is not ready");
    }
  }
  postRTPMap(map) {
    var _a;
    if (!this.worker) {
      throw TypeError("could not post rtp map, worker is missing");
    }
    if (!((_a = this.room) === null || _a === void 0 ? void 0 : _a.localParticipant.identity)) {
      throw TypeError("could not post rtp map, local participant identity is missing");
    }
    const msg = {
      kind: "setRTPMap",
      data: {
        map,
        participantIdentity: this.room.localParticipant.identity
      }
    };
    this.worker.postMessage(msg);
  }
  postSifTrailer(trailer) {
    if (!this.worker) {
      throw Error("could not post SIF trailer, worker is missing");
    }
    const msg = {
      kind: "setSifTrailer",
      data: {
        trailer
      }
    };
    this.worker.postMessage(msg);
  }
  setupE2EEReceiver(track, remoteId, trackInfo) {
    if (!track.receiver) {
      return;
    }
    if (!(trackInfo === null || trackInfo === void 0 ? void 0 : trackInfo.mimeType) || trackInfo.mimeType === "") {
      throw new TypeError("MimeType missing from trackInfo, cannot set up E2EE cryptor");
    }
    this.handleReceiver(track.receiver, track.mediaStreamID, remoteId, track.kind === "video" ? mimeTypeToVideoCodecString(trackInfo.mimeType) : void 0);
  }
  setupE2EESender(track, sender) {
    if (!isLocalTrack(track) || !sender) {
      if (!sender)
        livekitLogger.warn("early return because sender is not ready");
      return;
    }
    this.handleSender(sender, track.mediaStreamID, void 0);
  }
  /**
   * Handles the given {@code RTCRtpReceiver} by creating a {@code TransformStream} which will inject
   * a frame decoder.
   *
   */
  handleReceiver(receiver, trackId, participantIdentity, codec) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.worker) {
        return;
      }
      if (isScriptTransformSupported()) {
        const options = {
          kind: "decode",
          participantIdentity,
          trackId,
          codec
        };
        receiver.transform = new RTCRtpScriptTransform(this.worker, options);
      } else {
        if (E2EE_FLAG in receiver && codec) {
          const msg2 = {
            kind: "updateCodec",
            data: {
              trackId,
              codec,
              participantIdentity
            }
          };
          this.worker.postMessage(msg2);
          return;
        }
        let writable = receiver.writableStream;
        let readable = receiver.readableStream;
        if (!writable || !readable) {
          const receiverStreams = receiver.createEncodedStreams();
          receiver.writableStream = receiverStreams.writable;
          writable = receiverStreams.writable;
          receiver.readableStream = receiverStreams.readable;
          readable = receiverStreams.readable;
        }
        const msg = {
          kind: "decode",
          data: {
            readableStream: readable,
            writableStream: writable,
            trackId,
            codec,
            participantIdentity
          }
        };
        this.worker.postMessage(msg, [readable, writable]);
      }
      receiver[E2EE_FLAG] = true;
    });
  }
  /**
   * Handles the given {@code RTCRtpSender} by creating a {@code TransformStream} which will inject
   * a frame encoder.
   *
   */
  handleSender(sender, trackId, codec) {
    var _a;
    if (E2EE_FLAG in sender || !this.worker) {
      return;
    }
    if (!((_a = this.room) === null || _a === void 0 ? void 0 : _a.localParticipant.identity) || this.room.localParticipant.identity === "") {
      throw TypeError("local identity needs to be known in order to set up encrypted sender");
    }
    if (isScriptTransformSupported()) {
      livekitLogger.info("initialize script transform");
      const options = {
        kind: "encode",
        participantIdentity: this.room.localParticipant.identity,
        trackId,
        codec
      };
      sender.transform = new RTCRtpScriptTransform(this.worker, options);
    } else {
      livekitLogger.info("initialize encoded streams");
      const senderStreams = sender.createEncodedStreams();
      const msg = {
        kind: "encode",
        data: {
          readableStream: senderStreams.readable,
          writableStream: senderStreams.writable,
          codec,
          trackId,
          participantIdentity: this.room.localParticipant.identity
        }
      };
      this.worker.postMessage(msg, [senderStreams.readable, senderStreams.writable]);
    }
    sender[E2EE_FLAG] = true;
  }
};
var defaultId = "default";
var DeviceManager = class _DeviceManager {
  constructor() {
    this._previousDevices = [];
  }
  static getInstance() {
    if (this.instance === void 0) {
      this.instance = new _DeviceManager();
    }
    return this.instance;
  }
  get previousDevices() {
    return this._previousDevices;
  }
  getDevices(kind_1) {
    return __awaiter(this, arguments, void 0, function(kind) {
      var _this = this;
      let requestPermissions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return function* () {
        var _a;
        if (((_a = _DeviceManager.userMediaPromiseMap) === null || _a === void 0 ? void 0 : _a.size) > 0) {
          livekitLogger.debug("awaiting getUserMedia promise");
          try {
            if (kind) {
              yield _DeviceManager.userMediaPromiseMap.get(kind);
            } else {
              yield Promise.all(_DeviceManager.userMediaPromiseMap.values());
            }
          } catch (e2) {
            livekitLogger.warn("error waiting for media permissons");
          }
        }
        let devices = yield navigator.mediaDevices.enumerateDevices();
        if (requestPermissions && // for safari we need to skip this check, as otherwise it will re-acquire user media and fail on iOS https://bugs.webkit.org/show_bug.cgi?id=179363
        !(isSafari() && _this.hasDeviceInUse(kind))) {
          const isDummyDeviceOrEmpty = devices.filter((d) => d.kind === kind).length === 0 || devices.some((device) => {
            const noLabel = device.label === "";
            const isRelevant = kind ? device.kind === kind : true;
            return noLabel && isRelevant;
          });
          if (isDummyDeviceOrEmpty) {
            const permissionsToAcquire = {
              video: kind !== "audioinput" && kind !== "audiooutput",
              audio: kind !== "videoinput" && {
                deviceId: "default"
              }
            };
            const stream = yield navigator.mediaDevices.getUserMedia(permissionsToAcquire);
            devices = yield navigator.mediaDevices.enumerateDevices();
            stream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        }
        _this._previousDevices = devices;
        if (kind) {
          devices = devices.filter((device) => device.kind === kind);
        }
        return devices;
      }();
    });
  }
  normalizeDeviceId(kind, deviceId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (deviceId !== defaultId) {
        return deviceId;
      }
      const devices = yield this.getDevices(kind);
      const defaultDevice = devices.find((d) => d.deviceId === defaultId);
      if (!defaultDevice) {
        livekitLogger.warn("could not reliably determine default device");
        return void 0;
      }
      const device = devices.find((d) => d.deviceId !== defaultId && d.groupId === (groupId !== null && groupId !== void 0 ? groupId : defaultDevice.groupId));
      if (!device) {
        livekitLogger.warn("could not reliably determine default device");
        return void 0;
      }
      return device === null || device === void 0 ? void 0 : device.deviceId;
    });
  }
  hasDeviceInUse(kind) {
    return kind ? _DeviceManager.userMediaPromiseMap.has(kind) : _DeviceManager.userMediaPromiseMap.size > 0;
  }
};
DeviceManager.mediaDeviceKinds = ["audioinput", "audiooutput", "videoinput"];
DeviceManager.userMediaPromiseMap = /* @__PURE__ */ new Map();
var QueueTaskStatus;
(function(QueueTaskStatus2) {
  QueueTaskStatus2[QueueTaskStatus2["WAITING"] = 0] = "WAITING";
  QueueTaskStatus2[QueueTaskStatus2["RUNNING"] = 1] = "RUNNING";
  QueueTaskStatus2[QueueTaskStatus2["COMPLETED"] = 2] = "COMPLETED";
})(QueueTaskStatus || (QueueTaskStatus = {}));
var AsyncQueue = class {
  constructor() {
    this.pendingTasks = /* @__PURE__ */ new Map();
    this.taskMutex = new _();
    this.nextTaskIndex = 0;
  }
  run(task) {
    return __awaiter(this, void 0, void 0, function* () {
      const taskInfo = {
        id: this.nextTaskIndex++,
        enqueuedAt: Date.now(),
        status: QueueTaskStatus.WAITING
      };
      this.pendingTasks.set(taskInfo.id, taskInfo);
      const unlock = yield this.taskMutex.lock();
      try {
        taskInfo.executedAt = Date.now();
        taskInfo.status = QueueTaskStatus.RUNNING;
        return yield task();
      } finally {
        taskInfo.status = QueueTaskStatus.COMPLETED;
        this.pendingTasks.delete(taskInfo.id);
        unlock();
      }
    });
  }
  flush() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.run(() => __awaiter(this, void 0, void 0, function* () {
      }));
    });
  }
  snapshot() {
    return Array.from(this.pendingTasks.values());
  }
};
var passThroughQueueSignals = ["syncState", "trickle", "offer", "answer", "simulate", "leave"];
function canPassThroughQueue(req) {
  const canPass = passThroughQueueSignals.indexOf(req.case) >= 0;
  livekitLogger.trace("request allowed to bypass queue:", {
    canPass,
    req
  });
  return canPass;
}
var SignalConnectionState;
(function(SignalConnectionState2) {
  SignalConnectionState2[SignalConnectionState2["CONNECTING"] = 0] = "CONNECTING";
  SignalConnectionState2[SignalConnectionState2["CONNECTED"] = 1] = "CONNECTED";
  SignalConnectionState2[SignalConnectionState2["RECONNECTING"] = 2] = "RECONNECTING";
  SignalConnectionState2[SignalConnectionState2["DISCONNECTING"] = 3] = "DISCONNECTING";
  SignalConnectionState2[SignalConnectionState2["DISCONNECTED"] = 4] = "DISCONNECTED";
})(SignalConnectionState || (SignalConnectionState = {}));
var SignalClient = class {
  get currentState() {
    return this.state;
  }
  get isDisconnected() {
    return this.state === SignalConnectionState.DISCONNECTING || this.state === SignalConnectionState.DISCONNECTED;
  }
  get isEstablishingConnection() {
    return this.state === SignalConnectionState.CONNECTING || this.state === SignalConnectionState.RECONNECTING;
  }
  getNextRequestId() {
    this._requestId += 1;
    return this._requestId;
  }
  constructor() {
    let useJSON = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    let loggerOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _a;
    this.rtt = 0;
    this.state = SignalConnectionState.DISCONNECTED;
    this.log = livekitLogger;
    this._requestId = 0;
    this.resetCallbacks = () => {
      this.onAnswer = void 0;
      this.onLeave = void 0;
      this.onLocalTrackPublished = void 0;
      this.onLocalTrackUnpublished = void 0;
      this.onNegotiateRequested = void 0;
      this.onOffer = void 0;
      this.onRemoteMuteChanged = void 0;
      this.onSubscribedQualityUpdate = void 0;
      this.onTokenRefresh = void 0;
      this.onTrickle = void 0;
      this.onClose = void 0;
    };
    this.log = getLogger((_a = loggerOptions.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.Signal);
    this.loggerContextCb = loggerOptions.loggerContextCb;
    this.useJSON = useJSON;
    this.requestQueue = new AsyncQueue();
    this.queuedRequests = [];
    this.closingLock = new _();
    this.connectionLock = new _();
    this.state = SignalConnectionState.DISCONNECTED;
  }
  get logContext() {
    var _a, _b;
    return (_b = (_a = this.loggerContextCb) === null || _a === void 0 ? void 0 : _a.call(this)) !== null && _b !== void 0 ? _b : {};
  }
  join(url, token, opts, abortSignal) {
    return __awaiter(this, void 0, void 0, function* () {
      this.state = SignalConnectionState.CONNECTING;
      this.options = opts;
      const res = yield this.connect(url, token, opts, abortSignal);
      return res;
    });
  }
  reconnect(url, token, sid, reason) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.options) {
        this.log.warn("attempted to reconnect without signal options being set, ignoring", this.logContext);
        return;
      }
      this.state = SignalConnectionState.RECONNECTING;
      this.clearPingInterval();
      const res = yield this.connect(url, token, Object.assign(Object.assign({}, this.options), {
        reconnect: true,
        sid,
        reconnectReason: reason
      }));
      return res;
    });
  }
  connect(url, token, opts, abortSignal) {
    this.connectOptions = opts;
    url = toWebsocketUrl(url);
    url = url.replace(/\/$/, "");
    url += "/rtc";
    const clientInfo = getClientInfo();
    const params = createConnectionParams(token, clientInfo, opts);
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
      const unlock = yield this.connectionLock.lock();
      try {
        const abortHandler = () => __awaiter(this, void 0, void 0, function* () {
          this.close();
          clearTimeout(wsTimeout);
          reject(new ConnectionError("room connection has been cancelled (signal)", ConnectionErrorReason.Cancelled));
        });
        const wsTimeout = setTimeout(() => {
          this.close();
          reject(new ConnectionError("room connection has timed out (signal)", ConnectionErrorReason.ServerUnreachable));
        }, opts.websocketTimeout);
        if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
          abortHandler();
        }
        abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener("abort", abortHandler);
        this.log.debug("connecting to ".concat(url + params.replace(/access_token=([^&#$]*)/, "access_token=<redacted>")), this.logContext);
        if (this.ws) {
          yield this.close(false);
        }
        this.ws = new WebSocket(url + params);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = () => {
          clearTimeout(wsTimeout);
        };
        this.ws.onerror = (ev) => __awaiter(this, void 0, void 0, function* () {
          if (this.state !== SignalConnectionState.CONNECTED) {
            this.state = SignalConnectionState.DISCONNECTED;
            clearTimeout(wsTimeout);
            try {
              const resp = yield fetch("http".concat(url.substring(2), "/validate").concat(params));
              if (resp.status.toFixed(0).startsWith("4")) {
                const msg = yield resp.text();
                reject(new ConnectionError(msg, ConnectionErrorReason.NotAllowed, resp.status));
              } else {
                reject(new ConnectionError("Internal error", ConnectionErrorReason.InternalError, resp.status));
              }
            } catch (e2) {
              reject(new ConnectionError(e2 instanceof Error ? e2.message : "server was not reachable", ConnectionErrorReason.ServerUnreachable));
            }
            return;
          }
          this.handleWSError(ev);
        });
        this.ws.onmessage = (ev) => __awaiter(this, void 0, void 0, function* () {
          var _a, _b, _c;
          let resp;
          if (typeof ev.data === "string") {
            const json = JSON.parse(ev.data);
            resp = SignalResponse.fromJson(json, {
              ignoreUnknownFields: true
            });
          } else if (ev.data instanceof ArrayBuffer) {
            resp = SignalResponse.fromBinary(new Uint8Array(ev.data));
          } else {
            this.log.error("could not decode websocket message: ".concat(typeof ev.data), this.logContext);
            return;
          }
          if (this.state !== SignalConnectionState.CONNECTED) {
            let shouldProcessMessage = false;
            if (((_a = resp.message) === null || _a === void 0 ? void 0 : _a.case) === "join") {
              this.state = SignalConnectionState.CONNECTED;
              abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.removeEventListener("abort", abortHandler);
              this.pingTimeoutDuration = resp.message.value.pingTimeout;
              this.pingIntervalDuration = resp.message.value.pingInterval;
              if (this.pingTimeoutDuration && this.pingTimeoutDuration > 0) {
                this.log.debug("ping config", Object.assign(Object.assign({}, this.logContext), {
                  timeout: this.pingTimeoutDuration,
                  interval: this.pingIntervalDuration
                }));
                this.startPingInterval();
              }
              resolve(resp.message.value);
            } else if (this.state === SignalConnectionState.RECONNECTING && resp.message.case !== "leave") {
              this.state = SignalConnectionState.CONNECTED;
              abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.removeEventListener("abort", abortHandler);
              this.startPingInterval();
              if (((_b = resp.message) === null || _b === void 0 ? void 0 : _b.case) === "reconnect") {
                resolve(resp.message.value);
              } else {
                this.log.debug("declaring signal reconnected without reconnect response received", this.logContext);
                resolve(void 0);
                shouldProcessMessage = true;
              }
            } else if (this.isEstablishingConnection && resp.message.case === "leave") {
              reject(new ConnectionError("Received leave request while trying to (re)connect", ConnectionErrorReason.LeaveRequest, void 0, resp.message.value.reason));
            } else if (!opts.reconnect) {
              reject(new ConnectionError("did not receive join response, got ".concat((_c = resp.message) === null || _c === void 0 ? void 0 : _c.case, " instead"), ConnectionErrorReason.InternalError));
            }
            if (!shouldProcessMessage) {
              return;
            }
          }
          if (this.signalLatency) {
            yield sleep(this.signalLatency);
          }
          this.handleSignalResponse(resp);
        });
        this.ws.onclose = (ev) => {
          if (this.isEstablishingConnection) {
            reject(new ConnectionError("Websocket got closed during a (re)connection attempt", ConnectionErrorReason.InternalError));
          }
          this.log.warn("websocket closed", Object.assign(Object.assign({}, this.logContext), {
            reason: ev.reason,
            code: ev.code,
            wasClean: ev.wasClean,
            state: this.state
          }));
          this.handleOnClose(ev.reason);
        };
      } finally {
        unlock();
      }
    }));
  }
  close() {
    return __awaiter(this, arguments, void 0, function() {
      var _this = this;
      let updateState = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      return function* () {
        const unlock = yield _this.closingLock.lock();
        try {
          _this.clearPingInterval();
          if (updateState) {
            _this.state = SignalConnectionState.DISCONNECTING;
          }
          if (_this.ws) {
            _this.ws.onmessage = null;
            _this.ws.onopen = null;
            _this.ws.onclose = null;
            const closePromise = new Promise((resolve) => {
              if (_this.ws) {
                _this.ws.onclose = () => {
                  resolve();
                };
              } else {
                resolve();
              }
            });
            if (_this.ws.readyState < _this.ws.CLOSING) {
              _this.ws.close();
              yield Promise.race([closePromise, sleep(250)]);
            }
            _this.ws = void 0;
          }
        } finally {
          if (updateState) {
            _this.state = SignalConnectionState.DISCONNECTED;
          }
          unlock();
        }
      }();
    });
  }
  // initial offer after joining
  sendOffer(offer) {
    this.log.debug("sending offer", Object.assign(Object.assign({}, this.logContext), {
      offerSdp: offer.sdp
    }));
    this.sendRequest({
      case: "offer",
      value: toProtoSessionDescription(offer)
    });
  }
  // answer a server-initiated offer
  sendAnswer(answer) {
    this.log.debug("sending answer", Object.assign(Object.assign({}, this.logContext), {
      answerSdp: answer.sdp
    }));
    return this.sendRequest({
      case: "answer",
      value: toProtoSessionDescription(answer)
    });
  }
  sendIceCandidate(candidate, target) {
    this.log.trace("sending ice candidate", Object.assign(Object.assign({}, this.logContext), {
      candidate
    }));
    return this.sendRequest({
      case: "trickle",
      value: new TrickleRequest({
        candidateInit: JSON.stringify(candidate),
        target
      })
    });
  }
  sendMuteTrack(trackSid, muted) {
    return this.sendRequest({
      case: "mute",
      value: new MuteTrackRequest({
        sid: trackSid,
        muted
      })
    });
  }
  sendAddTrack(req) {
    return this.sendRequest({
      case: "addTrack",
      value: req
    });
  }
  sendUpdateLocalMetadata(metadata_1, name_1) {
    return __awaiter(this, arguments, void 0, function(metadata, name) {
      var _this2 = this;
      let attributes = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return function* () {
        const requestId = _this2.getNextRequestId();
        yield _this2.sendRequest({
          case: "updateMetadata",
          value: new UpdateParticipantMetadata({
            requestId,
            metadata,
            name,
            attributes
          })
        });
        return requestId;
      }();
    });
  }
  sendUpdateTrackSettings(settings) {
    this.sendRequest({
      case: "trackSetting",
      value: settings
    });
  }
  sendUpdateSubscription(sub) {
    return this.sendRequest({
      case: "subscription",
      value: sub
    });
  }
  sendSyncState(sync) {
    return this.sendRequest({
      case: "syncState",
      value: sync
    });
  }
  sendUpdateVideoLayers(trackSid, layers) {
    return this.sendRequest({
      case: "updateLayers",
      value: new UpdateVideoLayers({
        trackSid,
        layers
      })
    });
  }
  sendUpdateSubscriptionPermissions(allParticipants, trackPermissions) {
    return this.sendRequest({
      case: "subscriptionPermission",
      value: new SubscriptionPermission({
        allParticipants,
        trackPermissions
      })
    });
  }
  sendSimulateScenario(scenario) {
    return this.sendRequest({
      case: "simulate",
      value: scenario
    });
  }
  sendPing() {
    return Promise.all([this.sendRequest({
      case: "ping",
      value: protoInt64.parse(Date.now())
    }), this.sendRequest({
      case: "pingReq",
      value: new Ping({
        timestamp: protoInt64.parse(Date.now()),
        rtt: protoInt64.parse(this.rtt)
      })
    })]);
  }
  sendUpdateLocalAudioTrack(trackSid, features) {
    return this.sendRequest({
      case: "updateAudioTrack",
      value: new UpdateLocalAudioTrack({
        trackSid,
        features
      })
    });
  }
  sendLeave() {
    return this.sendRequest({
      case: "leave",
      value: new LeaveRequest({
        reason: DisconnectReason.CLIENT_INITIATED,
        // server doesn't process this field, keeping it here to indicate the intent of a full disconnect
        action: LeaveRequest_Action.DISCONNECT
      })
    });
  }
  sendRequest(message_1) {
    return __awaiter(this, arguments, void 0, function(message) {
      var _this3 = this;
      let fromQueue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      return function* () {
        const canQueue = !fromQueue && !canPassThroughQueue(message);
        if (canQueue && _this3.state === SignalConnectionState.RECONNECTING) {
          _this3.queuedRequests.push(() => __awaiter(_this3, void 0, void 0, function* () {
            yield this.sendRequest(message, true);
          }));
          return;
        }
        if (!fromQueue) {
          yield _this3.requestQueue.flush();
        }
        if (_this3.signalLatency) {
          yield sleep(_this3.signalLatency);
        }
        if (!_this3.ws || _this3.ws.readyState !== _this3.ws.OPEN) {
          _this3.log.error("cannot send signal request before connected, type: ".concat(message === null || message === void 0 ? void 0 : message.case), _this3.logContext);
          return;
        }
        const req = new SignalRequest({
          message
        });
        try {
          if (_this3.useJSON) {
            _this3.ws.send(req.toJsonString());
          } else {
            _this3.ws.send(req.toBinary());
          }
        } catch (e2) {
          _this3.log.error("error sending signal message", Object.assign(Object.assign({}, _this3.logContext), {
            error: e2
          }));
        }
      }();
    });
  }
  handleSignalResponse(res) {
    var _a, _b;
    const msg = res.message;
    if (msg == void 0) {
      this.log.debug("received unsupported message", this.logContext);
      return;
    }
    let pingHandled = false;
    if (msg.case === "answer") {
      const sd = fromProtoSessionDescription(msg.value);
      if (this.onAnswer) {
        this.onAnswer(sd);
      }
    } else if (msg.case === "offer") {
      const sd = fromProtoSessionDescription(msg.value);
      if (this.onOffer) {
        this.onOffer(sd);
      }
    } else if (msg.case === "trickle") {
      const candidate = JSON.parse(msg.value.candidateInit);
      if (this.onTrickle) {
        this.onTrickle(candidate, msg.value.target);
      }
    } else if (msg.case === "update") {
      if (this.onParticipantUpdate) {
        this.onParticipantUpdate((_a = msg.value.participants) !== null && _a !== void 0 ? _a : []);
      }
    } else if (msg.case === "trackPublished") {
      if (this.onLocalTrackPublished) {
        this.onLocalTrackPublished(msg.value);
      }
    } else if (msg.case === "speakersChanged") {
      if (this.onSpeakersChanged) {
        this.onSpeakersChanged((_b = msg.value.speakers) !== null && _b !== void 0 ? _b : []);
      }
    } else if (msg.case === "leave") {
      if (this.onLeave) {
        this.onLeave(msg.value);
      }
    } else if (msg.case === "mute") {
      if (this.onRemoteMuteChanged) {
        this.onRemoteMuteChanged(msg.value.sid, msg.value.muted);
      }
    } else if (msg.case === "roomUpdate") {
      if (this.onRoomUpdate && msg.value.room) {
        this.onRoomUpdate(msg.value.room);
      }
    } else if (msg.case === "connectionQuality") {
      if (this.onConnectionQuality) {
        this.onConnectionQuality(msg.value);
      }
    } else if (msg.case === "streamStateUpdate") {
      if (this.onStreamStateUpdate) {
        this.onStreamStateUpdate(msg.value);
      }
    } else if (msg.case === "subscribedQualityUpdate") {
      if (this.onSubscribedQualityUpdate) {
        this.onSubscribedQualityUpdate(msg.value);
      }
    } else if (msg.case === "subscriptionPermissionUpdate") {
      if (this.onSubscriptionPermissionUpdate) {
        this.onSubscriptionPermissionUpdate(msg.value);
      }
    } else if (msg.case === "refreshToken") {
      if (this.onTokenRefresh) {
        this.onTokenRefresh(msg.value);
      }
    } else if (msg.case === "trackUnpublished") {
      if (this.onLocalTrackUnpublished) {
        this.onLocalTrackUnpublished(msg.value);
      }
    } else if (msg.case === "subscriptionResponse") {
      if (this.onSubscriptionError) {
        this.onSubscriptionError(msg.value);
      }
    } else if (msg.case === "pong")
      ;
    else if (msg.case === "pongResp") {
      this.rtt = Date.now() - Number.parseInt(msg.value.lastPingTimestamp.toString());
      this.resetPingTimeout();
      pingHandled = true;
    } else if (msg.case === "requestResponse") {
      if (this.onRequestResponse) {
        this.onRequestResponse(msg.value);
      }
    } else if (msg.case === "trackSubscribed") {
      if (this.onLocalTrackSubscribed) {
        this.onLocalTrackSubscribed(msg.value.trackSid);
      }
    } else {
      this.log.debug("unsupported message", Object.assign(Object.assign({}, this.logContext), {
        msgCase: msg.case
      }));
    }
    if (!pingHandled) {
      this.resetPingTimeout();
    }
  }
  setReconnected() {
    while (this.queuedRequests.length > 0) {
      const req = this.queuedRequests.shift();
      if (req) {
        this.requestQueue.run(req);
      }
    }
  }
  handleOnClose(reason) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.state === SignalConnectionState.DISCONNECTED)
        return;
      const onCloseCallback = this.onClose;
      yield this.close();
      this.log.debug("websocket connection closed: ".concat(reason), Object.assign(Object.assign({}, this.logContext), {
        reason
      }));
      if (onCloseCallback) {
        onCloseCallback(reason);
      }
    });
  }
  handleWSError(ev) {
    this.log.error("websocket error", Object.assign(Object.assign({}, this.logContext), {
      error: ev
    }));
  }
  /**
   * Resets the ping timeout and starts a new timeout.
   * Call this after receiving a pong message
   */
  resetPingTimeout() {
    this.clearPingTimeout();
    if (!this.pingTimeoutDuration) {
      this.log.warn("ping timeout duration not set", this.logContext);
      return;
    }
    this.pingTimeout = CriticalTimers.setTimeout(() => {
      this.log.warn("ping timeout triggered. last pong received at: ".concat(new Date(Date.now() - this.pingTimeoutDuration * 1e3).toUTCString()), this.logContext);
      this.handleOnClose("ping timeout");
    }, this.pingTimeoutDuration * 1e3);
  }
  /**
   * Clears ping timeout (does not start a new timeout)
   */
  clearPingTimeout() {
    if (this.pingTimeout) {
      CriticalTimers.clearTimeout(this.pingTimeout);
    }
  }
  startPingInterval() {
    this.clearPingInterval();
    this.resetPingTimeout();
    if (!this.pingIntervalDuration) {
      this.log.warn("ping interval duration not set", this.logContext);
      return;
    }
    this.log.debug("start ping interval", this.logContext);
    this.pingInterval = CriticalTimers.setInterval(() => {
      this.sendPing();
    }, this.pingIntervalDuration * 1e3);
  }
  clearPingInterval() {
    this.log.debug("clearing ping interval", this.logContext);
    this.clearPingTimeout();
    if (this.pingInterval) {
      CriticalTimers.clearInterval(this.pingInterval);
    }
  }
};
function fromProtoSessionDescription(sd) {
  const rsd = {
    type: "offer",
    sdp: sd.sdp
  };
  switch (sd.type) {
    case "answer":
    case "offer":
    case "pranswer":
    case "rollback":
      rsd.type = sd.type;
      break;
  }
  return rsd;
}
function toProtoSessionDescription(rsd) {
  const sd = new SessionDescription({
    sdp: rsd.sdp,
    type: rsd.type
  });
  return sd;
}
function createConnectionParams(token, info, opts) {
  var _a;
  const params = new URLSearchParams();
  params.set("access_token", token);
  if (opts.reconnect) {
    params.set("reconnect", "1");
    if (opts.sid) {
      params.set("sid", opts.sid);
    }
  }
  params.set("auto_subscribe", opts.autoSubscribe ? "1" : "0");
  params.set("sdk", isReactNative() ? "reactnative" : "js");
  params.set("version", info.version);
  params.set("protocol", info.protocol.toString());
  if (info.deviceModel) {
    params.set("device_model", info.deviceModel);
  }
  if (info.os) {
    params.set("os", info.os);
  }
  if (info.osVersion) {
    params.set("os_version", info.osVersion);
  }
  if (info.browser) {
    params.set("browser", info.browser);
  }
  if (info.browserVersion) {
    params.set("browser_version", info.browserVersion);
  }
  if (opts.adaptiveStream) {
    params.set("adaptive_stream", "1");
  }
  if (opts.reconnectReason) {
    params.set("reconnect_reason", opts.reconnectReason.toString());
  }
  if ((_a = navigator.connection) === null || _a === void 0 ? void 0 : _a.type) {
    params.set("network", navigator.connection.type);
  }
  return "?".concat(params.toString());
}
var lib = {};
var parser = {};
var grammar = { exports: {} };
var hasRequiredGrammar;
function requireGrammar() {
  if (hasRequiredGrammar)
    return grammar.exports;
  hasRequiredGrammar = 1;
  var grammar$1 = grammar.exports = {
    v: [{
      name: "version",
      reg: /^(\d*)$/
    }],
    o: [{
      // o=- 20518 0 IN IP4 203.0.113.1
      // NB: sessionId will be a String in most cases because it is huge
      name: "origin",
      reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
      names: ["username", "sessionId", "sessionVersion", "netType", "ipVer", "address"],
      format: "%s %s %d %s IP%d %s"
    }],
    // default parsing of these only (though some of these feel outdated)
    s: [{
      name: "name"
    }],
    i: [{
      name: "description"
    }],
    u: [{
      name: "uri"
    }],
    e: [{
      name: "email"
    }],
    p: [{
      name: "phone"
    }],
    z: [{
      name: "timezones"
    }],
    // TODO: this one can actually be parsed properly...
    r: [{
      name: "repeats"
    }],
    // TODO: this one can also be parsed properly
    // k: [{}], // outdated thing ignored
    t: [{
      // t=0 0
      name: "timing",
      reg: /^(\d*) (\d*)/,
      names: ["start", "stop"],
      format: "%d %d"
    }],
    c: [{
      // c=IN IP4 10.47.197.26
      name: "connection",
      reg: /^IN IP(\d) (\S*)/,
      names: ["version", "ip"],
      format: "IN IP%d %s"
    }],
    b: [{
      // b=AS:4000
      push: "bandwidth",
      reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
      names: ["type", "limit"],
      format: "%s:%s"
    }],
    m: [{
      // m=video 51744 RTP/AVP 126 97 98 34 31
      // NB: special - pushes to session
      // TODO: rtp/fmtp should be filtered by the payloads found here?
      reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
      names: ["type", "port", "protocol", "payloads"],
      format: "%s %d %s %s"
    }],
    a: [
      {
        // a=rtpmap:110 opus/48000/2
        push: "rtp",
        reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
        names: ["payload", "codec", "rate", "encoding"],
        format: function(o2) {
          return o2.encoding ? "rtpmap:%d %s/%s/%s" : o2.rate ? "rtpmap:%d %s/%s" : "rtpmap:%d %s";
        }
      },
      {
        // a=fmtp:108 profile-level-id=24;object=23;bitrate=64000
        // a=fmtp:111 minptime=10; useinbandfec=1
        push: "fmtp",
        reg: /^fmtp:(\d*) ([\S| ]*)/,
        names: ["payload", "config"],
        format: "fmtp:%d %s"
      },
      {
        // a=control:streamid=0
        name: "control",
        reg: /^control:(.*)/,
        format: "control:%s"
      },
      {
        // a=rtcp:65179 IN IP4 193.84.77.194
        name: "rtcp",
        reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
        names: ["port", "netType", "ipVer", "address"],
        format: function(o2) {
          return o2.address != null ? "rtcp:%d %s IP%d %s" : "rtcp:%d";
        }
      },
      {
        // a=rtcp-fb:98 trr-int 100
        push: "rtcpFbTrrInt",
        reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
        names: ["payload", "value"],
        format: "rtcp-fb:%s trr-int %d"
      },
      {
        // a=rtcp-fb:98 nack rpsi
        push: "rtcpFb",
        reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
        names: ["payload", "type", "subtype"],
        format: function(o2) {
          return o2.subtype != null ? "rtcp-fb:%s %s %s" : "rtcp-fb:%s %s";
        }
      },
      {
        // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
        // a=extmap:1/recvonly URI-gps-string
        // a=extmap:3 urn:ietf:params:rtp-hdrext:encrypt urn:ietf:params:rtp-hdrext:smpte-tc 25@600/24
        push: "ext",
        reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
        names: ["value", "direction", "encrypt-uri", "uri", "config"],
        format: function(o2) {
          return "extmap:%d" + (o2.direction ? "/%s" : "%v") + (o2["encrypt-uri"] ? " %s" : "%v") + " %s" + (o2.config ? " %s" : "");
        }
      },
      {
        // a=extmap-allow-mixed
        name: "extmapAllowMixed",
        reg: /^(extmap-allow-mixed)/
      },
      {
        // a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPywjNWhcYD0mXXtxaVBR|2^20|1:32
        push: "crypto",
        reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
        names: ["id", "suite", "config", "sessionConfig"],
        format: function(o2) {
          return o2.sessionConfig != null ? "crypto:%d %s %s %s" : "crypto:%d %s %s";
        }
      },
      {
        // a=setup:actpass
        name: "setup",
        reg: /^setup:(\w*)/,
        format: "setup:%s"
      },
      {
        // a=connection:new
        name: "connectionType",
        reg: /^connection:(new|existing)/,
        format: "connection:%s"
      },
      {
        // a=mid:1
        name: "mid",
        reg: /^mid:([^\s]*)/,
        format: "mid:%s"
      },
      {
        // a=msid:0c8b064d-d807-43b4-b434-f92a889d8587 98178685-d409-46e0-8e16-7ef0db0db64a
        name: "msid",
        reg: /^msid:(.*)/,
        format: "msid:%s"
      },
      {
        // a=ptime:20
        name: "ptime",
        reg: /^ptime:(\d*(?:\.\d*)*)/,
        format: "ptime:%d"
      },
      {
        // a=maxptime:60
        name: "maxptime",
        reg: /^maxptime:(\d*(?:\.\d*)*)/,
        format: "maxptime:%d"
      },
      {
        // a=sendrecv
        name: "direction",
        reg: /^(sendrecv|recvonly|sendonly|inactive)/
      },
      {
        // a=ice-lite
        name: "icelite",
        reg: /^(ice-lite)/
      },
      {
        // a=ice-ufrag:F7gI
        name: "iceUfrag",
        reg: /^ice-ufrag:(\S*)/,
        format: "ice-ufrag:%s"
      },
      {
        // a=ice-pwd:x9cml/YzichV2+XlhiMu8g
        name: "icePwd",
        reg: /^ice-pwd:(\S*)/,
        format: "ice-pwd:%s"
      },
      {
        // a=fingerprint:SHA-1 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33
        name: "fingerprint",
        reg: /^fingerprint:(\S*) (\S*)/,
        names: ["type", "hash"],
        format: "fingerprint:%s %s"
      },
      {
        // a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
        // a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
        // a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
        // a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
        // a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
        push: "candidates",
        reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
        names: ["foundation", "component", "transport", "priority", "ip", "port", "type", "raddr", "rport", "tcptype", "generation", "network-id", "network-cost"],
        format: function(o2) {
          var str = "candidate:%s %d %s %d %s %d typ %s";
          str += o2.raddr != null ? " raddr %s rport %d" : "%v%v";
          str += o2.tcptype != null ? " tcptype %s" : "%v";
          if (o2.generation != null) {
            str += " generation %d";
          }
          str += o2["network-id"] != null ? " network-id %d" : "%v";
          str += o2["network-cost"] != null ? " network-cost %d" : "%v";
          return str;
        }
      },
      {
        // a=end-of-candidates (keep after the candidates line for readability)
        name: "endOfCandidates",
        reg: /^(end-of-candidates)/
      },
      {
        // a=remote-candidates:1 203.0.113.1 54400 2 203.0.113.1 54401 ...
        name: "remoteCandidates",
        reg: /^remote-candidates:(.*)/,
        format: "remote-candidates:%s"
      },
      {
        // a=ice-options:google-ice
        name: "iceOptions",
        reg: /^ice-options:(\S*)/,
        format: "ice-options:%s"
      },
      {
        // a=ssrc:2566107569 cname:t9YU8M1UxTF8Y1A1
        push: "ssrcs",
        reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
        names: ["id", "attribute", "value"],
        format: function(o2) {
          var str = "ssrc:%d";
          if (o2.attribute != null) {
            str += " %s";
            if (o2.value != null) {
              str += ":%s";
            }
          }
          return str;
        }
      },
      {
        // a=ssrc-group:FEC 1 2
        // a=ssrc-group:FEC-FR 3004364195 1080772241
        push: "ssrcGroups",
        // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
        reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
        names: ["semantics", "ssrcs"],
        format: "ssrc-group:%s %s"
      },
      {
        // a=msid-semantic: WMS Jvlam5X3SX1OP6pn20zWogvaKJz5Hjf9OnlV
        name: "msidSemantic",
        reg: /^msid-semantic:\s?(\w*) (\S*)/,
        names: ["semantic", "token"],
        format: "msid-semantic: %s %s"
        // space after ':' is not accidental
      },
      {
        // a=group:BUNDLE audio video
        push: "groups",
        reg: /^group:(\w*) (.*)/,
        names: ["type", "mids"],
        format: "group:%s %s"
      },
      {
        // a=rtcp-mux
        name: "rtcpMux",
        reg: /^(rtcp-mux)/
      },
      {
        // a=rtcp-rsize
        name: "rtcpRsize",
        reg: /^(rtcp-rsize)/
      },
      {
        // a=sctpmap:5000 webrtc-datachannel 1024
        name: "sctpmap",
        reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
        names: ["sctpmapNumber", "app", "maxMessageSize"],
        format: function(o2) {
          return o2.maxMessageSize != null ? "sctpmap:%s %s %s" : "sctpmap:%s %s";
        }
      },
      {
        // a=x-google-flag:conference
        name: "xGoogleFlag",
        reg: /^x-google-flag:([^\s]*)/,
        format: "x-google-flag:%s"
      },
      {
        // a=rid:1 send max-width=1280;max-height=720;max-fps=30;depend=0
        push: "rids",
        reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
        names: ["id", "direction", "params"],
        format: function(o2) {
          return o2.params ? "rid:%s %s %s" : "rid:%s %s";
        }
      },
      {
        // a=imageattr:97 send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320] recv [x=330,y=250]
        // a=imageattr:* send [x=800,y=640] recv *
        // a=imageattr:100 recv [x=320,y=240]
        push: "imageattrs",
        reg: new RegExp(
          // a=imageattr:97
          "^imageattr:(\\d+|\\*)[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?"
        ),
        names: ["pt", "dir1", "attrs1", "dir2", "attrs2"],
        format: function(o2) {
          return "imageattr:%s %s %s" + (o2.dir2 ? " %s %s" : "");
        }
      },
      {
        // a=simulcast:send 1,2,3;~4,~5 recv 6;~7,~8
        // a=simulcast:recv 1;4,5 send 6;7
        name: "simulcast",
        reg: new RegExp(
          // a=simulcast:
          "^simulcast:(send|recv) ([a-zA-Z0-9\\-_~;,]+)(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?$"
        ),
        names: ["dir1", "list1", "dir2", "list2"],
        format: function(o2) {
          return "simulcast:%s %s" + (o2.dir2 ? " %s %s" : "");
        }
      },
      {
        // old simulcast draft 03 (implemented by Firefox)
        //   https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
        // a=simulcast: recv pt=97;98 send pt=97
        // a=simulcast: send rid=5;6;7 paused=6,7
        name: "simulcast_03",
        reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
        names: ["value"],
        format: "simulcast: %s"
      },
      {
        // a=framerate:25
        // a=framerate:29.97
        name: "framerate",
        reg: /^framerate:(\d+(?:$|\.\d+))/,
        format: "framerate:%s"
      },
      {
        // RFC4570
        // a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
        name: "sourceFilter",
        reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
        names: ["filterMode", "netType", "addressTypes", "destAddress", "srcList"],
        format: "source-filter: %s %s %s %s %s"
      },
      {
        // a=bundle-only
        name: "bundleOnly",
        reg: /^(bundle-only)/
      },
      {
        // a=label:1
        name: "label",
        reg: /^label:(.+)/,
        format: "label:%s"
      },
      {
        // RFC version 26 for SCTP over DTLS
        // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-5
        name: "sctpPort",
        reg: /^sctp-port:(\d+)$/,
        format: "sctp-port:%s"
      },
      {
        // RFC version 26 for SCTP over DTLS
        // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-6
        name: "maxMessageSize",
        reg: /^max-message-size:(\d+)$/,
        format: "max-message-size:%s"
      },
      {
        // RFC7273
        // a=ts-refclk:ptp=IEEE1588-2008:39-A7-94-FF-FE-07-CB-D0:37
        push: "tsRefClocks",
        reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
        names: ["clksrc", "clksrcExt"],
        format: function(o2) {
          return "ts-refclk:%s" + (o2.clksrcExt != null ? "=%s" : "");
        }
      },
      {
        // RFC7273
        // a=mediaclk:direct=963214424
        name: "mediaClk",
        reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
        names: ["id", "mediaClockName", "mediaClockValue", "rateNumerator", "rateDenominator"],
        format: function(o2) {
          var str = "mediaclk:";
          str += o2.id != null ? "id=%s %s" : "%v%s";
          str += o2.mediaClockValue != null ? "=%s" : "";
          str += o2.rateNumerator != null ? " rate=%s" : "";
          str += o2.rateDenominator != null ? "/%s" : "";
          return str;
        }
      },
      {
        // a=keywds:keywords
        name: "keywords",
        reg: /^keywds:(.+)$/,
        format: "keywds:%s"
      },
      {
        // a=content:main
        name: "content",
        reg: /^content:(.+)/,
        format: "content:%s"
      },
      // BFCP https://tools.ietf.org/html/rfc4583
      {
        // a=floorctrl:c-s
        name: "bfcpFloorCtrl",
        reg: /^floorctrl:(c-only|s-only|c-s)/,
        format: "floorctrl:%s"
      },
      {
        // a=confid:1
        name: "bfcpConfId",
        reg: /^confid:(\d+)/,
        format: "confid:%s"
      },
      {
        // a=userid:1
        name: "bfcpUserId",
        reg: /^userid:(\d+)/,
        format: "userid:%s"
      },
      {
        // a=floorid:1
        name: "bfcpFloorId",
        reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
        names: ["id", "mStream"],
        format: "floorid:%s mstrm:%s"
      },
      {
        // any a= that we don't understand is kept verbatim on media.invalid
        push: "invalid",
        names: ["value"]
      }
    ]
  };
  Object.keys(grammar$1).forEach(function(key) {
    var objs = grammar$1[key];
    objs.forEach(function(obj) {
      if (!obj.reg) {
        obj.reg = /(.*)/;
      }
      if (!obj.format) {
        obj.format = "%s";
      }
    });
  });
  return grammar.exports;
}
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser)
    return parser;
  hasRequiredParser = 1;
  (function(exports) {
    var toIntIfInt = function(v) {
      return String(Number(v)) === v ? Number(v) : v;
    };
    var attachProperties = function(match, location, names, rawName) {
      if (rawName && !names) {
        location[rawName] = toIntIfInt(match[1]);
      } else {
        for (var i = 0; i < names.length; i += 1) {
          if (match[i + 1] != null) {
            location[names[i]] = toIntIfInt(match[i + 1]);
          }
        }
      }
    };
    var parseReg = function(obj, location, content) {
      var needsBlank = obj.name && obj.names;
      if (obj.push && !location[obj.push]) {
        location[obj.push] = [];
      } else if (needsBlank && !location[obj.name]) {
        location[obj.name] = {};
      }
      var keyLocation = obj.push ? {} : (
        // blank object that will be pushed
        needsBlank ? location[obj.name] : location
      );
      attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);
      if (obj.push) {
        location[obj.push].push(keyLocation);
      }
    };
    var grammar2 = requireGrammar();
    var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
    exports.parse = function(sdp2) {
      var session = {}, media = [], location = session;
      sdp2.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function(l) {
        var type = l[0];
        var content = l.slice(2);
        if (type === "m") {
          media.push({
            rtp: [],
            fmtp: []
          });
          location = media[media.length - 1];
        }
        for (var j = 0; j < (grammar2[type] || []).length; j += 1) {
          var obj = grammar2[type][j];
          if (obj.reg.test(content)) {
            return parseReg(obj, location, content);
          }
        }
      });
      session.media = media;
      return session;
    };
    var paramReducer = function(acc, expr) {
      var s = expr.split(/=(.+)/, 2);
      if (s.length === 2) {
        acc[s[0]] = toIntIfInt(s[1]);
      } else if (s.length === 1 && expr.length > 1) {
        acc[s[0]] = void 0;
      }
      return acc;
    };
    exports.parseParams = function(str) {
      return str.split(/;\s?/).reduce(paramReducer, {});
    };
    exports.parseFmtpConfig = exports.parseParams;
    exports.parsePayloads = function(str) {
      return str.toString().split(" ").map(Number);
    };
    exports.parseRemoteCandidates = function(str) {
      var candidates = [];
      var parts = str.split(" ").map(toIntIfInt);
      for (var i = 0; i < parts.length; i += 3) {
        candidates.push({
          component: parts[i],
          ip: parts[i + 1],
          port: parts[i + 2]
        });
      }
      return candidates;
    };
    exports.parseImageAttributes = function(str) {
      return str.split(" ").map(function(item) {
        return item.substring(1, item.length - 1).split(",").reduce(paramReducer, {});
      });
    };
    exports.parseSimulcastStreamList = function(str) {
      return str.split(";").map(function(stream) {
        return stream.split(",").map(function(format) {
          var scid, paused = false;
          if (format[0] !== "~") {
            scid = toIntIfInt(format);
          } else {
            scid = toIntIfInt(format.substring(1, format.length));
            paused = true;
          }
          return {
            scid,
            paused
          };
        });
      });
    };
  })(parser);
  return parser;
}
var writer;
var hasRequiredWriter;
function requireWriter() {
  if (hasRequiredWriter)
    return writer;
  hasRequiredWriter = 1;
  var grammar2 = requireGrammar();
  var formatRegExp = /%[sdv%]/g;
  var format = function(formatStr) {
    var i = 1;
    var args = arguments;
    var len = args.length;
    return formatStr.replace(formatRegExp, function(x) {
      if (i >= len) {
        return x;
      }
      var arg = args[i];
      i += 1;
      switch (x) {
        case "%%":
          return "%";
        case "%s":
          return String(arg);
        case "%d":
          return Number(arg);
        case "%v":
          return "";
      }
    });
  };
  var makeLine = function(type, obj, location) {
    var str = obj.format instanceof Function ? obj.format(obj.push ? location : location[obj.name]) : obj.format;
    var args = [type + "=" + str];
    if (obj.names) {
      for (var i = 0; i < obj.names.length; i += 1) {
        var n = obj.names[i];
        if (obj.name) {
          args.push(location[obj.name][n]);
        } else {
          args.push(location[obj.names[i]]);
        }
      }
    } else {
      args.push(location[obj.name]);
    }
    return format.apply(null, args);
  };
  var defaultOuterOrder = ["v", "o", "s", "i", "u", "e", "p", "c", "b", "t", "r", "z", "a"];
  var defaultInnerOrder = ["i", "c", "b", "a"];
  writer = function(session, opts) {
    opts = opts || {};
    if (session.version == null) {
      session.version = 0;
    }
    if (session.name == null) {
      session.name = " ";
    }
    session.media.forEach(function(mLine) {
      if (mLine.payloads == null) {
        mLine.payloads = "";
      }
    });
    var outerOrder = opts.outerOrder || defaultOuterOrder;
    var innerOrder = opts.innerOrder || defaultInnerOrder;
    var sdp2 = [];
    outerOrder.forEach(function(type) {
      grammar2[type].forEach(function(obj) {
        if (obj.name in session && session[obj.name] != null) {
          sdp2.push(makeLine(type, obj, session));
        } else if (obj.push in session && session[obj.push] != null) {
          session[obj.push].forEach(function(el) {
            sdp2.push(makeLine(type, obj, el));
          });
        }
      });
    });
    session.media.forEach(function(mLine) {
      sdp2.push(makeLine("m", grammar2.m[0], mLine));
      innerOrder.forEach(function(type) {
        grammar2[type].forEach(function(obj) {
          if (obj.name in mLine && mLine[obj.name] != null) {
            sdp2.push(makeLine(type, obj, mLine));
          } else if (obj.push in mLine && mLine[obj.push] != null) {
            mLine[obj.push].forEach(function(el) {
              sdp2.push(makeLine(type, obj, el));
            });
          }
        });
      });
    });
    return sdp2.join("\r\n") + "\r\n";
  };
  return writer;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib)
    return lib;
  hasRequiredLib = 1;
  var parser2 = requireParser();
  var writer2 = requireWriter();
  var grammar2 = requireGrammar();
  lib.grammar = grammar2;
  lib.write = writer2;
  lib.parse = parser2.parse;
  lib.parseParams = parser2.parseParams;
  lib.parseFmtpConfig = parser2.parseFmtpConfig;
  lib.parsePayloads = parser2.parsePayloads;
  lib.parseRemoteCandidates = parser2.parseRemoteCandidates;
  lib.parseImageAttributes = parser2.parseImageAttributes;
  lib.parseSimulcastStreamList = parser2.parseSimulcastStreamList;
  return lib;
}
var libExports = requireLib();
function r(r2, e2, n) {
  var i, t, o2;
  void 0 === e2 && (e2 = 50), void 0 === n && (n = {});
  var a = null != (i = n.isImmediate) && i, u = null != (t = n.callback) && t, c = n.maxWait, v = Date.now(), l = [];
  function f() {
    if (void 0 !== c) {
      var r3 = Date.now() - v;
      if (r3 + e2 >= c)
        return c - r3;
    }
    return e2;
  }
  var d = function() {
    var e3 = [].slice.call(arguments), n2 = this;
    return new Promise(function(i2, t2) {
      var c2 = a && void 0 === o2;
      if (void 0 !== o2 && clearTimeout(o2), o2 = setTimeout(function() {
        if (o2 = void 0, v = Date.now(), !a) {
          var i3 = r2.apply(n2, e3);
          u && u(i3), l.forEach(function(r3) {
            return (0, r3.resolve)(i3);
          }), l = [];
        }
      }, f()), c2) {
        var d2 = r2.apply(n2, e3);
        return u && u(d2), i2(d2);
      }
      l.push({
        resolve: i2,
        reject: t2
      });
    });
  };
  return d.cancel = function(r3) {
    void 0 !== o2 && clearTimeout(o2), l.forEach(function(e3) {
      return (0, e3.reject)(r3);
    }), l = [];
  }, d;
}
var startBitrateForSVC = 0.7;
var debounceInterval = 20;
var PCEvents = {
  NegotiationStarted: "negotiationStarted",
  NegotiationComplete: "negotiationComplete",
  RTPVideoPayloadTypes: "rtpVideoPayloadTypes"
};
var PCTransport = class extends eventsExports.EventEmitter {
  get pc() {
    if (!this._pc) {
      this._pc = this.createPC();
    }
    return this._pc;
  }
  constructor(config) {
    let loggerOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _a;
    super();
    this.log = livekitLogger;
    this.ddExtID = 0;
    this.pendingCandidates = [];
    this.restartingIce = false;
    this.renegotiate = false;
    this.trackBitrates = [];
    this.remoteStereoMids = [];
    this.remoteNackMids = [];
    this.negotiate = r((onError) => __awaiter(this, void 0, void 0, function* () {
      this.emit(PCEvents.NegotiationStarted);
      try {
        yield this.createAndSendOffer();
      } catch (e2) {
        if (onError) {
          onError(e2);
        } else {
          throw e2;
        }
      }
    }), debounceInterval);
    this.close = () => {
      if (!this._pc) {
        return;
      }
      this._pc.close();
      this._pc.onconnectionstatechange = null;
      this._pc.oniceconnectionstatechange = null;
      this._pc.onicegatheringstatechange = null;
      this._pc.ondatachannel = null;
      this._pc.onnegotiationneeded = null;
      this._pc.onsignalingstatechange = null;
      this._pc.onicecandidate = null;
      this._pc.ondatachannel = null;
      this._pc.ontrack = null;
      this._pc.onconnectionstatechange = null;
      this._pc.oniceconnectionstatechange = null;
      this._pc = null;
    };
    this.log = getLogger((_a = loggerOptions.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.PCTransport);
    this.loggerOptions = loggerOptions;
    this.config = config;
    this._pc = this.createPC();
  }
  createPC() {
    const pc = new RTCPeerConnection(this.config);
    pc.onicecandidate = (ev) => {
      var _a;
      if (!ev.candidate)
        return;
      (_a = this.onIceCandidate) === null || _a === void 0 ? void 0 : _a.call(this, ev.candidate);
    };
    pc.onicecandidateerror = (ev) => {
      var _a;
      (_a = this.onIceCandidateError) === null || _a === void 0 ? void 0 : _a.call(this, ev);
    };
    pc.oniceconnectionstatechange = () => {
      var _a;
      (_a = this.onIceConnectionStateChange) === null || _a === void 0 ? void 0 : _a.call(this, pc.iceConnectionState);
    };
    pc.onsignalingstatechange = () => {
      var _a;
      (_a = this.onSignalingStatechange) === null || _a === void 0 ? void 0 : _a.call(this, pc.signalingState);
    };
    pc.onconnectionstatechange = () => {
      var _a;
      (_a = this.onConnectionStateChange) === null || _a === void 0 ? void 0 : _a.call(this, pc.connectionState);
    };
    pc.ondatachannel = (ev) => {
      var _a;
      (_a = this.onDataChannel) === null || _a === void 0 ? void 0 : _a.call(this, ev);
    };
    pc.ontrack = (ev) => {
      var _a;
      (_a = this.onTrack) === null || _a === void 0 ? void 0 : _a.call(this, ev);
    };
    return pc;
  }
  get logContext() {
    var _a, _b;
    return Object.assign({}, (_b = (_a = this.loggerOptions).loggerContextCb) === null || _b === void 0 ? void 0 : _b.call(_a));
  }
  get isICEConnected() {
    return this._pc !== null && (this.pc.iceConnectionState === "connected" || this.pc.iceConnectionState === "completed");
  }
  addIceCandidate(candidate) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.pc.remoteDescription && !this.restartingIce) {
        return this.pc.addIceCandidate(candidate);
      }
      this.pendingCandidates.push(candidate);
    });
  }
  setRemoteDescription(sd) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      let mungedSDP = void 0;
      if (sd.type === "offer") {
        let {
          stereoMids,
          nackMids
        } = extractStereoAndNackAudioFromOffer(sd);
        this.remoteStereoMids = stereoMids;
        this.remoteNackMids = nackMids;
      } else if (sd.type === "answer") {
        const sdpParsed = libExports.parse((_a = sd.sdp) !== null && _a !== void 0 ? _a : "");
        sdpParsed.media.forEach((media) => {
          if (media.type === "audio") {
            this.trackBitrates.some((trackbr) => {
              if (!trackbr.transceiver || media.mid != trackbr.transceiver.mid) {
                return false;
              }
              let codecPayload = 0;
              media.rtp.some((rtp) => {
                if (rtp.codec.toUpperCase() === trackbr.codec.toUpperCase()) {
                  codecPayload = rtp.payload;
                  return true;
                }
                return false;
              });
              if (codecPayload === 0) {
                return true;
              }
              let fmtpFound = false;
              for (const fmtp of media.fmtp) {
                if (fmtp.payload === codecPayload) {
                  fmtp.config = fmtp.config.split(";").filter((attr) => !attr.includes("maxaveragebitrate")).join(";");
                  if (trackbr.maxbr > 0) {
                    fmtp.config += ";maxaveragebitrate=".concat(trackbr.maxbr * 1e3);
                  }
                  fmtpFound = true;
                  break;
                }
              }
              if (!fmtpFound) {
                if (trackbr.maxbr > 0) {
                  media.fmtp.push({
                    payload: codecPayload,
                    config: "maxaveragebitrate=".concat(trackbr.maxbr * 1e3)
                  });
                }
              }
              return true;
            });
          }
        });
        mungedSDP = libExports.write(sdpParsed);
      }
      yield this.setMungedSDP(sd, mungedSDP, true);
      this.pendingCandidates.forEach((candidate) => {
        this.pc.addIceCandidate(candidate);
      });
      this.pendingCandidates = [];
      this.restartingIce = false;
      if (this.renegotiate) {
        this.renegotiate = false;
        yield this.createAndSendOffer();
      } else if (sd.type === "answer") {
        this.emit(PCEvents.NegotiationComplete);
        if (sd.sdp) {
          const sdpParsed = libExports.parse(sd.sdp);
          sdpParsed.media.forEach((media) => {
            if (media.type === "video") {
              this.emit(PCEvents.RTPVideoPayloadTypes, media.rtp);
            }
          });
        }
      }
    });
  }
  createAndSendOffer(options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (this.onOffer === void 0) {
        return;
      }
      if (options === null || options === void 0 ? void 0 : options.iceRestart) {
        this.log.debug("restarting ICE", this.logContext);
        this.restartingIce = true;
      }
      if (this._pc && this._pc.signalingState === "have-local-offer") {
        const currentSD = this._pc.remoteDescription;
        if ((options === null || options === void 0 ? void 0 : options.iceRestart) && currentSD) {
          yield this._pc.setRemoteDescription(currentSD);
        } else {
          this.renegotiate = true;
          return;
        }
      } else if (!this._pc || this._pc.signalingState === "closed") {
        this.log.warn("could not createOffer with closed peer connection", this.logContext);
        return;
      }
      this.log.debug("starting to negotiate", this.logContext);
      const offer = yield this.pc.createOffer(options);
      this.log.debug("original offer", Object.assign({
        sdp: offer.sdp
      }, this.logContext));
      const sdpParsed = libExports.parse((_a = offer.sdp) !== null && _a !== void 0 ? _a : "");
      sdpParsed.media.forEach((media) => {
        ensureIPAddrMatchVersion(media);
        if (media.type === "audio") {
          ensureAudioNackAndStereo(media, [], []);
        } else if (media.type === "video") {
          this.trackBitrates.some((trackbr) => {
            if (!media.msid || !trackbr.cid || !media.msid.includes(trackbr.cid)) {
              return false;
            }
            let codecPayload = 0;
            media.rtp.some((rtp) => {
              if (rtp.codec.toUpperCase() === trackbr.codec.toUpperCase()) {
                codecPayload = rtp.payload;
                return true;
              }
              return false;
            });
            if (codecPayload === 0) {
              return true;
            }
            if (isSVCCodec(trackbr.codec)) {
              this.ensureVideoDDExtensionForSVC(media, sdpParsed);
            }
            if (trackbr.codec !== "av1") {
              return true;
            }
            const startBitrate = Math.round(trackbr.maxbr * startBitrateForSVC);
            for (const fmtp of media.fmtp) {
              if (fmtp.payload === codecPayload) {
                if (!fmtp.config.includes("x-google-start-bitrate")) {
                  fmtp.config += ";x-google-start-bitrate=".concat(startBitrate);
                }
                break;
              }
            }
            return true;
          });
        }
      });
      yield this.setMungedSDP(offer, libExports.write(sdpParsed));
      this.onOffer(offer);
    });
  }
  createAndSetAnswer() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const answer = yield this.pc.createAnswer();
      const sdpParsed = libExports.parse((_a = answer.sdp) !== null && _a !== void 0 ? _a : "");
      sdpParsed.media.forEach((media) => {
        ensureIPAddrMatchVersion(media);
        if (media.type === "audio") {
          ensureAudioNackAndStereo(media, this.remoteStereoMids, this.remoteNackMids);
        }
      });
      yield this.setMungedSDP(answer, libExports.write(sdpParsed));
      return answer;
    });
  }
  createDataChannel(label, dataChannelDict) {
    return this.pc.createDataChannel(label, dataChannelDict);
  }
  addTransceiver(mediaStreamTrack, transceiverInit) {
    return this.pc.addTransceiver(mediaStreamTrack, transceiverInit);
  }
  addTrack(track) {
    if (!this._pc) {
      throw new UnexpectedConnectionState("PC closed, cannot add track");
    }
    return this._pc.addTrack(track);
  }
  setTrackCodecBitrate(info) {
    this.trackBitrates.push(info);
  }
  setConfiguration(rtcConfig) {
    var _a;
    if (!this._pc) {
      throw new UnexpectedConnectionState("PC closed, cannot configure");
    }
    return (_a = this._pc) === null || _a === void 0 ? void 0 : _a.setConfiguration(rtcConfig);
  }
  canRemoveTrack() {
    var _a;
    return !!((_a = this._pc) === null || _a === void 0 ? void 0 : _a.removeTrack);
  }
  removeTrack(sender) {
    var _a;
    return (_a = this._pc) === null || _a === void 0 ? void 0 : _a.removeTrack(sender);
  }
  getConnectionState() {
    var _a, _b;
    return (_b = (_a = this._pc) === null || _a === void 0 ? void 0 : _a.connectionState) !== null && _b !== void 0 ? _b : "closed";
  }
  getICEConnectionState() {
    var _a, _b;
    return (_b = (_a = this._pc) === null || _a === void 0 ? void 0 : _a.iceConnectionState) !== null && _b !== void 0 ? _b : "closed";
  }
  getSignallingState() {
    var _a, _b;
    return (_b = (_a = this._pc) === null || _a === void 0 ? void 0 : _a.signalingState) !== null && _b !== void 0 ? _b : "closed";
  }
  getTransceivers() {
    var _a, _b;
    return (_b = (_a = this._pc) === null || _a === void 0 ? void 0 : _a.getTransceivers()) !== null && _b !== void 0 ? _b : [];
  }
  getSenders() {
    var _a, _b;
    return (_b = (_a = this._pc) === null || _a === void 0 ? void 0 : _a.getSenders()) !== null && _b !== void 0 ? _b : [];
  }
  getLocalDescription() {
    var _a;
    return (_a = this._pc) === null || _a === void 0 ? void 0 : _a.localDescription;
  }
  getRemoteDescription() {
    var _a;
    return (_a = this.pc) === null || _a === void 0 ? void 0 : _a.remoteDescription;
  }
  getStats() {
    return this.pc.getStats();
  }
  getConnectedAddress() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (!this._pc) {
        return;
      }
      let selectedCandidatePairId = "";
      const candidatePairs = /* @__PURE__ */ new Map();
      const candidates = /* @__PURE__ */ new Map();
      const stats = yield this._pc.getStats();
      stats.forEach((v) => {
        switch (v.type) {
          case "transport":
            selectedCandidatePairId = v.selectedCandidatePairId;
            break;
          case "candidate-pair":
            if (selectedCandidatePairId === "" && v.selected) {
              selectedCandidatePairId = v.id;
            }
            candidatePairs.set(v.id, v);
            break;
          case "remote-candidate":
            candidates.set(v.id, "".concat(v.address, ":").concat(v.port));
            break;
        }
      });
      if (selectedCandidatePairId === "") {
        return void 0;
      }
      const selectedID = (_a = candidatePairs.get(selectedCandidatePairId)) === null || _a === void 0 ? void 0 : _a.remoteCandidateId;
      if (selectedID === void 0) {
        return void 0;
      }
      return candidates.get(selectedID);
    });
  }
  setMungedSDP(sd, munged, remote) {
    return __awaiter(this, void 0, void 0, function* () {
      if (munged) {
        const originalSdp = sd.sdp;
        sd.sdp = munged;
        try {
          this.log.debug("setting munged ".concat(remote ? "remote" : "local", " description"), this.logContext);
          if (remote) {
            yield this.pc.setRemoteDescription(sd);
          } else {
            yield this.pc.setLocalDescription(sd);
          }
          return;
        } catch (e2) {
          this.log.warn("not able to set ".concat(sd.type, ", falling back to unmodified sdp"), Object.assign(Object.assign({}, this.logContext), {
            error: e2,
            sdp: munged
          }));
          sd.sdp = originalSdp;
        }
      }
      try {
        if (remote) {
          yield this.pc.setRemoteDescription(sd);
        } else {
          yield this.pc.setLocalDescription(sd);
        }
      } catch (e2) {
        let msg = "unknown error";
        if (e2 instanceof Error) {
          msg = e2.message;
        } else if (typeof e2 === "string") {
          msg = e2;
        }
        const fields = {
          error: msg,
          sdp: sd.sdp
        };
        if (!remote && this.pc.remoteDescription) {
          fields.remoteSdp = this.pc.remoteDescription;
        }
        this.log.error("unable to set ".concat(sd.type), Object.assign(Object.assign({}, this.logContext), {
          fields
        }));
        throw new NegotiationError(msg);
      }
    });
  }
  ensureVideoDDExtensionForSVC(media, sdp2) {
    var _a, _b;
    const ddFound = (_a = media.ext) === null || _a === void 0 ? void 0 : _a.some((ext) => {
      if (ext.uri === ddExtensionURI) {
        return true;
      }
      return false;
    });
    if (!ddFound) {
      if (this.ddExtID === 0) {
        let maxID = 0;
        sdp2.media.forEach((m) => {
          var _a2;
          if (m.type !== "video") {
            return;
          }
          (_a2 = m.ext) === null || _a2 === void 0 ? void 0 : _a2.forEach((ext) => {
            if (ext.value > maxID) {
              maxID = ext.value;
            }
          });
        });
        this.ddExtID = maxID + 1;
      }
      (_b = media.ext) === null || _b === void 0 ? void 0 : _b.push({
        value: this.ddExtID,
        uri: ddExtensionURI
      });
    }
  }
};
function ensureAudioNackAndStereo(media, stereoMids, nackMids) {
  let opusPayload = 0;
  media.rtp.some((rtp) => {
    if (rtp.codec === "opus") {
      opusPayload = rtp.payload;
      return true;
    }
    return false;
  });
  if (opusPayload > 0) {
    if (!media.rtcpFb) {
      media.rtcpFb = [];
    }
    if (nackMids.includes(media.mid) && !media.rtcpFb.some((fb) => fb.payload === opusPayload && fb.type === "nack")) {
      media.rtcpFb.push({
        payload: opusPayload,
        type: "nack"
      });
    }
    if (stereoMids.includes(media.mid)) {
      media.fmtp.some((fmtp) => {
        if (fmtp.payload === opusPayload) {
          if (!fmtp.config.includes("stereo=1")) {
            fmtp.config += ";stereo=1";
          }
          return true;
        }
        return false;
      });
    }
  }
}
function extractStereoAndNackAudioFromOffer(offer) {
  var _a;
  const stereoMids = [];
  const nackMids = [];
  const sdpParsed = libExports.parse((_a = offer.sdp) !== null && _a !== void 0 ? _a : "");
  let opusPayload = 0;
  sdpParsed.media.forEach((media) => {
    var _a2;
    if (media.type === "audio") {
      media.rtp.some((rtp) => {
        if (rtp.codec === "opus") {
          opusPayload = rtp.payload;
          return true;
        }
        return false;
      });
      if ((_a2 = media.rtcpFb) === null || _a2 === void 0 ? void 0 : _a2.some((fb) => fb.payload === opusPayload && fb.type === "nack")) {
        nackMids.push(media.mid);
      }
      media.fmtp.some((fmtp) => {
        if (fmtp.payload === opusPayload) {
          if (fmtp.config.includes("sprop-stereo=1")) {
            stereoMids.push(media.mid);
          }
          return true;
        }
        return false;
      });
    }
  });
  return {
    stereoMids,
    nackMids
  };
}
function ensureIPAddrMatchVersion(media) {
  if (media.connection) {
    const isV6 = media.connection.ip.indexOf(":") >= 0;
    if (media.connection.version === 4 && isV6 || media.connection.version === 6 && !isV6) {
      media.connection.ip = "0.0.0.0";
      media.connection.version = 4;
    }
  }
}
var defaultVideoCodec = "vp8";
var publishDefaults = {
  audioPreset: AudioPresets.music,
  dtx: true,
  red: true,
  forceStereo: false,
  simulcast: true,
  screenShareEncoding: ScreenSharePresets.h1080fps15.encoding,
  stopMicTrackOnMute: false,
  videoCodec: defaultVideoCodec,
  backupCodec: true
};
var audioDefaults = {
  deviceId: "default",
  autoGainControl: true,
  echoCancellation: true,
  noiseSuppression: true,
  voiceIsolation: true
};
var videoDefaults = {
  deviceId: "default",
  resolution: VideoPresets.h720.resolution
};
var roomOptionDefaults = {
  adaptiveStream: false,
  dynacast: false,
  stopLocalTrackOnUnpublish: true,
  reconnectPolicy: new DefaultReconnectPolicy(),
  disconnectOnPageLeave: true,
  webAudioMix: false
};
var roomConnectOptionDefaults = {
  autoSubscribe: true,
  maxRetries: 1,
  peerConnectionTimeout: 15e3,
  websocketTimeout: 15e3
};
var PCTransportState;
(function(PCTransportState2) {
  PCTransportState2[PCTransportState2["NEW"] = 0] = "NEW";
  PCTransportState2[PCTransportState2["CONNECTING"] = 1] = "CONNECTING";
  PCTransportState2[PCTransportState2["CONNECTED"] = 2] = "CONNECTED";
  PCTransportState2[PCTransportState2["FAILED"] = 3] = "FAILED";
  PCTransportState2[PCTransportState2["CLOSING"] = 4] = "CLOSING";
  PCTransportState2[PCTransportState2["CLOSED"] = 5] = "CLOSED";
})(PCTransportState || (PCTransportState = {}));
var PCTransportManager = class {
  get needsPublisher() {
    return this.isPublisherConnectionRequired;
  }
  get needsSubscriber() {
    return this.isSubscriberConnectionRequired;
  }
  get currentState() {
    return this.state;
  }
  constructor(rtcConfig, subscriberPrimary, loggerOptions) {
    var _a;
    this.peerConnectionTimeout = roomConnectOptionDefaults.peerConnectionTimeout;
    this.log = livekitLogger;
    this.updateState = () => {
      var _a2;
      const previousState = this.state;
      const connectionStates = this.requiredTransports.map((tr) => tr.getConnectionState());
      if (connectionStates.every((st) => st === "connected")) {
        this.state = PCTransportState.CONNECTED;
      } else if (connectionStates.some((st) => st === "failed")) {
        this.state = PCTransportState.FAILED;
      } else if (connectionStates.some((st) => st === "connecting")) {
        this.state = PCTransportState.CONNECTING;
      } else if (connectionStates.every((st) => st === "closed")) {
        this.state = PCTransportState.CLOSED;
      } else if (connectionStates.some((st) => st === "closed")) {
        this.state = PCTransportState.CLOSING;
      } else if (connectionStates.every((st) => st === "new")) {
        this.state = PCTransportState.NEW;
      }
      if (previousState !== this.state) {
        this.log.debug("pc state change: from ".concat(PCTransportState[previousState], " to ").concat(PCTransportState[this.state]), this.logContext);
        (_a2 = this.onStateChange) === null || _a2 === void 0 ? void 0 : _a2.call(this, this.state, this.publisher.getConnectionState(), this.subscriber.getConnectionState());
      }
    };
    this.log = getLogger((_a = loggerOptions.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.PCManager);
    this.loggerOptions = loggerOptions;
    this.isPublisherConnectionRequired = !subscriberPrimary;
    this.isSubscriberConnectionRequired = subscriberPrimary;
    this.publisher = new PCTransport(rtcConfig, loggerOptions);
    this.subscriber = new PCTransport(rtcConfig, loggerOptions);
    this.publisher.onConnectionStateChange = this.updateState;
    this.subscriber.onConnectionStateChange = this.updateState;
    this.publisher.onIceConnectionStateChange = this.updateState;
    this.subscriber.onIceConnectionStateChange = this.updateState;
    this.publisher.onSignalingStatechange = this.updateState;
    this.subscriber.onSignalingStatechange = this.updateState;
    this.publisher.onIceCandidate = (candidate) => {
      var _a2;
      (_a2 = this.onIceCandidate) === null || _a2 === void 0 ? void 0 : _a2.call(this, candidate, SignalTarget.PUBLISHER);
    };
    this.subscriber.onIceCandidate = (candidate) => {
      var _a2;
      (_a2 = this.onIceCandidate) === null || _a2 === void 0 ? void 0 : _a2.call(this, candidate, SignalTarget.SUBSCRIBER);
    };
    this.subscriber.onDataChannel = (ev) => {
      var _a2;
      (_a2 = this.onDataChannel) === null || _a2 === void 0 ? void 0 : _a2.call(this, ev);
    };
    this.subscriber.onTrack = (ev) => {
      var _a2;
      (_a2 = this.onTrack) === null || _a2 === void 0 ? void 0 : _a2.call(this, ev);
    };
    this.publisher.onOffer = (offer) => {
      var _a2;
      (_a2 = this.onPublisherOffer) === null || _a2 === void 0 ? void 0 : _a2.call(this, offer);
    };
    this.state = PCTransportState.NEW;
    this.connectionLock = new _();
    this.remoteOfferLock = new _();
  }
  get logContext() {
    var _a, _b;
    return Object.assign({}, (_b = (_a = this.loggerOptions).loggerContextCb) === null || _b === void 0 ? void 0 : _b.call(_a));
  }
  requirePublisher() {
    let require2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    this.isPublisherConnectionRequired = require2;
    this.updateState();
  }
  requireSubscriber() {
    let require2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    this.isSubscriberConnectionRequired = require2;
    this.updateState();
  }
  createAndSendPublisherOffer(options) {
    return this.publisher.createAndSendOffer(options);
  }
  setPublisherAnswer(sd) {
    return this.publisher.setRemoteDescription(sd);
  }
  removeTrack(sender) {
    return this.publisher.removeTrack(sender);
  }
  close() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.publisher && this.publisher.getSignallingState() !== "closed") {
        const publisher = this.publisher;
        for (const sender of publisher.getSenders()) {
          try {
            if (publisher.canRemoveTrack()) {
              publisher.removeTrack(sender);
            }
          } catch (e2) {
            this.log.warn("could not removeTrack", Object.assign(Object.assign({}, this.logContext), {
              error: e2
            }));
          }
        }
      }
      yield Promise.all([this.publisher.close(), this.subscriber.close()]);
      this.updateState();
    });
  }
  triggerIceRestart() {
    return __awaiter(this, void 0, void 0, function* () {
      this.subscriber.restartingIce = true;
      if (this.needsPublisher) {
        yield this.createAndSendPublisherOffer({
          iceRestart: true
        });
      }
    });
  }
  addIceCandidate(candidate, target) {
    return __awaiter(this, void 0, void 0, function* () {
      if (target === SignalTarget.PUBLISHER) {
        yield this.publisher.addIceCandidate(candidate);
      } else {
        yield this.subscriber.addIceCandidate(candidate);
      }
    });
  }
  createSubscriberAnswerFromOffer(sd) {
    return __awaiter(this, void 0, void 0, function* () {
      this.log.debug("received server offer", Object.assign(Object.assign({}, this.logContext), {
        RTCSdpType: sd.type,
        sdp: sd.sdp,
        signalingState: this.subscriber.getSignallingState().toString()
      }));
      const unlock = yield this.remoteOfferLock.lock();
      try {
        yield this.subscriber.setRemoteDescription(sd);
        const answer = yield this.subscriber.createAndSetAnswer();
        return answer;
      } finally {
        unlock();
      }
    });
  }
  updateConfiguration(config, iceRestart) {
    this.publisher.setConfiguration(config);
    this.subscriber.setConfiguration(config);
    if (iceRestart) {
      this.triggerIceRestart();
    }
  }
  ensurePCTransportConnection(abortController, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const unlock = yield this.connectionLock.lock();
      try {
        if (this.isPublisherConnectionRequired && this.publisher.getConnectionState() !== "connected" && this.publisher.getConnectionState() !== "connecting") {
          this.log.debug("negotiation required, start negotiating", this.logContext);
          this.publisher.negotiate();
        }
        yield Promise.all((_a = this.requiredTransports) === null || _a === void 0 ? void 0 : _a.map((transport) => this.ensureTransportConnected(transport, abortController, timeout)));
      } finally {
        unlock();
      }
    });
  }
  negotiate(abortController) {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const negotiationTimeout = setTimeout(() => {
          reject("negotiation timed out");
        }, this.peerConnectionTimeout);
        const abortHandler = () => {
          clearTimeout(negotiationTimeout);
          reject("negotiation aborted");
        };
        abortController.signal.addEventListener("abort", abortHandler);
        this.publisher.once(PCEvents.NegotiationStarted, () => {
          if (abortController.signal.aborted) {
            return;
          }
          this.publisher.once(PCEvents.NegotiationComplete, () => {
            clearTimeout(negotiationTimeout);
            resolve();
          });
        });
        yield this.publisher.negotiate((e2) => {
          clearTimeout(negotiationTimeout);
          reject(e2);
        });
      }));
    });
  }
  addPublisherTransceiver(track, transceiverInit) {
    return this.publisher.addTransceiver(track, transceiverInit);
  }
  addPublisherTrack(track) {
    return this.publisher.addTrack(track);
  }
  createPublisherDataChannel(label, dataChannelDict) {
    return this.publisher.createDataChannel(label, dataChannelDict);
  }
  /**
   * Returns the first required transport's address if no explicit target is specified
   */
  getConnectedAddress(target) {
    if (target === SignalTarget.PUBLISHER) {
      return this.publisher.getConnectedAddress();
    } else if (target === SignalTarget.SUBSCRIBER) {
      return this.publisher.getConnectedAddress();
    }
    return this.requiredTransports[0].getConnectedAddress();
  }
  get requiredTransports() {
    const transports = [];
    if (this.isPublisherConnectionRequired) {
      transports.push(this.publisher);
    }
    if (this.isSubscriberConnectionRequired) {
      transports.push(this.subscriber);
    }
    return transports;
  }
  ensureTransportConnected(pcTransport_1, abortController_1) {
    return __awaiter(this, arguments, void 0, function(pcTransport, abortController) {
      var _this = this;
      let timeout = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.peerConnectionTimeout;
      return function* () {
        const connectionState = pcTransport.getConnectionState();
        if (connectionState === "connected") {
          return;
        }
        return new Promise((resolve, reject) => __awaiter(_this, void 0, void 0, function* () {
          const abortHandler = () => {
            this.log.warn("abort transport connection", this.logContext);
            CriticalTimers.clearTimeout(connectTimeout);
            reject(new ConnectionError("room connection has been cancelled", ConnectionErrorReason.Cancelled));
          };
          if (abortController === null || abortController === void 0 ? void 0 : abortController.signal.aborted) {
            abortHandler();
          }
          abortController === null || abortController === void 0 ? void 0 : abortController.signal.addEventListener("abort", abortHandler);
          const connectTimeout = CriticalTimers.setTimeout(() => {
            abortController === null || abortController === void 0 ? void 0 : abortController.signal.removeEventListener("abort", abortHandler);
            reject(new ConnectionError("could not establish pc connection", ConnectionErrorReason.InternalError));
          }, timeout);
          while (this.state !== PCTransportState.CONNECTED) {
            yield sleep(50);
            if (abortController === null || abortController === void 0 ? void 0 : abortController.signal.aborted) {
              reject(new ConnectionError("room connection has been cancelled", ConnectionErrorReason.Cancelled));
              return;
            }
          }
          CriticalTimers.clearTimeout(connectTimeout);
          abortController === null || abortController === void 0 ? void 0 : abortController.signal.removeEventListener("abort", abortHandler);
          resolve();
        }));
      }();
    });
  }
};
var RpcError = class _RpcError extends Error {
  /**
   * Creates an error object with the given code and message, plus an optional data payload.
   *
   * If thrown in an RPC method handler, the error will be sent back to the caller.
   *
   * Error codes 1001-1999 are reserved for built-in errors (see RpcError.ErrorCode for their meanings).
   */
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.message = truncateBytes(message, _RpcError.MAX_MESSAGE_BYTES);
    this.data = data ? truncateBytes(data, _RpcError.MAX_DATA_BYTES) : void 0;
  }
  /**
   * @internal
   */
  static fromProto(proto) {
    return new _RpcError(proto.code, proto.message, proto.data);
  }
  /**
   * @internal
   */
  toProto() {
    return new RpcError$1({
      code: this.code,
      message: this.message,
      data: this.data
    });
  }
  /**
   * Creates an error object from the code, with an auto-populated message.
   *
   * @internal
   */
  static builtIn(key, data) {
    return new _RpcError(_RpcError.ErrorCode[key], _RpcError.ErrorMessage[key], data);
  }
};
RpcError.MAX_MESSAGE_BYTES = 256;
RpcError.MAX_DATA_BYTES = 15360;
RpcError.ErrorCode = {
  APPLICATION_ERROR: 1500,
  CONNECTION_TIMEOUT: 1501,
  RESPONSE_TIMEOUT: 1502,
  RECIPIENT_DISCONNECTED: 1503,
  RESPONSE_PAYLOAD_TOO_LARGE: 1504,
  SEND_FAILED: 1505,
  UNSUPPORTED_METHOD: 1400,
  RECIPIENT_NOT_FOUND: 1401,
  REQUEST_PAYLOAD_TOO_LARGE: 1402,
  UNSUPPORTED_SERVER: 1403,
  UNSUPPORTED_VERSION: 1404
};
RpcError.ErrorMessage = {
  APPLICATION_ERROR: "Application error in method handler",
  CONNECTION_TIMEOUT: "Connection timeout",
  RESPONSE_TIMEOUT: "Response timeout",
  RECIPIENT_DISCONNECTED: "Recipient disconnected",
  RESPONSE_PAYLOAD_TOO_LARGE: "Response payload too large",
  SEND_FAILED: "Failed to send",
  UNSUPPORTED_METHOD: "Method not supported at destination",
  RECIPIENT_NOT_FOUND: "Recipient not found",
  REQUEST_PAYLOAD_TOO_LARGE: "Request payload too large",
  UNSUPPORTED_SERVER: "RPC not supported by server",
  UNSUPPORTED_VERSION: "Unsupported RPC version"
};
var MAX_PAYLOAD_BYTES = 15360;
function byteLength(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str).length;
}
function truncateBytes(str, maxBytes) {
  if (byteLength(str) <= maxBytes) {
    return str;
  }
  let low = 0;
  let high = str.length;
  const encoder = new TextEncoder();
  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    if (encoder.encode(str.slice(0, mid)).length <= maxBytes) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return str.slice(0, low);
}
var monitorFrequency = 2e3;
function computeBitrate(currentStats, prevStats) {
  if (!prevStats) {
    return 0;
  }
  let bytesNow;
  let bytesPrev;
  if ("bytesReceived" in currentStats) {
    bytesNow = currentStats.bytesReceived;
    bytesPrev = prevStats.bytesReceived;
  } else if ("bytesSent" in currentStats) {
    bytesNow = currentStats.bytesSent;
    bytesPrev = prevStats.bytesSent;
  }
  if (bytesNow === void 0 || bytesPrev === void 0 || currentStats.timestamp === void 0 || prevStats.timestamp === void 0) {
    return 0;
  }
  return (bytesNow - bytesPrev) * 8 * 1e3 / (currentStats.timestamp - prevStats.timestamp);
}
var defaultDimensionsTimeout = 1e3;
var LocalTrack = class extends Track {
  /** @internal */
  get sender() {
    return this._sender;
  }
  /** @internal */
  set sender(sender) {
    this._sender = sender;
  }
  get constraints() {
    return this._constraints;
  }
  /**
   *
   * @param mediaTrack
   * @param kind
   * @param constraints MediaTrackConstraints that are being used when restarting or reacquiring tracks
   * @param userProvidedTrack Signals to the SDK whether or not the mediaTrack should be managed (i.e. released and reacquired) internally by the SDK
   */
  constructor(mediaTrack, kind, constraints) {
    let userProvidedTrack = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    let loggerOptions = arguments.length > 4 ? arguments[4] : void 0;
    super(mediaTrack, kind, loggerOptions);
    this.manuallyStopped = false;
    this._isUpstreamPaused = false;
    this.handleTrackMuteEvent = () => this.debouncedTrackMuteHandler().catch(() => this.log.debug("track mute bounce got cancelled by an unmute event", this.logContext));
    this.debouncedTrackMuteHandler = r(() => __awaiter(this, void 0, void 0, function* () {
      yield this.pauseUpstream();
    }), 5e3);
    this.handleTrackUnmuteEvent = () => __awaiter(this, void 0, void 0, function* () {
      this.debouncedTrackMuteHandler.cancel("unmute");
      yield this.resumeUpstream();
    });
    this.handleEnded = () => {
      if (this.isInBackground) {
        this.reacquireTrack = true;
      }
      this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent);
      this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent);
      this.emit(TrackEvent.Ended, this);
    };
    this.reacquireTrack = false;
    this.providedByUser = userProvidedTrack;
    this.muteLock = new _();
    this.pauseUpstreamLock = new _();
    this.processorLock = new _();
    this.restartLock = new _();
    this.setMediaStreamTrack(mediaTrack, true);
    this._constraints = mediaTrack.getConstraints();
    if (constraints) {
      this._constraints = constraints;
    }
  }
  get id() {
    return this._mediaStreamTrack.id;
  }
  get dimensions() {
    if (this.kind !== Track.Kind.Video) {
      return void 0;
    }
    const {
      width,
      height
    } = this._mediaStreamTrack.getSettings();
    if (width && height) {
      return {
        width,
        height
      };
    }
    return void 0;
  }
  get isUpstreamPaused() {
    return this._isUpstreamPaused;
  }
  get isUserProvided() {
    return this.providedByUser;
  }
  get mediaStreamTrack() {
    var _a, _b;
    return (_b = (_a = this.processor) === null || _a === void 0 ? void 0 : _a.processedTrack) !== null && _b !== void 0 ? _b : this._mediaStreamTrack;
  }
  get isLocal() {
    return true;
  }
  /**
   * @internal
   * returns mediaStreamTrack settings of the capturing mediastreamtrack source - ignoring processors
   */
  getSourceTrackSettings() {
    return this._mediaStreamTrack.getSettings();
  }
  setMediaStreamTrack(newTrack, force) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (newTrack === this._mediaStreamTrack && !force) {
        return;
      }
      if (this._mediaStreamTrack) {
        this.attachedElements.forEach((el) => {
          detachTrack(this._mediaStreamTrack, el);
        });
        this.debouncedTrackMuteHandler.cancel("new-track");
        this._mediaStreamTrack.removeEventListener("ended", this.handleEnded);
        this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent);
        this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent);
      }
      this.mediaStream = new MediaStream([newTrack]);
      if (newTrack) {
        newTrack.addEventListener("ended", this.handleEnded);
        newTrack.addEventListener("mute", this.handleTrackMuteEvent);
        newTrack.addEventListener("unmute", this.handleTrackUnmuteEvent);
        this._constraints = newTrack.getConstraints();
      }
      let processedTrack;
      if (this.processor && newTrack) {
        const unlock = yield this.processorLock.lock();
        try {
          this.log.debug("restarting processor", this.logContext);
          if (this.kind === "unknown") {
            throw TypeError("cannot set processor on track of unknown kind");
          }
          if (this.processorElement) {
            attachToElement(newTrack, this.processorElement);
            this.processorElement.muted = true;
          }
          yield this.processor.restart({
            track: newTrack,
            kind: this.kind,
            element: this.processorElement
          });
          processedTrack = this.processor.processedTrack;
        } finally {
          unlock();
        }
      }
      if (this.sender && ((_a = this.sender.transport) === null || _a === void 0 ? void 0 : _a.state) !== "closed") {
        yield this.sender.replaceTrack(processedTrack !== null && processedTrack !== void 0 ? processedTrack : newTrack);
      }
      if (!this.providedByUser && this._mediaStreamTrack !== newTrack) {
        this._mediaStreamTrack.stop();
      }
      this._mediaStreamTrack = newTrack;
      if (newTrack) {
        this._mediaStreamTrack.enabled = !this.isMuted;
        yield this.resumeUpstream();
        this.attachedElements.forEach((el) => {
          attachToElement(processedTrack !== null && processedTrack !== void 0 ? processedTrack : newTrack, el);
        });
      }
    });
  }
  waitForDimensions() {
    return __awaiter(this, arguments, void 0, function() {
      var _this = this;
      let timeout = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : defaultDimensionsTimeout;
      return function* () {
        var _a;
        if (_this.kind === Track.Kind.Audio) {
          throw new Error("cannot get dimensions for audio tracks");
        }
        if (((_a = getBrowser()) === null || _a === void 0 ? void 0 : _a.os) === "iOS") {
          yield sleep(10);
        }
        const started = Date.now();
        while (Date.now() - started < timeout) {
          const dims = _this.dimensions;
          if (dims) {
            return dims;
          }
          yield sleep(50);
        }
        throw new TrackInvalidError("unable to get track dimensions after timeout");
      }();
    });
  }
  setDeviceId(deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._constraints.deviceId === deviceId && this._mediaStreamTrack.getSettings().deviceId === unwrapConstraint(deviceId)) {
        return true;
      }
      this._constraints.deviceId = deviceId;
      if (this.isMuted) {
        return true;
      }
      yield this.restartTrack();
      return unwrapConstraint(deviceId) === this._mediaStreamTrack.getSettings().deviceId;
    });
  }
  /**
   * @returns DeviceID of the device that is currently being used for this track
   */
  getDeviceId() {
    return __awaiter(this, arguments, void 0, function() {
      var _this2 = this;
      let normalize = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      return function* () {
        if (_this2.source === Track.Source.ScreenShare) {
          return;
        }
        const {
          deviceId,
          groupId
        } = _this2._mediaStreamTrack.getSettings();
        const kind = _this2.kind === Track.Kind.Audio ? "audioinput" : "videoinput";
        return normalize ? DeviceManager.getInstance().normalizeDeviceId(kind, deviceId, groupId) : deviceId;
      }();
    });
  }
  mute() {
    return __awaiter(this, void 0, void 0, function* () {
      this.setTrackMuted(true);
      return this;
    });
  }
  unmute() {
    return __awaiter(this, void 0, void 0, function* () {
      this.setTrackMuted(false);
      return this;
    });
  }
  replaceTrack(track, userProvidedOrOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.sender) {
        throw new TrackInvalidError("unable to replace an unpublished track");
      }
      let userProvidedTrack;
      let stopProcessor;
      if (typeof userProvidedOrOptions === "boolean") {
        userProvidedTrack = userProvidedOrOptions;
      } else if (userProvidedOrOptions !== void 0) {
        userProvidedTrack = userProvidedOrOptions.userProvidedTrack;
        stopProcessor = userProvidedOrOptions.stopProcessor;
      }
      this.providedByUser = userProvidedTrack !== null && userProvidedTrack !== void 0 ? userProvidedTrack : true;
      this.log.debug("replace MediaStreamTrack", this.logContext);
      yield this.setMediaStreamTrack(track);
      if (stopProcessor && this.processor) {
        yield this.stopProcessor();
      }
      return this;
    });
  }
  restart(constraints) {
    return __awaiter(this, void 0, void 0, function* () {
      this.manuallyStopped = false;
      const unlock = yield this.restartLock.lock();
      try {
        if (!constraints) {
          constraints = this._constraints;
        }
        this.log.debug("restarting track with constraints", Object.assign(Object.assign({}, this.logContext), {
          constraints
        }));
        const streamConstraints = {
          audio: false,
          video: false
        };
        if (this.kind === Track.Kind.Video) {
          streamConstraints.video = constraints;
        } else {
          streamConstraints.audio = constraints;
        }
        this.attachedElements.forEach((el) => {
          detachTrack(this.mediaStreamTrack, el);
        });
        this._mediaStreamTrack.removeEventListener("ended", this.handleEnded);
        this._mediaStreamTrack.stop();
        const mediaStream = yield navigator.mediaDevices.getUserMedia(streamConstraints);
        const newTrack = mediaStream.getTracks()[0];
        newTrack.addEventListener("ended", this.handleEnded);
        this.log.debug("re-acquired MediaStreamTrack", this.logContext);
        yield this.setMediaStreamTrack(newTrack);
        this._constraints = constraints;
        this.emit(TrackEvent.Restarted, this);
        if (this.manuallyStopped) {
          this.log.warn("track was stopped during a restart, stopping restarted track", this.logContext);
          this.stop();
        }
        return this;
      } finally {
        unlock();
      }
    });
  }
  setTrackMuted(muted) {
    this.log.debug("setting ".concat(this.kind, " track ").concat(muted ? "muted" : "unmuted"), this.logContext);
    if (this.isMuted === muted && this._mediaStreamTrack.enabled !== muted) {
      return;
    }
    this.isMuted = muted;
    this._mediaStreamTrack.enabled = !muted;
    this.emit(muted ? TrackEvent.Muted : TrackEvent.Unmuted, this);
  }
  get needsReAcquisition() {
    return this._mediaStreamTrack.readyState !== "live" || this._mediaStreamTrack.muted || !this._mediaStreamTrack.enabled || this.reacquireTrack;
  }
  handleAppVisibilityChanged() {
    const _super = Object.create(null, {
      handleAppVisibilityChanged: {
        get: () => super.handleAppVisibilityChanged
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      yield _super.handleAppVisibilityChanged.call(this);
      if (!isMobile())
        return;
      this.log.debug("visibility changed, is in Background: ".concat(this.isInBackground), this.logContext);
      if (!this.isInBackground && this.needsReAcquisition && !this.isUserProvided && !this.isMuted) {
        this.log.debug("track needs to be reacquired, restarting ".concat(this.source), this.logContext);
        yield this.restart();
        this.reacquireTrack = false;
      }
    });
  }
  stop() {
    var _a;
    this.manuallyStopped = true;
    super.stop();
    this._mediaStreamTrack.removeEventListener("ended", this.handleEnded);
    this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent);
    this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent);
    (_a = this.processor) === null || _a === void 0 ? void 0 : _a.destroy();
    this.processor = void 0;
  }
  /**
   * pauses publishing to the server without disabling the local MediaStreamTrack
   * this is used to display a user's own video locally while pausing publishing to
   * the server.
   * this API is unsupported on Safari < 12 due to a bug
   **/
  pauseUpstream() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const unlock = yield this.pauseUpstreamLock.lock();
      try {
        if (this._isUpstreamPaused === true) {
          return;
        }
        if (!this.sender) {
          this.log.warn("unable to pause upstream for an unpublished track", this.logContext);
          return;
        }
        this._isUpstreamPaused = true;
        this.emit(TrackEvent.UpstreamPaused, this);
        const browser = getBrowser();
        if ((browser === null || browser === void 0 ? void 0 : browser.name) === "Safari" && compareVersions(browser.version, "12.0") < 0) {
          throw new DeviceUnsupportedError("pauseUpstream is not supported on Safari < 12.");
        }
        if (((_a = this.sender.transport) === null || _a === void 0 ? void 0 : _a.state) !== "closed") {
          yield this.sender.replaceTrack(null);
        }
      } finally {
        unlock();
      }
    });
  }
  resumeUpstream() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const unlock = yield this.pauseUpstreamLock.lock();
      try {
        if (this._isUpstreamPaused === false) {
          return;
        }
        if (!this.sender) {
          this.log.warn("unable to resume upstream for an unpublished track", this.logContext);
          return;
        }
        this._isUpstreamPaused = false;
        this.emit(TrackEvent.UpstreamResumed, this);
        if (((_a = this.sender.transport) === null || _a === void 0 ? void 0 : _a.state) !== "closed") {
          yield this.sender.replaceTrack(this.mediaStreamTrack);
        }
      } finally {
        unlock();
      }
    });
  }
  /**
   * Gets the RTCStatsReport for the LocalTrack's underlying RTCRtpSender
   * See https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsReport
   *
   * @returns Promise<RTCStatsReport> | undefined
   */
  getRTCStatsReport() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (!((_a = this.sender) === null || _a === void 0 ? void 0 : _a.getStats)) {
        return;
      }
      const statsReport = yield this.sender.getStats();
      return statsReport;
    });
  }
  /**
   * Sets a processor on this track.
   * See https://github.com/livekit/track-processors-js for example usage
   *
   * @experimental
   *
   * @param processor
   * @param showProcessedStreamLocally
   * @returns
   */
  setProcessor(processor_1) {
    return __awaiter(this, arguments, void 0, function(processor) {
      var _this3 = this;
      let showProcessedStreamLocally = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return function* () {
        var _a;
        const unlock = yield _this3.processorLock.lock();
        try {
          _this3.log.debug("setting up processor", _this3.logContext);
          const processorElement = document.createElement(_this3.kind);
          const processorOptions = {
            kind: _this3.kind,
            track: _this3._mediaStreamTrack,
            element: processorElement,
            audioContext: _this3.audioContext
          };
          yield processor.init(processorOptions);
          _this3.log.debug("processor initialized", _this3.logContext);
          if (_this3.processor) {
            yield _this3.stopProcessor();
          }
          if (_this3.kind === "unknown") {
            throw TypeError("cannot set processor on track of unknown kind");
          }
          attachToElement(_this3._mediaStreamTrack, processorElement);
          processorElement.muted = true;
          processorElement.play().catch((error) => _this3.log.error("failed to play processor element", Object.assign(Object.assign({}, _this3.logContext), {
            error
          })));
          _this3.processor = processor;
          _this3.processorElement = processorElement;
          if (_this3.processor.processedTrack) {
            for (const el of _this3.attachedElements) {
              if (el !== _this3.processorElement && showProcessedStreamLocally) {
                detachTrack(_this3._mediaStreamTrack, el);
                attachToElement(_this3.processor.processedTrack, el);
              }
            }
            yield (_a = _this3.sender) === null || _a === void 0 ? void 0 : _a.replaceTrack(_this3.processor.processedTrack);
          }
          _this3.emit(TrackEvent.TrackProcessorUpdate, _this3.processor);
        } finally {
          unlock();
        }
      }();
    });
  }
  getProcessor() {
    return this.processor;
  }
  /**
   * Stops the track processor
   * See https://github.com/livekit/track-processors-js for example usage
   *
   * @experimental
   * @returns
   */
  stopProcessor() {
    return __awaiter(this, arguments, void 0, function() {
      var _this4 = this;
      let keepElement = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      return function* () {
        var _a, _b;
        if (!_this4.processor)
          return;
        _this4.log.debug("stopping processor", _this4.logContext);
        (_a = _this4.processor.processedTrack) === null || _a === void 0 ? void 0 : _a.stop();
        yield _this4.processor.destroy();
        _this4.processor = void 0;
        if (!keepElement) {
          (_b = _this4.processorElement) === null || _b === void 0 ? void 0 : _b.remove();
          _this4.processorElement = void 0;
        }
        yield _this4._mediaStreamTrack.applyConstraints(_this4._constraints);
        yield _this4.setMediaStreamTrack(_this4._mediaStreamTrack, true);
        _this4.emit(TrackEvent.TrackProcessorUpdate);
      }();
    });
  }
};
var LocalAudioTrack = class extends LocalTrack {
  /**
   * boolean indicating whether enhanced noise cancellation is currently being used on this track
   */
  get enhancedNoiseCancellation() {
    return this.isKrispNoiseFilterEnabled;
  }
  /**
   *
   * @param mediaTrack
   * @param constraints MediaTrackConstraints that are being used when restarting or reacquiring tracks
   * @param userProvidedTrack Signals to the SDK whether or not the mediaTrack should be managed (i.e. released and reacquired) internally by the SDK
   */
  constructor(mediaTrack, constraints) {
    let userProvidedTrack = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    let audioContext = arguments.length > 3 ? arguments[3] : void 0;
    let loggerOptions = arguments.length > 4 ? arguments[4] : void 0;
    super(mediaTrack, Track.Kind.Audio, constraints, userProvidedTrack, loggerOptions);
    this.stopOnMute = false;
    this.isKrispNoiseFilterEnabled = false;
    this.monitorSender = () => __awaiter(this, void 0, void 0, function* () {
      if (!this.sender) {
        this._currentBitrate = 0;
        return;
      }
      let stats;
      try {
        stats = yield this.getSenderStats();
      } catch (e2) {
        this.log.error("could not get audio sender stats", Object.assign(Object.assign({}, this.logContext), {
          error: e2
        }));
        return;
      }
      if (stats && this.prevStats) {
        this._currentBitrate = computeBitrate(stats, this.prevStats);
      }
      this.prevStats = stats;
    });
    this.handleKrispNoiseFilterEnable = () => {
      this.isKrispNoiseFilterEnabled = true;
      this.log.debug("Krisp noise filter enabled", this.logContext);
      this.emit(TrackEvent.AudioTrackFeatureUpdate, this, AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION, true);
    };
    this.handleKrispNoiseFilterDisable = () => {
      this.isKrispNoiseFilterEnabled = false;
      this.log.debug("Krisp noise filter disabled", this.logContext);
      this.emit(TrackEvent.AudioTrackFeatureUpdate, this, AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION, false);
    };
    this.audioContext = audioContext;
    this.checkForSilence();
  }
  mute() {
    const _super = Object.create(null, {
      mute: {
        get: () => super.mute
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      const unlock = yield this.muteLock.lock();
      try {
        if (this.isMuted) {
          this.log.debug("Track already muted", this.logContext);
          return this;
        }
        if (this.source === Track.Source.Microphone && this.stopOnMute && !this.isUserProvided) {
          this.log.debug("stopping mic track", this.logContext);
          this._mediaStreamTrack.stop();
        }
        yield _super.mute.call(this);
        return this;
      } finally {
        unlock();
      }
    });
  }
  unmute() {
    const _super = Object.create(null, {
      unmute: {
        get: () => super.unmute
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      const unlock = yield this.muteLock.lock();
      try {
        if (!this.isMuted) {
          this.log.debug("Track already unmuted", this.logContext);
          return this;
        }
        const deviceHasChanged = this._constraints.deviceId && this._mediaStreamTrack.getSettings().deviceId !== unwrapConstraint(this._constraints.deviceId);
        if (this.source === Track.Source.Microphone && (this.stopOnMute || this._mediaStreamTrack.readyState === "ended" || deviceHasChanged) && !this.isUserProvided) {
          this.log.debug("reacquiring mic track", this.logContext);
          yield this.restartTrack();
        }
        yield _super.unmute.call(this);
        return this;
      } finally {
        unlock();
      }
    });
  }
  restartTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
      let constraints;
      if (options) {
        const streamConstraints = constraintsForOptions({
          audio: options
        });
        if (typeof streamConstraints.audio !== "boolean") {
          constraints = streamConstraints.audio;
        }
      }
      yield this.restart(constraints);
    });
  }
  restart(constraints) {
    const _super = Object.create(null, {
      restart: {
        get: () => super.restart
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      const track = yield _super.restart.call(this, constraints);
      this.checkForSilence();
      return track;
    });
  }
  /* @internal */
  startMonitor() {
    if (!isWeb()) {
      return;
    }
    if (this.monitorInterval) {
      return;
    }
    this.monitorInterval = setInterval(() => {
      this.monitorSender();
    }, monitorFrequency);
  }
  setProcessor(processor) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const unlock = yield this.processorLock.lock();
      try {
        if (!isReactNative() && !this.audioContext) {
          throw Error("Audio context needs to be set on LocalAudioTrack in order to enable processors");
        }
        if (this.processor) {
          yield this.stopProcessor();
        }
        const processorOptions = {
          kind: this.kind,
          track: this._mediaStreamTrack,
          // RN won't have or use AudioContext
          audioContext: this.audioContext
        };
        this.log.debug("setting up audio processor ".concat(processor.name), this.logContext);
        yield processor.init(processorOptions);
        this.processor = processor;
        if (this.processor.processedTrack) {
          yield (_a = this.sender) === null || _a === void 0 ? void 0 : _a.replaceTrack(this.processor.processedTrack);
          this.processor.processedTrack.addEventListener("enable-lk-krisp-noise-filter", this.handleKrispNoiseFilterEnable);
          this.processor.processedTrack.addEventListener("disable-lk-krisp-noise-filter", this.handleKrispNoiseFilterDisable);
        }
        this.emit(TrackEvent.TrackProcessorUpdate, this.processor);
      } finally {
        unlock();
      }
    });
  }
  /**
   * @internal
   * @experimental
   */
  setAudioContext(audioContext) {
    this.audioContext = audioContext;
  }
  getSenderStats() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (!((_a = this.sender) === null || _a === void 0 ? void 0 : _a.getStats)) {
        return void 0;
      }
      const stats = yield this.sender.getStats();
      let audioStats;
      stats.forEach((v) => {
        if (v.type === "outbound-rtp") {
          audioStats = {
            type: "audio",
            streamId: v.id,
            packetsSent: v.packetsSent,
            packetsLost: v.packetsLost,
            bytesSent: v.bytesSent,
            timestamp: v.timestamp,
            roundTripTime: v.roundTripTime,
            jitter: v.jitter
          };
        }
      });
      return audioStats;
    });
  }
  checkForSilence() {
    return __awaiter(this, void 0, void 0, function* () {
      const trackIsSilent = yield detectSilence(this);
      if (trackIsSilent) {
        if (!this.isMuted) {
          this.log.warn("silence detected on local audio track", this.logContext);
        }
        this.emit(TrackEvent.AudioSilenceDetected);
      }
      return trackIsSilent;
    });
  }
};
function mediaTrackToLocalTrack(mediaStreamTrack, constraints, loggerOptions) {
  switch (mediaStreamTrack.kind) {
    case "audio":
      return new LocalAudioTrack(mediaStreamTrack, constraints, false, void 0, loggerOptions);
    case "video":
      return new LocalVideoTrack(mediaStreamTrack, constraints, false, loggerOptions);
    default:
      throw new TrackInvalidError("unsupported track type: ".concat(mediaStreamTrack.kind));
  }
}
var presets169 = Object.values(VideoPresets);
var presets43 = Object.values(VideoPresets43);
var presetsScreenShare = Object.values(ScreenSharePresets);
var defaultSimulcastPresets169 = [VideoPresets.h180, VideoPresets.h360];
var defaultSimulcastPresets43 = [VideoPresets43.h180, VideoPresets43.h360];
var computeDefaultScreenShareSimulcastPresets = (fromPreset) => {
  const layers = [{
    scaleResolutionDownBy: 2,
    fps: fromPreset.encoding.maxFramerate
  }];
  return layers.map((t) => {
    var _a, _b;
    return new VideoPreset(Math.floor(fromPreset.width / t.scaleResolutionDownBy), Math.floor(fromPreset.height / t.scaleResolutionDownBy), Math.max(15e4, Math.floor(fromPreset.encoding.maxBitrate / (Math.pow(t.scaleResolutionDownBy, 2) * (((_a = fromPreset.encoding.maxFramerate) !== null && _a !== void 0 ? _a : 30) / ((_b = t.fps) !== null && _b !== void 0 ? _b : 30))))), t.fps, fromPreset.encoding.priority);
  });
};
var videoRids = ["q", "h", "f"];
function computeVideoEncodings(isScreenShare, width, height, options) {
  var _a, _b;
  let videoEncoding = options === null || options === void 0 ? void 0 : options.videoEncoding;
  if (isScreenShare) {
    videoEncoding = options === null || options === void 0 ? void 0 : options.screenShareEncoding;
  }
  const useSimulcast = options === null || options === void 0 ? void 0 : options.simulcast;
  const scalabilityMode = options === null || options === void 0 ? void 0 : options.scalabilityMode;
  const videoCodec = options === null || options === void 0 ? void 0 : options.videoCodec;
  if (!videoEncoding && !useSimulcast && !scalabilityMode || !width || !height) {
    return [{}];
  }
  if (!videoEncoding) {
    videoEncoding = determineAppropriateEncoding(isScreenShare, width, height, videoCodec);
    livekitLogger.debug("using video encoding", videoEncoding);
  }
  const sourceFramerate = videoEncoding.maxFramerate;
  const original = new VideoPreset(width, height, videoEncoding.maxBitrate, videoEncoding.maxFramerate, videoEncoding.priority);
  if (scalabilityMode && isSVCCodec(videoCodec)) {
    const sm = new ScalabilityMode(scalabilityMode);
    const encodings = [];
    if (sm.spatial > 3) {
      throw new Error("unsupported scalabilityMode: ".concat(scalabilityMode));
    }
    const browser = getBrowser();
    if (isSafari() || // Even tho RN runs M114, it does not produce SVC layers when a single encoding
    // is provided. So we'll use the legacy SVC specification for now.
    // TODO: when we upstream libwebrtc, this will need additional verification
    isReactNative() || (browser === null || browser === void 0 ? void 0 : browser.name) === "Chrome" && compareVersions(browser === null || browser === void 0 ? void 0 : browser.version, "113") < 0) {
      const bitratesRatio = sm.suffix == "h" ? 2 : 3;
      for (let i = 0; i < sm.spatial; i += 1) {
        encodings.push({
          rid: videoRids[2 - i],
          maxBitrate: videoEncoding.maxBitrate / Math.pow(bitratesRatio, i),
          maxFramerate: original.encoding.maxFramerate
        });
      }
      encodings[0].scalabilityMode = scalabilityMode;
    } else {
      encodings.push({
        maxBitrate: videoEncoding.maxBitrate,
        maxFramerate: original.encoding.maxFramerate,
        /* @ts-ignore */
        scalabilityMode
      });
    }
    if (original.encoding.priority) {
      encodings[0].priority = original.encoding.priority;
      encodings[0].networkPriority = original.encoding.priority;
    }
    livekitLogger.debug("using svc encoding", {
      encodings
    });
    return encodings;
  }
  if (!useSimulcast) {
    return [videoEncoding];
  }
  let presets = [];
  if (isScreenShare) {
    presets = (_a = sortPresets(options === null || options === void 0 ? void 0 : options.screenShareSimulcastLayers)) !== null && _a !== void 0 ? _a : defaultSimulcastLayers(isScreenShare, original);
  } else {
    presets = (_b = sortPresets(options === null || options === void 0 ? void 0 : options.videoSimulcastLayers)) !== null && _b !== void 0 ? _b : defaultSimulcastLayers(isScreenShare, original);
  }
  let midPreset;
  if (presets.length > 0) {
    const lowPreset = presets[0];
    if (presets.length > 1) {
      [, midPreset] = presets;
    }
    const size = Math.max(width, height);
    if (size >= 960 && midPreset) {
      return encodingsFromPresets(width, height, [lowPreset, midPreset, original], sourceFramerate);
    }
    if (size >= 480) {
      return encodingsFromPresets(width, height, [lowPreset, original], sourceFramerate);
    }
  }
  return encodingsFromPresets(width, height, [original]);
}
function computeTrackBackupEncodings(track, videoCodec, opts) {
  var _a, _b, _c, _d;
  if (!opts.backupCodec || opts.backupCodec === true || opts.backupCodec.codec === opts.videoCodec) {
    return;
  }
  if (videoCodec !== opts.backupCodec.codec) {
    livekitLogger.warn("requested a different codec than specified as backup", {
      serverRequested: videoCodec,
      backup: opts.backupCodec.codec
    });
  }
  opts.videoCodec = videoCodec;
  opts.videoEncoding = opts.backupCodec.encoding;
  const settings = track.mediaStreamTrack.getSettings();
  const width = (_a = settings.width) !== null && _a !== void 0 ? _a : (_b = track.dimensions) === null || _b === void 0 ? void 0 : _b.width;
  const height = (_c = settings.height) !== null && _c !== void 0 ? _c : (_d = track.dimensions) === null || _d === void 0 ? void 0 : _d.height;
  const encodings = computeVideoEncodings(track.source === Track.Source.ScreenShare, width, height, opts);
  return encodings;
}
function determineAppropriateEncoding(isScreenShare, width, height, codec) {
  const presets = presetsForResolution(isScreenShare, width, height);
  let {
    encoding
  } = presets[0];
  const size = Math.max(width, height);
  for (let i = 0; i < presets.length; i += 1) {
    const preset = presets[i];
    encoding = preset.encoding;
    if (preset.width >= size) {
      break;
    }
  }
  if (codec) {
    switch (codec) {
      case "av1":
        encoding = Object.assign({}, encoding);
        encoding.maxBitrate = encoding.maxBitrate * 0.7;
        break;
      case "vp9":
        encoding = Object.assign({}, encoding);
        encoding.maxBitrate = encoding.maxBitrate * 0.85;
        break;
    }
  }
  return encoding;
}
function presetsForResolution(isScreenShare, width, height) {
  if (isScreenShare) {
    return presetsScreenShare;
  }
  const aspect = width > height ? width / height : height / width;
  if (Math.abs(aspect - 16 / 9) < Math.abs(aspect - 4 / 3)) {
    return presets169;
  }
  return presets43;
}
function defaultSimulcastLayers(isScreenShare, original) {
  if (isScreenShare) {
    return computeDefaultScreenShareSimulcastPresets(original);
  }
  const {
    width,
    height
  } = original;
  const aspect = width > height ? width / height : height / width;
  if (Math.abs(aspect - 16 / 9) < Math.abs(aspect - 4 / 3)) {
    return defaultSimulcastPresets169;
  }
  return defaultSimulcastPresets43;
}
function encodingsFromPresets(width, height, presets, sourceFramerate) {
  const encodings = [];
  presets.forEach((preset, idx) => {
    if (idx >= videoRids.length) {
      return;
    }
    const size = Math.min(width, height);
    const rid = videoRids[idx];
    const encoding = {
      rid,
      scaleResolutionDownBy: Math.max(1, size / Math.min(preset.width, preset.height)),
      maxBitrate: preset.encoding.maxBitrate
    };
    const maxFramerate = sourceFramerate && preset.encoding.maxFramerate ? Math.min(sourceFramerate, preset.encoding.maxFramerate) : preset.encoding.maxFramerate;
    if (maxFramerate) {
      encoding.maxFramerate = maxFramerate;
    }
    const canSetPriority = isFireFox() || idx === 0;
    if (preset.encoding.priority && canSetPriority) {
      encoding.priority = preset.encoding.priority;
      encoding.networkPriority = preset.encoding.priority;
    }
    encodings.push(encoding);
  });
  if (isReactNative() && getReactNativeOs() === "ios") {
    let topFramerate = void 0;
    encodings.forEach((encoding) => {
      if (!topFramerate) {
        topFramerate = encoding.maxFramerate;
      } else if (encoding.maxFramerate && encoding.maxFramerate > topFramerate) {
        topFramerate = encoding.maxFramerate;
      }
    });
    let notifyOnce = true;
    encodings.forEach((encoding) => {
      var _a;
      if (encoding.maxFramerate != topFramerate) {
        if (notifyOnce) {
          notifyOnce = false;
          livekitLogger.info("Simulcast on iOS React-Native requires all encodings to share the same framerate.");
        }
        livekitLogger.info('Setting framerate of encoding "'.concat((_a = encoding.rid) !== null && _a !== void 0 ? _a : "", '" to ').concat(topFramerate));
        encoding.maxFramerate = topFramerate;
      }
    });
  }
  return encodings;
}
function sortPresets(presets) {
  if (!presets)
    return;
  return presets.sort((a, b) => {
    const {
      encoding: aEnc
    } = a;
    const {
      encoding: bEnc
    } = b;
    if (aEnc.maxBitrate > bEnc.maxBitrate) {
      return 1;
    }
    if (aEnc.maxBitrate < bEnc.maxBitrate)
      return -1;
    if (aEnc.maxBitrate === bEnc.maxBitrate && aEnc.maxFramerate && bEnc.maxFramerate) {
      return aEnc.maxFramerate > bEnc.maxFramerate ? 1 : -1;
    }
    return 0;
  });
}
var ScalabilityMode = class {
  constructor(scalabilityMode) {
    const results = scalabilityMode.match(/^L(\d)T(\d)(h|_KEY|_KEY_SHIFT){0,1}$/);
    if (!results) {
      throw new Error("invalid scalability mode");
    }
    this.spatial = parseInt(results[1]);
    this.temporal = parseInt(results[2]);
    if (results.length > 3) {
      switch (results[3]) {
        case "h":
        case "_KEY":
        case "_KEY_SHIFT":
          this.suffix = results[3];
      }
    }
  }
  toString() {
    var _a;
    return "L".concat(this.spatial, "T").concat(this.temporal).concat((_a = this.suffix) !== null && _a !== void 0 ? _a : "");
  }
};
function getDefaultDegradationPreference(track) {
  if (track.source === Track.Source.ScreenShare || track.constraints.height && unwrapConstraint(track.constraints.height) >= 1080) {
    return "maintain-resolution";
  } else {
    return "balanced";
  }
}
var refreshSubscribedCodecAfterNewCodec = 5e3;
var LocalVideoTrack = class extends LocalTrack {
  get sender() {
    return this._sender;
  }
  set sender(sender) {
    this._sender = sender;
    if (this.degradationPreference) {
      this.setDegradationPreference(this.degradationPreference);
    }
  }
  /**
   *
   * @param mediaTrack
   * @param constraints MediaTrackConstraints that are being used when restarting or reacquiring tracks
   * @param userProvidedTrack Signals to the SDK whether or not the mediaTrack should be managed (i.e. released and reacquired) internally by the SDK
   */
  constructor(mediaTrack, constraints) {
    let userProvidedTrack = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    let loggerOptions = arguments.length > 3 ? arguments[3] : void 0;
    super(mediaTrack, Track.Kind.Video, constraints, userProvidedTrack, loggerOptions);
    this.simulcastCodecs = /* @__PURE__ */ new Map();
    this.degradationPreference = "balanced";
    this.monitorSender = () => __awaiter(this, void 0, void 0, function* () {
      if (!this.sender) {
        this._currentBitrate = 0;
        return;
      }
      let stats;
      try {
        stats = yield this.getSenderStats();
      } catch (e2) {
        this.log.error("could not get audio sender stats", Object.assign(Object.assign({}, this.logContext), {
          error: e2
        }));
        return;
      }
      const statsMap = new Map(stats.map((s) => [s.rid, s]));
      if (this.prevStats) {
        let totalBitrate = 0;
        statsMap.forEach((s, key) => {
          var _a;
          const prev = (_a = this.prevStats) === null || _a === void 0 ? void 0 : _a.get(key);
          totalBitrate += computeBitrate(s, prev);
        });
        this._currentBitrate = totalBitrate;
      }
      this.prevStats = statsMap;
    });
    this.senderLock = new _();
  }
  get isSimulcast() {
    if (this.sender && this.sender.getParameters().encodings.length > 1) {
      return true;
    }
    return false;
  }
  /* @internal */
  startMonitor(signalClient) {
    var _a;
    this.signalClient = signalClient;
    if (!isWeb()) {
      return;
    }
    const params = (_a = this.sender) === null || _a === void 0 ? void 0 : _a.getParameters();
    if (params) {
      this.encodings = params.encodings;
    }
    if (this.monitorInterval) {
      return;
    }
    this.monitorInterval = setInterval(() => {
      this.monitorSender();
    }, monitorFrequency);
  }
  stop() {
    this._mediaStreamTrack.getConstraints();
    this.simulcastCodecs.forEach((trackInfo) => {
      trackInfo.mediaStreamTrack.stop();
    });
    super.stop();
  }
  pauseUpstream() {
    const _super = Object.create(null, {
      pauseUpstream: {
        get: () => super.pauseUpstream
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      var _d;
      yield _super.pauseUpstream.call(this);
      try {
        for (var _e = true, _f = __asyncValues(this.simulcastCodecs.values()), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
          _c = _g.value;
          _e = false;
          const sc = _c;
          yield (_d = sc.sender) === null || _d === void 0 ? void 0 : _d.replaceTrack(null);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_e && !_a && (_b = _f.return))
            yield _b.call(_f);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
    });
  }
  resumeUpstream() {
    const _super = Object.create(null, {
      resumeUpstream: {
        get: () => super.resumeUpstream
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_2, _b, _c;
      var _d;
      yield _super.resumeUpstream.call(this);
      try {
        for (var _e = true, _f = __asyncValues(this.simulcastCodecs.values()), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
          _c = _g.value;
          _e = false;
          const sc = _c;
          yield (_d = sc.sender) === null || _d === void 0 ? void 0 : _d.replaceTrack(sc.mediaStreamTrack);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (!_e && !_a && (_b = _f.return))
            yield _b.call(_f);
        } finally {
          if (e_2)
            throw e_2.error;
        }
      }
    });
  }
  mute() {
    const _super = Object.create(null, {
      mute: {
        get: () => super.mute
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      const unlock = yield this.muteLock.lock();
      try {
        if (this.isMuted) {
          this.log.debug("Track already muted", this.logContext);
          return this;
        }
        if (this.source === Track.Source.Camera && !this.isUserProvided) {
          this.log.debug("stopping camera track", this.logContext);
          this._mediaStreamTrack.stop();
        }
        yield _super.mute.call(this);
        return this;
      } finally {
        unlock();
      }
    });
  }
  unmute() {
    const _super = Object.create(null, {
      unmute: {
        get: () => super.unmute
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      const unlock = yield this.muteLock.lock();
      try {
        if (!this.isMuted) {
          this.log.debug("Track already unmuted", this.logContext);
          return this;
        }
        if (this.source === Track.Source.Camera && !this.isUserProvided) {
          this.log.debug("reacquiring camera track", this.logContext);
          yield this.restartTrack();
        }
        yield _super.unmute.call(this);
        return this;
      } finally {
        unlock();
      }
    });
  }
  setTrackMuted(muted) {
    super.setTrackMuted(muted);
    for (const sc of this.simulcastCodecs.values()) {
      sc.mediaStreamTrack.enabled = !muted;
    }
  }
  getSenderStats() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (!((_a = this.sender) === null || _a === void 0 ? void 0 : _a.getStats)) {
        return [];
      }
      const items = [];
      const stats = yield this.sender.getStats();
      stats.forEach((v) => {
        var _a2;
        if (v.type === "outbound-rtp") {
          const vs = {
            type: "video",
            streamId: v.id,
            frameHeight: v.frameHeight,
            frameWidth: v.frameWidth,
            framesPerSecond: v.framesPerSecond,
            framesSent: v.framesSent,
            firCount: v.firCount,
            pliCount: v.pliCount,
            nackCount: v.nackCount,
            packetsSent: v.packetsSent,
            bytesSent: v.bytesSent,
            qualityLimitationReason: v.qualityLimitationReason,
            qualityLimitationDurations: v.qualityLimitationDurations,
            qualityLimitationResolutionChanges: v.qualityLimitationResolutionChanges,
            rid: (_a2 = v.rid) !== null && _a2 !== void 0 ? _a2 : v.id,
            retransmittedPacketsSent: v.retransmittedPacketsSent,
            targetBitrate: v.targetBitrate,
            timestamp: v.timestamp
          };
          const r2 = stats.get(v.remoteId);
          if (r2) {
            vs.jitter = r2.jitter;
            vs.packetsLost = r2.packetsLost;
            vs.roundTripTime = r2.roundTripTime;
          }
          items.push(vs);
        }
      });
      items.sort((a, b) => {
        var _a2, _b;
        return ((_a2 = b.frameWidth) !== null && _a2 !== void 0 ? _a2 : 0) - ((_b = a.frameWidth) !== null && _b !== void 0 ? _b : 0);
      });
      return items;
    });
  }
  setPublishingQuality(maxQuality) {
    const qualities = [];
    for (let q = VideoQuality.LOW; q <= VideoQuality.HIGH; q += 1) {
      qualities.push(new SubscribedQuality({
        quality: q,
        enabled: q <= maxQuality
      }));
    }
    this.log.debug("setting publishing quality. max quality ".concat(maxQuality), this.logContext);
    this.setPublishingLayers(qualities);
  }
  restartTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_3, _b, _c;
      var _d;
      let constraints;
      if (options) {
        const streamConstraints = constraintsForOptions({
          video: options
        });
        if (typeof streamConstraints.video !== "boolean") {
          constraints = streamConstraints.video;
        }
      }
      yield this.restart(constraints);
      try {
        for (var _e = true, _f = __asyncValues(this.simulcastCodecs.values()), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
          _c = _g.value;
          _e = false;
          const sc = _c;
          if (sc.sender && ((_d = sc.sender.transport) === null || _d === void 0 ? void 0 : _d.state) !== "closed") {
            sc.mediaStreamTrack = this.mediaStreamTrack.clone();
            yield sc.sender.replaceTrack(sc.mediaStreamTrack);
          }
        }
      } catch (e_3_1) {
        e_3 = {
          error: e_3_1
        };
      } finally {
        try {
          if (!_e && !_a && (_b = _f.return))
            yield _b.call(_f);
        } finally {
          if (e_3)
            throw e_3.error;
        }
      }
    });
  }
  setProcessor(processor_1) {
    const _super = Object.create(null, {
      setProcessor: {
        get: () => super.setProcessor
      }
    });
    return __awaiter(this, arguments, void 0, function(processor) {
      var _this = this;
      let showProcessedStreamLocally = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return function* () {
        var _a, e_4, _b, _c;
        var _d, _e;
        yield _super.setProcessor.call(_this, processor, showProcessedStreamLocally);
        if ((_d = _this.processor) === null || _d === void 0 ? void 0 : _d.processedTrack) {
          try {
            for (var _f = true, _g = __asyncValues(_this.simulcastCodecs.values()), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
              _c = _h.value;
              _f = false;
              const sc = _c;
              yield (_e = sc.sender) === null || _e === void 0 ? void 0 : _e.replaceTrack(_this.processor.processedTrack);
            }
          } catch (e_4_1) {
            e_4 = {
              error: e_4_1
            };
          } finally {
            try {
              if (!_f && !_a && (_b = _g.return))
                yield _b.call(_g);
            } finally {
              if (e_4)
                throw e_4.error;
            }
          }
        }
      }();
    });
  }
  setDegradationPreference(preference) {
    return __awaiter(this, void 0, void 0, function* () {
      this.degradationPreference = preference;
      if (this.sender) {
        try {
          this.log.debug("setting degradationPreference to ".concat(preference), this.logContext);
          const params = this.sender.getParameters();
          params.degradationPreference = preference;
          this.sender.setParameters(params);
        } catch (e2) {
          this.log.warn("failed to set degradationPreference", Object.assign({
            error: e2
          }, this.logContext));
        }
      }
    });
  }
  addSimulcastTrack(codec, encodings) {
    if (this.simulcastCodecs.has(codec)) {
      this.log.error("".concat(codec, " already added, skipping adding simulcast codec"), this.logContext);
      return;
    }
    const simulcastCodecInfo = {
      codec,
      mediaStreamTrack: this.mediaStreamTrack.clone(),
      sender: void 0,
      encodings
    };
    this.simulcastCodecs.set(codec, simulcastCodecInfo);
    return simulcastCodecInfo;
  }
  setSimulcastTrackSender(codec, sender) {
    const simulcastCodecInfo = this.simulcastCodecs.get(codec);
    if (!simulcastCodecInfo) {
      return;
    }
    simulcastCodecInfo.sender = sender;
    setTimeout(() => {
      if (this.subscribedCodecs) {
        this.setPublishingCodecs(this.subscribedCodecs);
      }
    }, refreshSubscribedCodecAfterNewCodec);
  }
  /**
   * @internal
   * Sets codecs that should be publishing, returns new codecs that have not yet
   * been published
   */
  setPublishingCodecs(codecs) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, codecs_1, codecs_1_1;
      var _b, e_5, _c, _d;
      this.log.debug("setting publishing codecs", Object.assign(Object.assign({}, this.logContext), {
        codecs,
        currentCodec: this.codec
      }));
      if (!this.codec && codecs.length > 0) {
        yield this.setPublishingLayers(codecs[0].qualities);
        return [];
      }
      this.subscribedCodecs = codecs;
      const newCodecs = [];
      try {
        for (_a = true, codecs_1 = __asyncValues(codecs); codecs_1_1 = yield codecs_1.next(), _b = codecs_1_1.done, !_b; _a = true) {
          _d = codecs_1_1.value;
          _a = false;
          const codec = _d;
          if (!this.codec || this.codec === codec.codec) {
            yield this.setPublishingLayers(codec.qualities);
          } else {
            const simulcastCodecInfo = this.simulcastCodecs.get(codec.codec);
            this.log.debug("try setPublishingCodec for ".concat(codec.codec), Object.assign(Object.assign({}, this.logContext), {
              simulcastCodecInfo
            }));
            if (!simulcastCodecInfo || !simulcastCodecInfo.sender) {
              for (const q of codec.qualities) {
                if (q.enabled) {
                  newCodecs.push(codec.codec);
                  break;
                }
              }
            } else if (simulcastCodecInfo.encodings) {
              this.log.debug("try setPublishingLayersForSender ".concat(codec.codec), this.logContext);
              yield setPublishingLayersForSender(simulcastCodecInfo.sender, simulcastCodecInfo.encodings, codec.qualities, this.senderLock, this.log, this.logContext);
            }
          }
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (!_a && !_b && (_c = codecs_1.return))
            yield _c.call(codecs_1);
        } finally {
          if (e_5)
            throw e_5.error;
        }
      }
      return newCodecs;
    });
  }
  /**
   * @internal
   * Sets layers that should be publishing
   */
  setPublishingLayers(qualities) {
    return __awaiter(this, void 0, void 0, function* () {
      this.log.debug("setting publishing layers", Object.assign(Object.assign({}, this.logContext), {
        qualities
      }));
      if (!this.sender || !this.encodings) {
        return;
      }
      yield setPublishingLayersForSender(this.sender, this.encodings, qualities, this.senderLock, this.log, this.logContext);
    });
  }
  handleAppVisibilityChanged() {
    const _super = Object.create(null, {
      handleAppVisibilityChanged: {
        get: () => super.handleAppVisibilityChanged
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      yield _super.handleAppVisibilityChanged.call(this);
      if (!isMobile())
        return;
      if (this.isInBackground && this.source === Track.Source.Camera) {
        this._mediaStreamTrack.enabled = false;
      }
    });
  }
};
function setPublishingLayersForSender(sender, senderEncodings, qualities, senderLock, log2, logContext) {
  return __awaiter(this, void 0, void 0, function* () {
    const unlock = yield senderLock.lock();
    log2.debug("setPublishingLayersForSender", Object.assign(Object.assign({}, logContext), {
      sender,
      qualities,
      senderEncodings
    }));
    try {
      const params = sender.getParameters();
      const {
        encodings
      } = params;
      if (!encodings) {
        return;
      }
      if (encodings.length !== senderEncodings.length) {
        log2.warn("cannot set publishing layers, encodings mismatch", Object.assign(Object.assign({}, logContext), {
          encodings,
          senderEncodings
        }));
        return;
      }
      let hasChanged = false;
      const closableSpatial = false;
      if (closableSpatial && encodings[0].scalabilityMode)
        ;
      else {
        encodings.forEach((encoding, idx) => {
          var _a;
          let rid = (_a = encoding.rid) !== null && _a !== void 0 ? _a : "";
          if (rid === "") {
            rid = "q";
          }
          const quality = videoQualityForRid(rid);
          const subscribedQuality = qualities.find((q) => q.quality === quality);
          if (!subscribedQuality) {
            return;
          }
          if (encoding.active !== subscribedQuality.enabled) {
            hasChanged = true;
            encoding.active = subscribedQuality.enabled;
            log2.debug("setting layer ".concat(subscribedQuality.quality, " to ").concat(encoding.active ? "enabled" : "disabled"), logContext);
            if (isFireFox()) {
              if (subscribedQuality.enabled) {
                encoding.scaleResolutionDownBy = senderEncodings[idx].scaleResolutionDownBy;
                encoding.maxBitrate = senderEncodings[idx].maxBitrate;
                encoding.maxFrameRate = senderEncodings[idx].maxFrameRate;
              } else {
                encoding.scaleResolutionDownBy = 4;
                encoding.maxBitrate = 10;
                encoding.maxFrameRate = 2;
              }
            }
          }
        });
      }
      if (hasChanged) {
        params.encodings = encodings;
        log2.debug("setting encodings", Object.assign(Object.assign({}, logContext), {
          encodings: params.encodings
        }));
        yield sender.setParameters(params);
      }
    } finally {
      unlock();
    }
  });
}
function videoQualityForRid(rid) {
  switch (rid) {
    case "f":
      return VideoQuality.HIGH;
    case "h":
      return VideoQuality.MEDIUM;
    case "q":
      return VideoQuality.LOW;
    default:
      return VideoQuality.HIGH;
  }
}
function videoLayersFromEncodings(width, height, encodings, svc) {
  if (!encodings) {
    return [new VideoLayer({
      quality: VideoQuality.HIGH,
      width,
      height,
      bitrate: 0,
      ssrc: 0
    })];
  }
  if (svc) {
    const encodingSM = encodings[0].scalabilityMode;
    const sm = new ScalabilityMode(encodingSM);
    const layers = [];
    const resRatio = sm.suffix == "h" ? 1.5 : 2;
    const bitratesRatio = sm.suffix == "h" ? 2 : 3;
    for (let i = 0; i < sm.spatial; i += 1) {
      layers.push(new VideoLayer({
        quality: Math.min(VideoQuality.HIGH, sm.spatial - 1) - i,
        width: Math.ceil(width / Math.pow(resRatio, i)),
        height: Math.ceil(height / Math.pow(resRatio, i)),
        bitrate: encodings[0].maxBitrate ? Math.ceil(encodings[0].maxBitrate / Math.pow(bitratesRatio, i)) : 0,
        ssrc: 0
      }));
    }
    return layers;
  }
  return encodings.map((encoding) => {
    var _a, _b, _c;
    const scale = (_a = encoding.scaleResolutionDownBy) !== null && _a !== void 0 ? _a : 1;
    let quality = videoQualityForRid((_b = encoding.rid) !== null && _b !== void 0 ? _b : "");
    return new VideoLayer({
      quality,
      width: Math.ceil(width / scale),
      height: Math.ceil(height / scale),
      bitrate: (_c = encoding.maxBitrate) !== null && _c !== void 0 ? _c : 0,
      ssrc: 0
    });
  });
}
var lossyDataChannel = "_lossy";
var reliableDataChannel = "_reliable";
var minReconnectWait = 2 * 1e3;
var leaveReconnect = "leave-reconnect";
var PCState;
(function(PCState2) {
  PCState2[PCState2["New"] = 0] = "New";
  PCState2[PCState2["Connected"] = 1] = "Connected";
  PCState2[PCState2["Disconnected"] = 2] = "Disconnected";
  PCState2[PCState2["Reconnecting"] = 3] = "Reconnecting";
  PCState2[PCState2["Closed"] = 4] = "Closed";
})(PCState || (PCState = {}));
var RTCEngine = class extends eventsExports.EventEmitter {
  get isClosed() {
    return this._isClosed;
  }
  get pendingReconnect() {
    return !!this.reconnectTimeout;
  }
  constructor(options) {
    var _a;
    super();
    this.options = options;
    this.rtcConfig = {};
    this.peerConnectionTimeout = roomConnectOptionDefaults.peerConnectionTimeout;
    this.fullReconnectOnNext = false;
    this.subscriberPrimary = false;
    this.pcState = PCState.New;
    this._isClosed = true;
    this.pendingTrackResolvers = {};
    this.reconnectAttempts = 0;
    this.reconnectStart = 0;
    this.attemptingReconnect = false;
    this.joinAttempts = 0;
    this.maxJoinAttempts = 1;
    this.shouldFailNext = false;
    this.log = livekitLogger;
    this.handleDataChannel = (_a2) => __awaiter(this, [_a2], void 0, function(_ref) {
      var _this = this;
      let {
        channel
      } = _ref;
      return function* () {
        if (!channel) {
          return;
        }
        if (channel.label === reliableDataChannel) {
          _this.reliableDCSub = channel;
        } else if (channel.label === lossyDataChannel) {
          _this.lossyDCSub = channel;
        } else {
          return;
        }
        _this.log.debug("on data channel ".concat(channel.id, ", ").concat(channel.label), _this.logContext);
        channel.onmessage = _this.handleDataMessage;
      }();
    });
    this.handleDataMessage = (message) => __awaiter(this, void 0, void 0, function* () {
      var _a2, _b;
      const unlock = yield this.dataProcessLock.lock();
      try {
        let buffer;
        if (message.data instanceof ArrayBuffer) {
          buffer = message.data;
        } else if (message.data instanceof Blob) {
          buffer = yield message.data.arrayBuffer();
        } else {
          this.log.error("unsupported data type", Object.assign(Object.assign({}, this.logContext), {
            data: message.data
          }));
          return;
        }
        const dp = DataPacket.fromBinary(new Uint8Array(buffer));
        if (((_a2 = dp.value) === null || _a2 === void 0 ? void 0 : _a2.case) === "speaker") {
          this.emit(EngineEvent.ActiveSpeakersUpdate, dp.value.value.speakers);
        } else {
          if (((_b = dp.value) === null || _b === void 0 ? void 0 : _b.case) === "user") {
            applyUserDataCompat(dp, dp.value.value);
          }
          this.emit(EngineEvent.DataPacketReceived, dp);
        }
      } finally {
        unlock();
      }
    });
    this.handleDataError = (event) => {
      const channel = event.currentTarget;
      const channelKind = channel.maxRetransmits === 0 ? "lossy" : "reliable";
      if (event instanceof ErrorEvent && event.error) {
        const {
          error
        } = event.error;
        this.log.error("DataChannel error on ".concat(channelKind, ": ").concat(event.message), Object.assign(Object.assign({}, this.logContext), {
          error
        }));
      } else {
        this.log.error("Unknown DataChannel error on ".concat(channelKind), Object.assign(Object.assign({}, this.logContext), {
          event
        }));
      }
    };
    this.handleBufferedAmountLow = (event) => {
      const channel = event.currentTarget;
      const channelKind = channel.maxRetransmits === 0 ? DataPacket_Kind.LOSSY : DataPacket_Kind.RELIABLE;
      this.updateAndEmitDCBufferStatus(channelKind);
    };
    this.handleDisconnect = (connection, disconnectReason) => {
      if (this._isClosed) {
        return;
      }
      this.log.warn("".concat(connection, " disconnected"), this.logContext);
      if (this.reconnectAttempts === 0) {
        this.reconnectStart = Date.now();
      }
      const disconnect = (duration2) => {
        this.log.warn("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(duration2, "ms. giving up"), this.logContext);
        this.emit(EngineEvent.Disconnected);
        this.close();
      };
      const duration = Date.now() - this.reconnectStart;
      let delay = this.getNextRetryDelay({
        elapsedMs: duration,
        retryCount: this.reconnectAttempts
      });
      if (delay === null) {
        disconnect(duration);
        return;
      }
      if (connection === leaveReconnect) {
        delay = 0;
      }
      this.log.debug("reconnecting in ".concat(delay, "ms"), this.logContext);
      this.clearReconnectTimeout();
      if (this.token && this.regionUrlProvider) {
        this.regionUrlProvider.updateToken(this.token);
      }
      this.reconnectTimeout = CriticalTimers.setTimeout(() => this.attemptReconnect(disconnectReason).finally(() => this.reconnectTimeout = void 0), delay);
    };
    this.waitForRestarted = () => {
      return new Promise((resolve, reject) => {
        if (this.pcState === PCState.Connected) {
          resolve();
        }
        const onRestarted = () => {
          this.off(EngineEvent.Disconnected, onDisconnected);
          resolve();
        };
        const onDisconnected = () => {
          this.off(EngineEvent.Restarted, onRestarted);
          reject();
        };
        this.once(EngineEvent.Restarted, onRestarted);
        this.once(EngineEvent.Disconnected, onDisconnected);
      });
    };
    this.updateAndEmitDCBufferStatus = (kind) => {
      const status = this.isBufferStatusLow(kind);
      if (typeof status !== "undefined" && status !== this.dcBufferStatus.get(kind)) {
        this.dcBufferStatus.set(kind, status);
        this.emit(EngineEvent.DCBufferStatusChanged, status, kind);
      }
    };
    this.isBufferStatusLow = (kind) => {
      const dc = this.dataChannelForKind(kind);
      if (dc) {
        return dc.bufferedAmount <= dc.bufferedAmountLowThreshold;
      }
    };
    this.handleBrowserOnLine = () => {
      if (this.client.currentState === SignalConnectionState.RECONNECTING) {
        this.clearReconnectTimeout();
        this.attemptReconnect(ReconnectReason.RR_SIGNAL_DISCONNECTED);
      }
    };
    this.log = getLogger((_a = options.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.Engine);
    this.loggerOptions = {
      loggerName: options.loggerName,
      loggerContextCb: () => this.logContext
    };
    this.client = new SignalClient(void 0, this.loggerOptions);
    this.client.signalLatency = this.options.expSignalLatency;
    this.reconnectPolicy = this.options.reconnectPolicy;
    this.registerOnLineListener();
    this.closingLock = new _();
    this.dataProcessLock = new _();
    this.dcBufferStatus = /* @__PURE__ */ new Map([[DataPacket_Kind.LOSSY, true], [DataPacket_Kind.RELIABLE, true]]);
    this.client.onParticipantUpdate = (updates) => this.emit(EngineEvent.ParticipantUpdate, updates);
    this.client.onConnectionQuality = (update) => this.emit(EngineEvent.ConnectionQualityUpdate, update);
    this.client.onRoomUpdate = (update) => this.emit(EngineEvent.RoomUpdate, update);
    this.client.onSubscriptionError = (resp) => this.emit(EngineEvent.SubscriptionError, resp);
    this.client.onSubscriptionPermissionUpdate = (update) => this.emit(EngineEvent.SubscriptionPermissionUpdate, update);
    this.client.onSpeakersChanged = (update) => this.emit(EngineEvent.SpeakersChanged, update);
    this.client.onStreamStateUpdate = (update) => this.emit(EngineEvent.StreamStateChanged, update);
    this.client.onRequestResponse = (response) => this.emit(EngineEvent.SignalRequestResponse, response);
  }
  /** @internal */
  get logContext() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
      room: (_b = (_a = this.latestJoinResponse) === null || _a === void 0 ? void 0 : _a.room) === null || _b === void 0 ? void 0 : _b.name,
      roomID: (_d = (_c = this.latestJoinResponse) === null || _c === void 0 ? void 0 : _c.room) === null || _d === void 0 ? void 0 : _d.sid,
      participant: (_f = (_e = this.latestJoinResponse) === null || _e === void 0 ? void 0 : _e.participant) === null || _f === void 0 ? void 0 : _f.identity,
      pID: (_h = (_g = this.latestJoinResponse) === null || _g === void 0 ? void 0 : _g.participant) === null || _h === void 0 ? void 0 : _h.sid
    };
  }
  join(url, token, opts, abortSignal) {
    return __awaiter(this, void 0, void 0, function* () {
      this.url = url;
      this.token = token;
      this.signalOpts = opts;
      this.maxJoinAttempts = opts.maxRetries;
      try {
        this.joinAttempts += 1;
        this.setupSignalClientCallbacks();
        const joinResponse = yield this.client.join(url, token, opts, abortSignal);
        this._isClosed = false;
        this.latestJoinResponse = joinResponse;
        this.subscriberPrimary = joinResponse.subscriberPrimary;
        if (!this.pcManager) {
          yield this.configure(joinResponse);
        }
        if (!this.subscriberPrimary || joinResponse.fastPublish) {
          this.negotiate();
        }
        this.clientConfiguration = joinResponse.clientConfiguration;
        return joinResponse;
      } catch (e2) {
        if (e2 instanceof ConnectionError) {
          if (e2.reason === ConnectionErrorReason.ServerUnreachable) {
            this.log.warn("Couldn't connect to server, attempt ".concat(this.joinAttempts, " of ").concat(this.maxJoinAttempts), this.logContext);
            if (this.joinAttempts < this.maxJoinAttempts) {
              return this.join(url, token, opts, abortSignal);
            }
          }
        }
        throw e2;
      }
    });
  }
  close() {
    return __awaiter(this, void 0, void 0, function* () {
      const unlock = yield this.closingLock.lock();
      if (this.isClosed) {
        unlock();
        return;
      }
      try {
        this._isClosed = true;
        this.joinAttempts = 0;
        this.emit(EngineEvent.Closing);
        this.removeAllListeners();
        this.deregisterOnLineListener();
        this.clearPendingReconnect();
        yield this.cleanupPeerConnections();
        yield this.cleanupClient();
      } finally {
        unlock();
      }
    });
  }
  cleanupPeerConnections() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      yield (_a = this.pcManager) === null || _a === void 0 ? void 0 : _a.close();
      this.pcManager = void 0;
      const dcCleanup = (dc) => {
        if (!dc)
          return;
        dc.close();
        dc.onbufferedamountlow = null;
        dc.onclose = null;
        dc.onclosing = null;
        dc.onerror = null;
        dc.onmessage = null;
        dc.onopen = null;
      };
      dcCleanup(this.lossyDC);
      dcCleanup(this.lossyDCSub);
      dcCleanup(this.reliableDC);
      dcCleanup(this.reliableDCSub);
      this.lossyDC = void 0;
      this.lossyDCSub = void 0;
      this.reliableDC = void 0;
      this.reliableDCSub = void 0;
    });
  }
  cleanupClient() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.client.close();
      this.client.resetCallbacks();
    });
  }
  addTrack(req) {
    if (this.pendingTrackResolvers[req.cid]) {
      throw new TrackInvalidError("a track with the same ID has already been published");
    }
    return new Promise((resolve, reject) => {
      const publicationTimeout = setTimeout(() => {
        delete this.pendingTrackResolvers[req.cid];
        reject(new ConnectionError("publication of local track timed out, no response from server", ConnectionErrorReason.InternalError));
      }, 1e4);
      this.pendingTrackResolvers[req.cid] = {
        resolve: (info) => {
          clearTimeout(publicationTimeout);
          resolve(info);
        },
        reject: () => {
          clearTimeout(publicationTimeout);
          reject(new Error("Cancelled publication by calling unpublish"));
        }
      };
      this.client.sendAddTrack(req);
    });
  }
  /**
   * Removes sender from PeerConnection, returning true if it was removed successfully
   * and a negotiation is necessary
   * @param sender
   * @returns
   */
  removeTrack(sender) {
    if (sender.track && this.pendingTrackResolvers[sender.track.id]) {
      const {
        reject
      } = this.pendingTrackResolvers[sender.track.id];
      if (reject) {
        reject();
      }
      delete this.pendingTrackResolvers[sender.track.id];
    }
    try {
      this.pcManager.removeTrack(sender);
      return true;
    } catch (e2) {
      this.log.warn("failed to remove track", Object.assign(Object.assign({}, this.logContext), {
        error: e2
      }));
    }
    return false;
  }
  updateMuteStatus(trackSid, muted) {
    this.client.sendMuteTrack(trackSid, muted);
  }
  get dataSubscriberReadyState() {
    var _a;
    return (_a = this.reliableDCSub) === null || _a === void 0 ? void 0 : _a.readyState;
  }
  getConnectedServerAddress() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      return (_a = this.pcManager) === null || _a === void 0 ? void 0 : _a.getConnectedAddress();
    });
  }
  /* @internal */
  setRegionUrlProvider(provider) {
    this.regionUrlProvider = provider;
  }
  configure(joinResponse) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      if (this.pcManager && this.pcManager.currentState !== PCTransportState.NEW) {
        return;
      }
      this.participantSid = (_a = joinResponse.participant) === null || _a === void 0 ? void 0 : _a.sid;
      const rtcConfig = this.makeRTCConfiguration(joinResponse);
      this.pcManager = new PCTransportManager(rtcConfig, joinResponse.subscriberPrimary, this.loggerOptions);
      this.emit(EngineEvent.TransportsCreated, this.pcManager.publisher, this.pcManager.subscriber);
      this.pcManager.onIceCandidate = (candidate, target) => {
        this.client.sendIceCandidate(candidate, target);
      };
      this.pcManager.onPublisherOffer = (offer) => {
        this.client.sendOffer(offer);
      };
      this.pcManager.onDataChannel = this.handleDataChannel;
      this.pcManager.onStateChange = (connectionState, publisherState, subscriberState) => __awaiter(this, void 0, void 0, function* () {
        this.log.debug("primary PC state changed ".concat(connectionState), this.logContext);
        if (["closed", "disconnected", "failed"].includes(publisherState)) {
          this.publisherConnectionPromise = void 0;
        }
        if (connectionState === PCTransportState.CONNECTED) {
          const shouldEmit = this.pcState === PCState.New;
          this.pcState = PCState.Connected;
          if (shouldEmit) {
            this.emit(EngineEvent.Connected, joinResponse);
          }
        } else if (connectionState === PCTransportState.FAILED) {
          if (this.pcState === PCState.Connected) {
            this.pcState = PCState.Disconnected;
            this.handleDisconnect("peerconnection failed", subscriberState === "failed" ? ReconnectReason.RR_SUBSCRIBER_FAILED : ReconnectReason.RR_PUBLISHER_FAILED);
          }
        }
        const isSignalSevered = this.client.isDisconnected || this.client.currentState === SignalConnectionState.RECONNECTING;
        const isPCSevered = [PCTransportState.FAILED, PCTransportState.CLOSING, PCTransportState.CLOSED].includes(connectionState);
        if (isSignalSevered && isPCSevered && !this._isClosed) {
          this.emit(EngineEvent.Offline);
        }
      });
      this.pcManager.onTrack = (ev) => {
        this.emit(EngineEvent.MediaTrackAdded, ev.track, ev.streams[0], ev.receiver);
      };
      if (!supportOptionalDatachannel((_b = joinResponse.serverInfo) === null || _b === void 0 ? void 0 : _b.protocol)) {
        this.createDataChannels();
      }
    });
  }
  setupSignalClientCallbacks() {
    this.client.onAnswer = (sd) => __awaiter(this, void 0, void 0, function* () {
      if (!this.pcManager) {
        return;
      }
      this.log.debug("received server answer", Object.assign(Object.assign({}, this.logContext), {
        RTCSdpType: sd.type
      }));
      yield this.pcManager.setPublisherAnswer(sd);
    });
    this.client.onTrickle = (candidate, target) => {
      if (!this.pcManager) {
        return;
      }
      this.log.trace("got ICE candidate from peer", Object.assign(Object.assign({}, this.logContext), {
        candidate,
        target
      }));
      this.pcManager.addIceCandidate(candidate, target);
    };
    this.client.onOffer = (sd) => __awaiter(this, void 0, void 0, function* () {
      if (!this.pcManager) {
        return;
      }
      const answer = yield this.pcManager.createSubscriberAnswerFromOffer(sd);
      this.client.sendAnswer(answer);
    });
    this.client.onLocalTrackPublished = (res) => {
      var _a;
      this.log.debug("received trackPublishedResponse", Object.assign(Object.assign({}, this.logContext), {
        cid: res.cid,
        track: (_a = res.track) === null || _a === void 0 ? void 0 : _a.sid
      }));
      if (!this.pendingTrackResolvers[res.cid]) {
        this.log.error("missing track resolver for ".concat(res.cid), Object.assign(Object.assign({}, this.logContext), {
          cid: res.cid
        }));
        return;
      }
      const {
        resolve
      } = this.pendingTrackResolvers[res.cid];
      delete this.pendingTrackResolvers[res.cid];
      resolve(res.track);
    };
    this.client.onLocalTrackUnpublished = (response) => {
      this.emit(EngineEvent.LocalTrackUnpublished, response);
    };
    this.client.onLocalTrackSubscribed = (trackSid) => {
      this.emit(EngineEvent.LocalTrackSubscribed, trackSid);
    };
    this.client.onTokenRefresh = (token) => {
      this.token = token;
    };
    this.client.onRemoteMuteChanged = (trackSid, muted) => {
      this.emit(EngineEvent.RemoteMute, trackSid, muted);
    };
    this.client.onSubscribedQualityUpdate = (update) => {
      this.emit(EngineEvent.SubscribedQualityUpdate, update);
    };
    this.client.onClose = () => {
      this.handleDisconnect("signal", ReconnectReason.RR_SIGNAL_DISCONNECTED);
    };
    this.client.onLeave = (leave) => {
      this.log.debug("client leave request", Object.assign(Object.assign({}, this.logContext), {
        reason: leave === null || leave === void 0 ? void 0 : leave.reason
      }));
      if (leave.regions && this.regionUrlProvider) {
        this.log.debug("updating regions", this.logContext);
        this.regionUrlProvider.setServerReportedRegions(leave.regions);
      }
      switch (leave.action) {
        case LeaveRequest_Action.DISCONNECT:
          this.emit(EngineEvent.Disconnected, leave === null || leave === void 0 ? void 0 : leave.reason);
          this.close();
          break;
        case LeaveRequest_Action.RECONNECT:
          this.fullReconnectOnNext = true;
          this.handleDisconnect(leaveReconnect);
          break;
        case LeaveRequest_Action.RESUME:
          this.handleDisconnect(leaveReconnect);
      }
    };
  }
  makeRTCConfiguration(serverResponse) {
    var _a;
    const rtcConfig = Object.assign({}, this.rtcConfig);
    if ((_a = this.signalOpts) === null || _a === void 0 ? void 0 : _a.e2eeEnabled) {
      this.log.debug("E2EE - setting up transports with insertable streams", this.logContext);
      rtcConfig.encodedInsertableStreams = true;
    }
    if (serverResponse.iceServers && !rtcConfig.iceServers) {
      const rtcIceServers = [];
      serverResponse.iceServers.forEach((iceServer) => {
        const rtcIceServer = {
          urls: iceServer.urls
        };
        if (iceServer.username)
          rtcIceServer.username = iceServer.username;
        if (iceServer.credential) {
          rtcIceServer.credential = iceServer.credential;
        }
        rtcIceServers.push(rtcIceServer);
      });
      rtcConfig.iceServers = rtcIceServers;
    }
    if (serverResponse.clientConfiguration && serverResponse.clientConfiguration.forceRelay === ClientConfigSetting.ENABLED) {
      rtcConfig.iceTransportPolicy = "relay";
    }
    rtcConfig.sdpSemantics = "unified-plan";
    rtcConfig.continualGatheringPolicy = "gather_continually";
    return rtcConfig;
  }
  createDataChannels() {
    if (!this.pcManager) {
      return;
    }
    if (this.lossyDC) {
      this.lossyDC.onmessage = null;
      this.lossyDC.onerror = null;
    }
    if (this.reliableDC) {
      this.reliableDC.onmessage = null;
      this.reliableDC.onerror = null;
    }
    this.lossyDC = this.pcManager.createPublisherDataChannel(lossyDataChannel, {
      // will drop older packets that arrive
      ordered: true,
      maxRetransmits: 0
    });
    this.reliableDC = this.pcManager.createPublisherDataChannel(reliableDataChannel, {
      ordered: true
    });
    this.lossyDC.onmessage = this.handleDataMessage;
    this.reliableDC.onmessage = this.handleDataMessage;
    this.lossyDC.onerror = this.handleDataError;
    this.reliableDC.onerror = this.handleDataError;
    this.lossyDC.bufferedAmountLowThreshold = 65535;
    this.reliableDC.bufferedAmountLowThreshold = 65535;
    this.lossyDC.onbufferedamountlow = this.handleBufferedAmountLow;
    this.reliableDC.onbufferedamountlow = this.handleBufferedAmountLow;
  }
  createSender(track, opts, encodings) {
    return __awaiter(this, void 0, void 0, function* () {
      if (supportsTransceiver()) {
        const sender = yield this.createTransceiverRTCRtpSender(track, opts, encodings);
        return sender;
      }
      if (supportsAddTrack()) {
        this.log.warn("using add-track fallback", this.logContext);
        const sender = yield this.createRTCRtpSender(track.mediaStreamTrack);
        return sender;
      }
      throw new UnexpectedConnectionState("Required webRTC APIs not supported on this device");
    });
  }
  createSimulcastSender(track, simulcastTrack, opts, encodings) {
    return __awaiter(this, void 0, void 0, function* () {
      if (supportsTransceiver()) {
        return this.createSimulcastTransceiverSender(track, simulcastTrack, opts, encodings);
      }
      if (supportsAddTrack()) {
        this.log.debug("using add-track fallback", this.logContext);
        return this.createRTCRtpSender(track.mediaStreamTrack);
      }
      throw new UnexpectedConnectionState("Cannot stream on this device");
    });
  }
  createTransceiverRTCRtpSender(track, opts, encodings) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.pcManager) {
        throw new UnexpectedConnectionState("publisher is closed");
      }
      const streams = [];
      if (track.mediaStream) {
        streams.push(track.mediaStream);
      }
      if (isVideoTrack(track)) {
        track.codec = opts.videoCodec;
      }
      const transceiverInit = {
        direction: "sendonly",
        streams
      };
      if (encodings) {
        transceiverInit.sendEncodings = encodings;
      }
      const transceiver = yield this.pcManager.addPublisherTransceiver(track.mediaStreamTrack, transceiverInit);
      return transceiver.sender;
    });
  }
  createSimulcastTransceiverSender(track, simulcastTrack, opts, encodings) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.pcManager) {
        throw new UnexpectedConnectionState("publisher is closed");
      }
      const transceiverInit = {
        direction: "sendonly"
      };
      if (encodings) {
        transceiverInit.sendEncodings = encodings;
      }
      const transceiver = yield this.pcManager.addPublisherTransceiver(simulcastTrack.mediaStreamTrack, transceiverInit);
      if (!opts.videoCodec) {
        return;
      }
      track.setSimulcastTrackSender(opts.videoCodec, transceiver.sender);
      return transceiver.sender;
    });
  }
  createRTCRtpSender(track) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.pcManager) {
        throw new UnexpectedConnectionState("publisher is closed");
      }
      return this.pcManager.addPublisherTrack(track);
    });
  }
  attemptReconnect(reason) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      if (this._isClosed) {
        return;
      }
      if (this.attemptingReconnect) {
        livekitLogger.warn("already attempting reconnect, returning early", this.logContext);
        return;
      }
      if (((_a = this.clientConfiguration) === null || _a === void 0 ? void 0 : _a.resumeConnection) === ClientConfigSetting.DISABLED || // signaling state could change to closed due to hardware sleep
      // those connections cannot be resumed
      ((_c = (_b = this.pcManager) === null || _b === void 0 ? void 0 : _b.currentState) !== null && _c !== void 0 ? _c : PCTransportState.NEW) === PCTransportState.NEW) {
        this.fullReconnectOnNext = true;
      }
      try {
        this.attemptingReconnect = true;
        if (this.fullReconnectOnNext) {
          yield this.restartConnection();
        } else {
          yield this.resumeConnection(reason);
        }
        this.clearPendingReconnect();
        this.fullReconnectOnNext = false;
      } catch (e2) {
        this.reconnectAttempts += 1;
        let recoverable = true;
        if (e2 instanceof UnexpectedConnectionState) {
          this.log.debug("received unrecoverable error", Object.assign(Object.assign({}, this.logContext), {
            error: e2
          }));
          recoverable = false;
        } else if (!(e2 instanceof SignalReconnectError)) {
          this.fullReconnectOnNext = true;
        }
        if (recoverable) {
          this.handleDisconnect("reconnect", ReconnectReason.RR_UNKNOWN);
        } else {
          this.log.info("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(Date.now() - this.reconnectStart, "ms. giving up"), this.logContext);
          this.emit(EngineEvent.Disconnected);
          yield this.close();
        }
      } finally {
        this.attemptingReconnect = false;
      }
    });
  }
  getNextRetryDelay(context) {
    try {
      return this.reconnectPolicy.nextRetryDelayInMs(context);
    } catch (e2) {
      this.log.warn("encountered error in reconnect policy", Object.assign(Object.assign({}, this.logContext), {
        error: e2
      }));
    }
    return null;
  }
  restartConnection(regionUrl) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      try {
        if (!this.url || !this.token) {
          throw new UnexpectedConnectionState("could not reconnect, url or token not saved");
        }
        this.log.info("reconnecting, attempt: ".concat(this.reconnectAttempts), this.logContext);
        this.emit(EngineEvent.Restarting);
        if (!this.client.isDisconnected) {
          yield this.client.sendLeave();
        }
        yield this.cleanupPeerConnections();
        yield this.cleanupClient();
        let joinResponse;
        try {
          if (!this.signalOpts) {
            this.log.warn("attempted connection restart, without signal options present", this.logContext);
            throw new SignalReconnectError();
          }
          joinResponse = yield this.join(regionUrl !== null && regionUrl !== void 0 ? regionUrl : this.url, this.token, this.signalOpts);
        } catch (e2) {
          if (e2 instanceof ConnectionError && e2.reason === ConnectionErrorReason.NotAllowed) {
            throw new UnexpectedConnectionState("could not reconnect, token might be expired");
          }
          throw new SignalReconnectError();
        }
        if (this.shouldFailNext) {
          this.shouldFailNext = false;
          throw new Error("simulated failure");
        }
        this.client.setReconnected();
        this.emit(EngineEvent.SignalRestarted, joinResponse);
        yield this.waitForPCReconnected();
        if (this.client.currentState !== SignalConnectionState.CONNECTED) {
          throw new SignalReconnectError("Signal connection got severed during reconnect");
        }
        (_a = this.regionUrlProvider) === null || _a === void 0 ? void 0 : _a.resetAttempts();
        this.emit(EngineEvent.Restarted);
      } catch (error) {
        const nextRegionUrl = yield (_b = this.regionUrlProvider) === null || _b === void 0 ? void 0 : _b.getNextBestRegionUrl();
        if (nextRegionUrl) {
          yield this.restartConnection(nextRegionUrl);
          return;
        } else {
          (_c = this.regionUrlProvider) === null || _c === void 0 ? void 0 : _c.resetAttempts();
          throw error;
        }
      }
    });
  }
  resumeConnection(reason) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (!this.url || !this.token) {
        throw new UnexpectedConnectionState("could not reconnect, url or token not saved");
      }
      if (!this.pcManager) {
        throw new UnexpectedConnectionState("publisher and subscriber connections unset");
      }
      this.log.info("resuming signal connection, attempt ".concat(this.reconnectAttempts), this.logContext);
      this.emit(EngineEvent.Resuming);
      let res;
      try {
        this.setupSignalClientCallbacks();
        res = yield this.client.reconnect(this.url, this.token, this.participantSid, reason);
      } catch (error) {
        let message = "";
        if (error instanceof Error) {
          message = error.message;
          this.log.error(error.message, Object.assign(Object.assign({}, this.logContext), {
            error
          }));
        }
        if (error instanceof ConnectionError && error.reason === ConnectionErrorReason.NotAllowed) {
          throw new UnexpectedConnectionState("could not reconnect, token might be expired");
        }
        if (error instanceof ConnectionError && error.reason === ConnectionErrorReason.LeaveRequest) {
          throw error;
        }
        throw new SignalReconnectError(message);
      }
      this.emit(EngineEvent.SignalResumed);
      if (res) {
        const rtcConfig = this.makeRTCConfiguration(res);
        this.pcManager.updateConfiguration(rtcConfig);
      } else {
        this.log.warn("Did not receive reconnect response", this.logContext);
      }
      if (this.shouldFailNext) {
        this.shouldFailNext = false;
        throw new Error("simulated failure");
      }
      yield this.pcManager.triggerIceRestart();
      yield this.waitForPCReconnected();
      if (this.client.currentState !== SignalConnectionState.CONNECTED) {
        throw new SignalReconnectError("Signal connection got severed during reconnect");
      }
      this.client.setReconnected();
      if (((_a = this.reliableDC) === null || _a === void 0 ? void 0 : _a.readyState) === "open" && this.reliableDC.id === null) {
        this.createDataChannels();
      }
      this.emit(EngineEvent.Resumed);
    });
  }
  waitForPCInitialConnection(timeout, abortController) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.pcManager) {
        throw new UnexpectedConnectionState("PC manager is closed");
      }
      yield this.pcManager.ensurePCTransportConnection(abortController, timeout);
    });
  }
  waitForPCReconnected() {
    return __awaiter(this, void 0, void 0, function* () {
      this.pcState = PCState.Reconnecting;
      this.log.debug("waiting for peer connection to reconnect", this.logContext);
      try {
        yield sleep(minReconnectWait);
        if (!this.pcManager) {
          throw new UnexpectedConnectionState("PC manager is closed");
        }
        yield this.pcManager.ensurePCTransportConnection(void 0, this.peerConnectionTimeout);
        this.pcState = PCState.Connected;
      } catch (e2) {
        this.pcState = PCState.Disconnected;
        throw new ConnectionError("could not establish PC connection, ".concat(e2.message), ConnectionErrorReason.InternalError);
      }
    });
  }
  /** @internal */
  publishRpcResponse(destinationIdentity, requestId, payload, error) {
    return __awaiter(this, void 0, void 0, function* () {
      const packet = new DataPacket({
        destinationIdentities: [destinationIdentity],
        kind: DataPacket_Kind.RELIABLE,
        value: {
          case: "rpcResponse",
          value: new RpcResponse({
            requestId,
            value: error ? {
              case: "error",
              value: error.toProto()
            } : {
              case: "payload",
              value: payload !== null && payload !== void 0 ? payload : ""
            }
          })
        }
      });
      yield this.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
    });
  }
  /** @internal */
  publishRpcAck(destinationIdentity, requestId) {
    return __awaiter(this, void 0, void 0, function* () {
      const packet = new DataPacket({
        destinationIdentities: [destinationIdentity],
        kind: DataPacket_Kind.RELIABLE,
        value: {
          case: "rpcAck",
          value: new RpcAck({
            requestId
          })
        }
      });
      yield this.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
    });
  }
  /* @internal */
  sendDataPacket(packet, kind) {
    return __awaiter(this, void 0, void 0, function* () {
      const msg = packet.toBinary();
      yield this.ensurePublisherConnected(kind);
      const dc = this.dataChannelForKind(kind);
      if (dc) {
        dc.send(msg);
      }
      this.updateAndEmitDCBufferStatus(kind);
    });
  }
  waitForBufferStatusLow(kind) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
      if (this.isBufferStatusLow(kind)) {
        resolve();
      } else {
        const onClosing = () => reject("Engine closed");
        this.once(EngineEvent.Closing, onClosing);
        while (!this.dcBufferStatus.get(kind)) {
          yield sleep(10);
        }
        this.off(EngineEvent.Closing, onClosing);
        resolve();
      }
    }));
  }
  /**
   * @internal
   */
  ensureDataTransportConnected(kind_1) {
    return __awaiter(this, arguments, void 0, function(kind) {
      var _this2 = this;
      let subscriber = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.subscriberPrimary;
      return function* () {
        var _a;
        if (!_this2.pcManager) {
          throw new UnexpectedConnectionState("PC manager is closed");
        }
        const transport = subscriber ? _this2.pcManager.subscriber : _this2.pcManager.publisher;
        const transportName = subscriber ? "Subscriber" : "Publisher";
        if (!transport) {
          throw new ConnectionError("".concat(transportName, " connection not set"), ConnectionErrorReason.InternalError);
        }
        let needNegotiation = false;
        if (!subscriber && !_this2.dataChannelForKind(kind, subscriber)) {
          _this2.createDataChannels();
          needNegotiation = true;
        }
        if (!needNegotiation && !subscriber && !_this2.pcManager.publisher.isICEConnected && _this2.pcManager.publisher.getICEConnectionState() !== "checking") {
          needNegotiation = true;
        }
        if (needNegotiation) {
          _this2.negotiate();
        }
        const targetChannel = _this2.dataChannelForKind(kind, subscriber);
        if ((targetChannel === null || targetChannel === void 0 ? void 0 : targetChannel.readyState) === "open") {
          return;
        }
        const endTime = (/* @__PURE__ */ new Date()).getTime() + _this2.peerConnectionTimeout;
        while ((/* @__PURE__ */ new Date()).getTime() < endTime) {
          if (transport.isICEConnected && ((_a = _this2.dataChannelForKind(kind, subscriber)) === null || _a === void 0 ? void 0 : _a.readyState) === "open") {
            return;
          }
          yield sleep(50);
        }
        throw new ConnectionError("could not establish ".concat(transportName, " connection, state: ").concat(transport.getICEConnectionState()), ConnectionErrorReason.InternalError);
      }();
    });
  }
  ensurePublisherConnected(kind) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.publisherConnectionPromise) {
        this.publisherConnectionPromise = this.ensureDataTransportConnected(kind, false);
      }
      yield this.publisherConnectionPromise;
    });
  }
  /* @internal */
  verifyTransport() {
    if (!this.pcManager) {
      return false;
    }
    if (this.pcManager.currentState !== PCTransportState.CONNECTED) {
      return false;
    }
    if (!this.client.ws || this.client.ws.readyState === WebSocket.CLOSED) {
      return false;
    }
    return true;
  }
  /** @internal */
  negotiate() {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (!this.pcManager) {
          reject(new NegotiationError("PC manager is closed"));
          return;
        }
        this.pcManager.requirePublisher();
        if (this.pcManager.publisher.getTransceivers().length == 0 && !this.lossyDC && !this.reliableDC) {
          this.createDataChannels();
        }
        const abortController = new AbortController();
        const handleClosed = () => {
          abortController.abort();
          this.log.debug("engine disconnected while negotiation was ongoing", this.logContext);
          resolve();
          return;
        };
        if (this.isClosed) {
          reject("cannot negotiate on closed engine");
        }
        this.on(EngineEvent.Closing, handleClosed);
        this.pcManager.publisher.once(PCEvents.RTPVideoPayloadTypes, (rtpTypes) => {
          const rtpMap = /* @__PURE__ */ new Map();
          rtpTypes.forEach((rtp) => {
            const codec = rtp.codec.toLowerCase();
            if (isVideoCodec(codec)) {
              rtpMap.set(rtp.payload, codec);
            }
          });
          this.emit(EngineEvent.RTPVideoMapUpdate, rtpMap);
        });
        try {
          yield this.pcManager.negotiate(abortController);
          resolve();
        } catch (e2) {
          if (e2 instanceof NegotiationError) {
            this.fullReconnectOnNext = true;
          }
          this.handleDisconnect("negotiation", ReconnectReason.RR_UNKNOWN);
          reject(e2);
        } finally {
          this.off(EngineEvent.Closing, handleClosed);
        }
      }));
    });
  }
  dataChannelForKind(kind, sub) {
    if (!sub) {
      if (kind === DataPacket_Kind.LOSSY) {
        return this.lossyDC;
      }
      if (kind === DataPacket_Kind.RELIABLE) {
        return this.reliableDC;
      }
    } else {
      if (kind === DataPacket_Kind.LOSSY) {
        return this.lossyDCSub;
      }
      if (kind === DataPacket_Kind.RELIABLE) {
        return this.reliableDCSub;
      }
    }
  }
  /** @internal */
  sendSyncState(remoteTracks, localTracks) {
    var _a, _b;
    if (!this.pcManager) {
      this.log.warn("sync state cannot be sent without peer connection setup", this.logContext);
      return;
    }
    const previousAnswer = this.pcManager.subscriber.getLocalDescription();
    const previousOffer = this.pcManager.subscriber.getRemoteDescription();
    const autoSubscribe = (_b = (_a = this.signalOpts) === null || _a === void 0 ? void 0 : _a.autoSubscribe) !== null && _b !== void 0 ? _b : true;
    const trackSids = new Array();
    const trackSidsDisabled = new Array();
    remoteTracks.forEach((track) => {
      if (track.isDesired !== autoSubscribe) {
        trackSids.push(track.trackSid);
      }
      if (!track.isEnabled) {
        trackSidsDisabled.push(track.trackSid);
      }
    });
    this.client.sendSyncState(new SyncState({
      answer: previousAnswer ? toProtoSessionDescription({
        sdp: previousAnswer.sdp,
        type: previousAnswer.type
      }) : void 0,
      offer: previousOffer ? toProtoSessionDescription({
        sdp: previousOffer.sdp,
        type: previousOffer.type
      }) : void 0,
      subscription: new UpdateSubscription({
        trackSids,
        subscribe: !autoSubscribe,
        participantTracks: []
      }),
      publishTracks: getTrackPublicationInfo(localTracks),
      dataChannels: this.dataChannelsInfo(),
      trackSidsDisabled
    }));
  }
  /* @internal */
  failNext() {
    this.shouldFailNext = true;
  }
  dataChannelsInfo() {
    const infos = [];
    const getInfo = (dc, target) => {
      if ((dc === null || dc === void 0 ? void 0 : dc.id) !== void 0 && dc.id !== null) {
        infos.push(new DataChannelInfo({
          label: dc.label,
          id: dc.id,
          target
        }));
      }
    };
    getInfo(this.dataChannelForKind(DataPacket_Kind.LOSSY), SignalTarget.PUBLISHER);
    getInfo(this.dataChannelForKind(DataPacket_Kind.RELIABLE), SignalTarget.PUBLISHER);
    getInfo(this.dataChannelForKind(DataPacket_Kind.LOSSY, true), SignalTarget.SUBSCRIBER);
    getInfo(this.dataChannelForKind(DataPacket_Kind.RELIABLE, true), SignalTarget.SUBSCRIBER);
    return infos;
  }
  clearReconnectTimeout() {
    if (this.reconnectTimeout) {
      CriticalTimers.clearTimeout(this.reconnectTimeout);
    }
  }
  clearPendingReconnect() {
    this.clearReconnectTimeout();
    this.reconnectAttempts = 0;
  }
  registerOnLineListener() {
    if (isWeb()) {
      window.addEventListener("online", this.handleBrowserOnLine);
    }
  }
  deregisterOnLineListener() {
    if (isWeb()) {
      window.removeEventListener("online", this.handleBrowserOnLine);
    }
  }
};
var SignalReconnectError = class extends Error {
};
function supportOptionalDatachannel(protocol) {
  return protocol !== void 0 && protocol > 13;
}
function applyUserDataCompat(newObj, oldObj) {
  const participantIdentity = newObj.participantIdentity ? newObj.participantIdentity : oldObj.participantIdentity;
  newObj.participantIdentity = participantIdentity;
  oldObj.participantIdentity = participantIdentity;
  const destinationIdentities = newObj.destinationIdentities.length !== 0 ? newObj.destinationIdentities : oldObj.destinationIdentities;
  newObj.destinationIdentities = destinationIdentities;
  oldObj.destinationIdentities = destinationIdentities;
}
var RegionUrlProvider = class {
  constructor(url, token) {
    this.lastUpdateAt = 0;
    this.settingsCacheTime = 3e3;
    this.attemptedRegions = [];
    this.serverUrl = new URL(url);
    this.token = token;
  }
  updateToken(token) {
    this.token = token;
  }
  isCloud() {
    return isCloud(this.serverUrl);
  }
  getServerUrl() {
    return this.serverUrl;
  }
  getNextBestRegionUrl(abortSignal) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.isCloud()) {
        throw Error("region availability is only supported for LiveKit Cloud domains");
      }
      if (!this.regionSettings || Date.now() - this.lastUpdateAt > this.settingsCacheTime) {
        this.regionSettings = yield this.fetchRegionSettings(abortSignal);
      }
      const regionsLeft = this.regionSettings.regions.filter((region) => !this.attemptedRegions.find((attempted) => attempted.url === region.url));
      if (regionsLeft.length > 0) {
        const nextRegion = regionsLeft[0];
        this.attemptedRegions.push(nextRegion);
        livekitLogger.debug("next region: ".concat(nextRegion.region));
        return nextRegion.url;
      } else {
        return null;
      }
    });
  }
  resetAttempts() {
    this.attemptedRegions = [];
  }
  /* @internal */
  fetchRegionSettings(signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const regionSettingsResponse = yield fetch("".concat(getCloudConfigUrl(this.serverUrl), "/regions"), {
        headers: {
          authorization: "Bearer ".concat(this.token)
        },
        signal
      });
      if (regionSettingsResponse.ok) {
        const regionSettings = yield regionSettingsResponse.json();
        this.lastUpdateAt = Date.now();
        return regionSettings;
      } else {
        throw new ConnectionError("Could not fetch region settings: ".concat(regionSettingsResponse.statusText), regionSettingsResponse.status === 401 ? ConnectionErrorReason.NotAllowed : ConnectionErrorReason.InternalError, regionSettingsResponse.status);
      }
    });
  }
  setServerReportedRegions(regions) {
    this.regionSettings = regions;
    this.lastUpdateAt = Date.now();
  }
};
function getCloudConfigUrl(serverUrl) {
  return "".concat(serverUrl.protocol.replace("ws", "http"), "//").concat(serverUrl.host, "/settings");
}
var BaseStreamReader = class {
  get info() {
    return this._info;
  }
  constructor(info, stream, totalByteSize) {
    this.reader = stream;
    this.totalByteSize = totalByteSize;
    this._info = info;
    this.bytesReceived = 0;
  }
};
var ByteStreamReader = class extends BaseStreamReader {
  handleChunkReceived(chunk) {
    var _a;
    this.bytesReceived += chunk.content.byteLength;
    const currentProgress = this.totalByteSize ? this.bytesReceived / this.totalByteSize : void 0;
    (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, currentProgress);
  }
  [Symbol.asyncIterator]() {
    const reader = this.reader.getReader();
    return {
      next: () => __awaiter(this, void 0, void 0, function* () {
        try {
          const {
            done,
            value
          } = yield reader.read();
          if (done) {
            return {
              done: true,
              value: void 0
            };
          } else {
            this.handleChunkReceived(value);
            return {
              done: false,
              value: value.content
            };
          }
        } catch (error) {
          return {
            done: true,
            value: void 0
          };
        }
      }),
      return() {
        return __awaiter(this, void 0, void 0, function* () {
          reader.releaseLock();
          return {
            done: true,
            value: void 0
          };
        });
      }
    };
  }
  readAll() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      let chunks = /* @__PURE__ */ new Set();
      try {
        for (var _d = true, _e = __asyncValues(this), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const chunk = _c;
          chunks.add(chunk);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return))
            yield _b.call(_e);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return Array.from(chunks);
    });
  }
};
var TextStreamReader = class extends BaseStreamReader {
  /**
   * A TextStreamReader instance can be used as an AsyncIterator that returns the entire string
   * that has been received up to the current point in time.
   */
  constructor(info, stream, totalChunkCount) {
    super(info, stream, totalChunkCount);
    this.receivedChunks = /* @__PURE__ */ new Map();
  }
  handleChunkReceived(chunk) {
    var _a;
    const index = bigIntToNumber(chunk.chunkIndex);
    const previousChunkAtIndex = this.receivedChunks.get(index);
    if (previousChunkAtIndex && previousChunkAtIndex.version > chunk.version) {
      return;
    }
    this.receivedChunks.set(index, chunk);
    this.bytesReceived += chunk.content.byteLength;
    const currentProgress = this.totalByteSize ? this.bytesReceived / this.totalByteSize : void 0;
    (_a = this.onProgress) === null || _a === void 0 ? void 0 : _a.call(this, currentProgress);
  }
  /**
   * Async iterator implementation to allow usage of `for await...of` syntax.
   * Yields structured chunks from the stream.
   *
   */
  [Symbol.asyncIterator]() {
    const reader = this.reader.getReader();
    const decoder = new TextDecoder();
    return {
      next: () => __awaiter(this, void 0, void 0, function* () {
        try {
          const {
            done,
            value
          } = yield reader.read();
          if (done) {
            return {
              done: true,
              value: void 0
            };
          } else {
            this.handleChunkReceived(value);
            return {
              done: false,
              value: {
                index: bigIntToNumber(value.chunkIndex),
                current: decoder.decode(value.content),
                collected: Array.from(this.receivedChunks.values()).sort((a, b) => bigIntToNumber(a.chunkIndex) - bigIntToNumber(b.chunkIndex)).map((chunk) => decoder.decode(chunk.content)).join("")
              }
            };
          }
        } catch (error) {
          return {
            done: true,
            value: void 0
          };
        }
      }),
      return() {
        return __awaiter(this, void 0, void 0, function* () {
          reader.releaseLock();
          return {
            done: true,
            value: void 0
          };
        });
      }
    };
  }
  readAll() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_2, _b, _c;
      let latestString = "";
      try {
        for (var _d = true, _e = __asyncValues(this), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const {
            collected
          } = _c;
          latestString = collected;
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return))
            yield _b.call(_e);
        } finally {
          if (e_2)
            throw e_2.error;
        }
      }
      return latestString;
    });
  }
};
var BaseStreamWriter = class {
  constructor(writableStream, info, onClose) {
    this.writableStream = writableStream;
    this.defaultWriter = writableStream.getWriter();
    this.onClose = onClose;
    this.info = info;
  }
  write(chunk) {
    return this.defaultWriter.write([chunk]);
  }
  close() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      yield this.defaultWriter.close();
      this.defaultWriter.releaseLock();
      (_a = this.onClose) === null || _a === void 0 ? void 0 : _a.call(this);
    });
  }
};
var TextStreamWriter = class extends BaseStreamWriter {
};
var RemoteTrack = class extends Track {
  constructor(mediaTrack, sid, kind, receiver, loggerOptions) {
    super(mediaTrack, kind, loggerOptions);
    this.sid = sid;
    this.receiver = receiver;
  }
  get isLocal() {
    return false;
  }
  /** @internal */
  setMuted(muted) {
    if (this.isMuted !== muted) {
      this.isMuted = muted;
      this._mediaStreamTrack.enabled = !muted;
      this.emit(muted ? TrackEvent.Muted : TrackEvent.Unmuted, this);
    }
  }
  /** @internal */
  setMediaStream(stream) {
    this.mediaStream = stream;
    const onRemoveTrack = (event) => {
      if (event.track === this._mediaStreamTrack) {
        stream.removeEventListener("removetrack", onRemoveTrack);
        if (this.receiver && "playoutDelayHint" in this.receiver) {
          this.receiver.playoutDelayHint = void 0;
        }
        this.receiver = void 0;
        this._currentBitrate = 0;
        this.emit(TrackEvent.Ended, this);
      }
    };
    stream.addEventListener("removetrack", onRemoveTrack);
  }
  start() {
    this.startMonitor();
    super.enable();
  }
  stop() {
    this.stopMonitor();
    super.disable();
  }
  /**
   * Gets the RTCStatsReport for the RemoteTrack's underlying RTCRtpReceiver
   * See https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsReport
   *
   * @returns Promise<RTCStatsReport> | undefined
   */
  getRTCStatsReport() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (!((_a = this.receiver) === null || _a === void 0 ? void 0 : _a.getStats)) {
        return;
      }
      const statsReport = yield this.receiver.getStats();
      return statsReport;
    });
  }
  /**
   * Allows to set a playout delay (in seconds) for this track.
   * A higher value allows for more buffering of the track in the browser
   * and will result in a delay of media being played back of `delayInSeconds`
   */
  setPlayoutDelay(delayInSeconds) {
    if (this.receiver) {
      if ("playoutDelayHint" in this.receiver) {
        this.receiver.playoutDelayHint = delayInSeconds;
      } else {
        this.log.warn("Playout delay not supported in this browser");
      }
    } else {
      this.log.warn("Cannot set playout delay, track already ended");
    }
  }
  /**
   * Returns the current playout delay (in seconds) of this track.
   */
  getPlayoutDelay() {
    if (this.receiver) {
      if ("playoutDelayHint" in this.receiver) {
        return this.receiver.playoutDelayHint;
      } else {
        this.log.warn("Playout delay not supported in this browser");
      }
    } else {
      this.log.warn("Cannot get playout delay, track already ended");
    }
    return 0;
  }
  /* @internal */
  startMonitor() {
    if (!this.monitorInterval) {
      this.monitorInterval = setInterval(() => this.monitorReceiver(), monitorFrequency);
    }
    if (supportsSynchronizationSources()) {
      this.registerTimeSyncUpdate();
    }
  }
  registerTimeSyncUpdate() {
    const loop = () => {
      var _a;
      this.timeSyncHandle = requestAnimationFrame(() => loop());
      const sources = (_a = this.receiver) === null || _a === void 0 ? void 0 : _a.getSynchronizationSources()[0];
      if (sources) {
        const {
          timestamp,
          rtpTimestamp
        } = sources;
        if (rtpTimestamp && this.rtpTimestamp !== rtpTimestamp) {
          this.emit(TrackEvent.TimeSyncUpdate, {
            timestamp,
            rtpTimestamp
          });
          this.rtpTimestamp = rtpTimestamp;
        }
      }
    };
    loop();
  }
};
var RemoteAudioTrack = class extends RemoteTrack {
  constructor(mediaTrack, sid, receiver, audioContext, audioOutput, loggerOptions) {
    super(mediaTrack, sid, Track.Kind.Audio, receiver, loggerOptions);
    this.monitorReceiver = () => __awaiter(this, void 0, void 0, function* () {
      if (!this.receiver) {
        this._currentBitrate = 0;
        return;
      }
      const stats = yield this.getReceiverStats();
      if (stats && this.prevStats && this.receiver) {
        this._currentBitrate = computeBitrate(stats, this.prevStats);
      }
      this.prevStats = stats;
    });
    this.audioContext = audioContext;
    this.webAudioPluginNodes = [];
    if (audioOutput) {
      this.sinkId = audioOutput.deviceId;
    }
  }
  /**
   * sets the volume for all attached audio elements
   */
  setVolume(volume) {
    var _a;
    for (const el of this.attachedElements) {
      if (this.audioContext) {
        (_a = this.gainNode) === null || _a === void 0 ? void 0 : _a.gain.setTargetAtTime(volume, 0, 0.1);
      } else {
        el.volume = volume;
      }
    }
    if (isReactNative()) {
      this._mediaStreamTrack._setVolume(volume);
    }
    this.elementVolume = volume;
  }
  /**
   * gets the volume of attached audio elements (loudest)
   */
  getVolume() {
    if (this.elementVolume) {
      return this.elementVolume;
    }
    if (isReactNative()) {
      return 1;
    }
    let highestVolume = 0;
    this.attachedElements.forEach((element) => {
      if (element.volume > highestVolume) {
        highestVolume = element.volume;
      }
    });
    return highestVolume;
  }
  /**
   * calls setSinkId on all attached elements, if supported
   * @param deviceId audio output device
   */
  setSinkId(deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
      this.sinkId = deviceId;
      yield Promise.all(this.attachedElements.map((elm) => {
        if (!supportsSetSinkId(elm)) {
          return;
        }
        return elm.setSinkId(deviceId);
      }));
    });
  }
  attach(element) {
    const needsNewWebAudioConnection = this.attachedElements.length === 0;
    if (!element) {
      element = super.attach();
    } else {
      super.attach(element);
    }
    if (this.sinkId && supportsSetSinkId(element)) {
      element.setSinkId(this.sinkId);
    }
    if (this.audioContext && needsNewWebAudioConnection) {
      this.log.debug("using audio context mapping", this.logContext);
      this.connectWebAudio(this.audioContext, element);
      element.volume = 0;
      element.muted = true;
    }
    if (this.elementVolume) {
      this.setVolume(this.elementVolume);
    }
    return element;
  }
  detach(element) {
    let detached;
    if (!element) {
      detached = super.detach();
      this.disconnectWebAudio();
    } else {
      detached = super.detach(element);
      if (this.audioContext) {
        if (this.attachedElements.length > 0) {
          this.connectWebAudio(this.audioContext, this.attachedElements[0]);
        } else {
          this.disconnectWebAudio();
        }
      }
    }
    return detached;
  }
  /**
   * @internal
   * @experimental
   */
  setAudioContext(audioContext) {
    this.audioContext = audioContext;
    if (audioContext && this.attachedElements.length > 0) {
      this.connectWebAudio(audioContext, this.attachedElements[0]);
    } else if (!audioContext) {
      this.disconnectWebAudio();
    }
  }
  /**
   * @internal
   * @experimental
   * @param {AudioNode[]} nodes - An array of WebAudio nodes. These nodes should not be connected to each other when passed, as the sdk will take care of connecting them in the order of the array.
   */
  setWebAudioPlugins(nodes) {
    this.webAudioPluginNodes = nodes;
    if (this.attachedElements.length > 0 && this.audioContext) {
      this.connectWebAudio(this.audioContext, this.attachedElements[0]);
    }
  }
  connectWebAudio(context, element) {
    this.disconnectWebAudio();
    this.sourceNode = context.createMediaStreamSource(element.srcObject);
    let lastNode = this.sourceNode;
    this.webAudioPluginNodes.forEach((node) => {
      lastNode.connect(node);
      lastNode = node;
    });
    this.gainNode = context.createGain();
    lastNode.connect(this.gainNode);
    this.gainNode.connect(context.destination);
    if (this.elementVolume) {
      this.gainNode.gain.setTargetAtTime(this.elementVolume, 0, 0.1);
    }
    if (context.state !== "running") {
      context.resume().then(() => {
        if (context.state !== "running") {
          this.emit(TrackEvent.AudioPlaybackFailed, new Error("Audio Context couldn't be started automatically"));
        }
      }).catch((e2) => {
        this.emit(TrackEvent.AudioPlaybackFailed, e2);
      });
    }
  }
  disconnectWebAudio() {
    var _a, _b;
    (_a = this.gainNode) === null || _a === void 0 ? void 0 : _a.disconnect();
    (_b = this.sourceNode) === null || _b === void 0 ? void 0 : _b.disconnect();
    this.gainNode = void 0;
    this.sourceNode = void 0;
  }
  getReceiverStats() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.receiver || !this.receiver.getStats) {
        return;
      }
      const stats = yield this.receiver.getStats();
      let receiverStats;
      stats.forEach((v) => {
        if (v.type === "inbound-rtp") {
          receiverStats = {
            type: "audio",
            streamId: v.id,
            timestamp: v.timestamp,
            jitter: v.jitter,
            bytesReceived: v.bytesReceived,
            concealedSamples: v.concealedSamples,
            concealmentEvents: v.concealmentEvents,
            silentConcealedSamples: v.silentConcealedSamples,
            silentConcealmentEvents: v.silentConcealmentEvents,
            totalAudioEnergy: v.totalAudioEnergy,
            totalSamplesDuration: v.totalSamplesDuration
          };
        }
      });
      return receiverStats;
    });
  }
};
var REACTION_DELAY = 100;
var RemoteVideoTrack = class extends RemoteTrack {
  constructor(mediaTrack, sid, receiver, adaptiveStreamSettings, loggerOptions) {
    super(mediaTrack, sid, Track.Kind.Video, receiver, loggerOptions);
    this.elementInfos = [];
    this.monitorReceiver = () => __awaiter(this, void 0, void 0, function* () {
      if (!this.receiver) {
        this._currentBitrate = 0;
        return;
      }
      const stats = yield this.getReceiverStats();
      if (stats && this.prevStats && this.receiver) {
        this._currentBitrate = computeBitrate(stats, this.prevStats);
      }
      this.prevStats = stats;
    });
    this.debouncedHandleResize = r(() => {
      this.updateDimensions();
    }, REACTION_DELAY);
    this.adaptiveStreamSettings = adaptiveStreamSettings;
  }
  get isAdaptiveStream() {
    return this.adaptiveStreamSettings !== void 0;
  }
  /**
   * Note: When using adaptiveStream, you need to use remoteVideoTrack.attach() to add the track to a HTMLVideoElement, otherwise your video tracks might never start
   */
  get mediaStreamTrack() {
    return this._mediaStreamTrack;
  }
  /** @internal */
  setMuted(muted) {
    super.setMuted(muted);
    this.attachedElements.forEach((element) => {
      if (muted) {
        detachTrack(this._mediaStreamTrack, element);
      } else {
        attachToElement(this._mediaStreamTrack, element);
      }
    });
  }
  attach(element) {
    if (!element) {
      element = super.attach();
    } else {
      super.attach(element);
    }
    if (this.adaptiveStreamSettings && this.elementInfos.find((info) => info.element === element) === void 0) {
      const elementInfo = new HTMLElementInfo(element);
      this.observeElementInfo(elementInfo);
    }
    return element;
  }
  /**
   * Observe an ElementInfo for changes when adaptive streaming.
   * @param elementInfo
   * @internal
   */
  observeElementInfo(elementInfo) {
    if (this.adaptiveStreamSettings && this.elementInfos.find((info) => info === elementInfo) === void 0) {
      elementInfo.handleResize = () => {
        this.debouncedHandleResize();
      };
      elementInfo.handleVisibilityChanged = () => {
        this.updateVisibility();
      };
      this.elementInfos.push(elementInfo);
      elementInfo.observe();
      this.debouncedHandleResize();
      this.updateVisibility();
    } else {
      this.log.warn("visibility resize observer not triggered", this.logContext);
    }
  }
  /**
   * Stop observing an ElementInfo for changes.
   * @param elementInfo
   * @internal
   */
  stopObservingElementInfo(elementInfo) {
    if (!this.isAdaptiveStream) {
      this.log.warn("stopObservingElementInfo ignored", this.logContext);
      return;
    }
    const stopElementInfos = this.elementInfos.filter((info) => info === elementInfo);
    for (const info of stopElementInfos) {
      info.stopObserving();
    }
    this.elementInfos = this.elementInfos.filter((info) => info !== elementInfo);
    this.updateVisibility();
    this.debouncedHandleResize();
  }
  detach(element) {
    let detachedElements = [];
    if (element) {
      this.stopObservingElement(element);
      return super.detach(element);
    }
    detachedElements = super.detach();
    for (const e2 of detachedElements) {
      this.stopObservingElement(e2);
    }
    return detachedElements;
  }
  /** @internal */
  getDecoderImplementation() {
    var _a;
    return (_a = this.prevStats) === null || _a === void 0 ? void 0 : _a.decoderImplementation;
  }
  getReceiverStats() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.receiver || !this.receiver.getStats) {
        return;
      }
      const stats = yield this.receiver.getStats();
      let receiverStats;
      let codecID = "";
      let codecs = /* @__PURE__ */ new Map();
      stats.forEach((v) => {
        if (v.type === "inbound-rtp") {
          codecID = v.codecId;
          receiverStats = {
            type: "video",
            streamId: v.id,
            framesDecoded: v.framesDecoded,
            framesDropped: v.framesDropped,
            framesReceived: v.framesReceived,
            packetsReceived: v.packetsReceived,
            packetsLost: v.packetsLost,
            frameWidth: v.frameWidth,
            frameHeight: v.frameHeight,
            pliCount: v.pliCount,
            firCount: v.firCount,
            nackCount: v.nackCount,
            jitter: v.jitter,
            timestamp: v.timestamp,
            bytesReceived: v.bytesReceived,
            decoderImplementation: v.decoderImplementation
          };
        } else if (v.type === "codec") {
          codecs.set(v.id, v);
        }
      });
      if (receiverStats && codecID !== "" && codecs.get(codecID)) {
        receiverStats.mimeType = codecs.get(codecID).mimeType;
      }
      return receiverStats;
    });
  }
  stopObservingElement(element) {
    const stopElementInfos = this.elementInfos.filter((info) => info.element === element);
    for (const info of stopElementInfos) {
      this.stopObservingElementInfo(info);
    }
  }
  handleAppVisibilityChanged() {
    const _super = Object.create(null, {
      handleAppVisibilityChanged: {
        get: () => super.handleAppVisibilityChanged
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      yield _super.handleAppVisibilityChanged.call(this);
      if (!this.isAdaptiveStream)
        return;
      this.updateVisibility();
    });
  }
  updateVisibility() {
    var _a, _b;
    const lastVisibilityChange = this.elementInfos.reduce((prev, info) => Math.max(prev, info.visibilityChangedAt || 0), 0);
    const backgroundPause = ((_b = (_a = this.adaptiveStreamSettings) === null || _a === void 0 ? void 0 : _a.pauseVideoInBackground) !== null && _b !== void 0 ? _b : true) ? this.isInBackground : false;
    const isPiPMode = this.elementInfos.some((info) => info.pictureInPicture);
    const isVisible = this.elementInfos.some((info) => info.visible) && !backgroundPause || isPiPMode;
    if (this.lastVisible === isVisible) {
      return;
    }
    if (!isVisible && Date.now() - lastVisibilityChange < REACTION_DELAY) {
      CriticalTimers.setTimeout(() => {
        this.updateVisibility();
      }, REACTION_DELAY);
      return;
    }
    this.lastVisible = isVisible;
    this.emit(TrackEvent.VisibilityChanged, isVisible, this);
  }
  updateDimensions() {
    var _a, _b;
    let maxWidth = 0;
    let maxHeight = 0;
    const pixelDensity = this.getPixelDensity();
    for (const info of this.elementInfos) {
      const currentElementWidth = info.width() * pixelDensity;
      const currentElementHeight = info.height() * pixelDensity;
      if (currentElementWidth + currentElementHeight > maxWidth + maxHeight) {
        maxWidth = currentElementWidth;
        maxHeight = currentElementHeight;
      }
    }
    if (((_a = this.lastDimensions) === null || _a === void 0 ? void 0 : _a.width) === maxWidth && ((_b = this.lastDimensions) === null || _b === void 0 ? void 0 : _b.height) === maxHeight) {
      return;
    }
    this.lastDimensions = {
      width: maxWidth,
      height: maxHeight
    };
    this.emit(TrackEvent.VideoDimensionsChanged, this.lastDimensions, this);
  }
  getPixelDensity() {
    var _a;
    const pixelDensity = (_a = this.adaptiveStreamSettings) === null || _a === void 0 ? void 0 : _a.pixelDensity;
    if (pixelDensity === "screen") {
      return getDevicePixelRatio();
    } else if (!pixelDensity) {
      const devicePixelRatio = getDevicePixelRatio();
      if (devicePixelRatio > 2) {
        return 2;
      } else {
        return 1;
      }
    }
    return pixelDensity;
  }
};
var HTMLElementInfo = class {
  get visible() {
    return this.isPiP || this.isIntersecting;
  }
  get pictureInPicture() {
    return this.isPiP;
  }
  constructor(element, visible) {
    this.onVisibilityChanged = (entry) => {
      var _a;
      const {
        target,
        isIntersecting
      } = entry;
      if (target === this.element) {
        this.isIntersecting = isIntersecting;
        this.isPiP = isElementInPiP(this.element);
        this.visibilityChangedAt = Date.now();
        (_a = this.handleVisibilityChanged) === null || _a === void 0 ? void 0 : _a.call(this);
      }
    };
    this.onEnterPiP = () => {
      var _a, _b, _c;
      (_b = (_a = window.documentPictureInPicture) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.addEventListener("pagehide", this.onLeavePiP);
      this.isPiP = isElementInPiP(this.element);
      (_c = this.handleVisibilityChanged) === null || _c === void 0 ? void 0 : _c.call(this);
    };
    this.onLeavePiP = () => {
      var _a;
      this.isPiP = isElementInPiP(this.element);
      (_a = this.handleVisibilityChanged) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    this.element = element;
    this.isIntersecting = visible !== null && visible !== void 0 ? visible : isElementInViewport(element);
    this.isPiP = isWeb() && isElementInPiP(element);
    this.visibilityChangedAt = 0;
  }
  width() {
    return this.element.clientWidth;
  }
  height() {
    return this.element.clientHeight;
  }
  observe() {
    var _a, _b, _c;
    this.isIntersecting = isElementInViewport(this.element);
    this.isPiP = isElementInPiP(this.element);
    this.element.handleResize = () => {
      var _a2;
      (_a2 = this.handleResize) === null || _a2 === void 0 ? void 0 : _a2.call(this);
    };
    this.element.handleVisibilityChanged = this.onVisibilityChanged;
    getIntersectionObserver().observe(this.element);
    getResizeObserver().observe(this.element);
    this.element.addEventListener("enterpictureinpicture", this.onEnterPiP);
    this.element.addEventListener("leavepictureinpicture", this.onLeavePiP);
    (_a = window.documentPictureInPicture) === null || _a === void 0 ? void 0 : _a.addEventListener("enter", this.onEnterPiP);
    (_c = (_b = window.documentPictureInPicture) === null || _b === void 0 ? void 0 : _b.window) === null || _c === void 0 ? void 0 : _c.addEventListener("pagehide", this.onLeavePiP);
  }
  stopObserving() {
    var _a, _b, _c, _d, _e;
    (_a = getIntersectionObserver()) === null || _a === void 0 ? void 0 : _a.unobserve(this.element);
    (_b = getResizeObserver()) === null || _b === void 0 ? void 0 : _b.unobserve(this.element);
    this.element.removeEventListener("enterpictureinpicture", this.onEnterPiP);
    this.element.removeEventListener("leavepictureinpicture", this.onLeavePiP);
    (_c = window.documentPictureInPicture) === null || _c === void 0 ? void 0 : _c.removeEventListener("enter", this.onEnterPiP);
    (_e = (_d = window.documentPictureInPicture) === null || _d === void 0 ? void 0 : _d.window) === null || _e === void 0 ? void 0 : _e.removeEventListener("pagehide", this.onLeavePiP);
  }
};
function isElementInPiP(el) {
  var _a, _b;
  if (document.pictureInPictureElement === el)
    return true;
  if ((_a = window.documentPictureInPicture) === null || _a === void 0 ? void 0 : _a.window)
    return isElementInViewport(el, (_b = window.documentPictureInPicture) === null || _b === void 0 ? void 0 : _b.window);
  return false;
}
function isElementInViewport(el, win) {
  const viewportWindow = win || window;
  let top = el.offsetTop;
  let left = el.offsetLeft;
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const {
    hidden
  } = el;
  const {
    display
  } = getComputedStyle(el);
  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }
  return top < viewportWindow.pageYOffset + viewportWindow.innerHeight && left < viewportWindow.pageXOffset + viewportWindow.innerWidth && top + height > viewportWindow.pageYOffset && left + width > viewportWindow.pageXOffset && !hidden && display !== "none";
}
var TrackPublication = class extends eventsExports.EventEmitter {
  constructor(kind, id, name, loggerOptions) {
    var _a;
    super();
    this.metadataMuted = false;
    this.encryption = Encryption_Type.NONE;
    this.log = livekitLogger;
    this.handleMuted = () => {
      this.emit(TrackEvent.Muted);
    };
    this.handleUnmuted = () => {
      this.emit(TrackEvent.Unmuted);
    };
    this.log = getLogger((_a = loggerOptions === null || loggerOptions === void 0 ? void 0 : loggerOptions.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.Publication);
    this.loggerContextCb = this.loggerContextCb;
    this.setMaxListeners(100);
    this.kind = kind;
    this.trackSid = id;
    this.trackName = name;
    this.source = Track.Source.Unknown;
  }
  /** @internal */
  setTrack(track) {
    if (this.track) {
      this.track.off(TrackEvent.Muted, this.handleMuted);
      this.track.off(TrackEvent.Unmuted, this.handleUnmuted);
    }
    this.track = track;
    if (track) {
      track.on(TrackEvent.Muted, this.handleMuted);
      track.on(TrackEvent.Unmuted, this.handleUnmuted);
    }
  }
  get logContext() {
    var _a;
    return Object.assign(Object.assign({}, (_a = this.loggerContextCb) === null || _a === void 0 ? void 0 : _a.call(this)), getLogContextFromTrack(this));
  }
  get isMuted() {
    return this.metadataMuted;
  }
  get isEnabled() {
    return true;
  }
  get isSubscribed() {
    return this.track !== void 0;
  }
  get isEncrypted() {
    return this.encryption !== Encryption_Type.NONE;
  }
  /**
   * an [AudioTrack] if this publication holds an audio track
   */
  get audioTrack() {
    if (isAudioTrack(this.track)) {
      return this.track;
    }
  }
  /**
   * an [VideoTrack] if this publication holds a video track
   */
  get videoTrack() {
    if (isVideoTrack(this.track)) {
      return this.track;
    }
  }
  /** @internal */
  updateInfo(info) {
    this.trackSid = info.sid;
    this.trackName = info.name;
    this.source = Track.sourceFromProto(info.source);
    this.mimeType = info.mimeType;
    if (this.kind === Track.Kind.Video && info.width > 0) {
      this.dimensions = {
        width: info.width,
        height: info.height
      };
      this.simulcasted = info.simulcast;
    }
    this.encryption = info.encryption;
    this.trackInfo = info;
    this.log.debug("update publication info", Object.assign(Object.assign({}, this.logContext), {
      info
    }));
  }
};
(function(TrackPublication2) {
  (function(SubscriptionStatus) {
    SubscriptionStatus["Desired"] = "desired";
    SubscriptionStatus["Subscribed"] = "subscribed";
    SubscriptionStatus["Unsubscribed"] = "unsubscribed";
  })(TrackPublication2.SubscriptionStatus || (TrackPublication2.SubscriptionStatus = {}));
  (function(PermissionStatus) {
    PermissionStatus["Allowed"] = "allowed";
    PermissionStatus["NotAllowed"] = "not_allowed";
  })(TrackPublication2.PermissionStatus || (TrackPublication2.PermissionStatus = {}));
})(TrackPublication);
var LocalTrackPublication = class extends TrackPublication {
  get isUpstreamPaused() {
    var _a;
    return (_a = this.track) === null || _a === void 0 ? void 0 : _a.isUpstreamPaused;
  }
  constructor(kind, ti, track, loggerOptions) {
    super(kind, ti.sid, ti.name, loggerOptions);
    this.track = void 0;
    this.handleTrackEnded = () => {
      this.emit(TrackEvent.Ended);
    };
    this.updateInfo(ti);
    this.setTrack(track);
  }
  setTrack(track) {
    if (this.track) {
      this.track.off(TrackEvent.Ended, this.handleTrackEnded);
    }
    super.setTrack(track);
    if (track) {
      track.on(TrackEvent.Ended, this.handleTrackEnded);
    }
  }
  get isMuted() {
    if (this.track) {
      return this.track.isMuted;
    }
    return super.isMuted;
  }
  get audioTrack() {
    return super.audioTrack;
  }
  get videoTrack() {
    return super.videoTrack;
  }
  get isLocal() {
    return true;
  }
  /**
   * Mute the track associated with this publication
   */
  mute() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      return (_a = this.track) === null || _a === void 0 ? void 0 : _a.mute();
    });
  }
  /**
   * Unmute track associated with this publication
   */
  unmute() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      return (_a = this.track) === null || _a === void 0 ? void 0 : _a.unmute();
    });
  }
  /**
   * Pauses the media stream track associated with this publication from being sent to the server
   * and signals "muted" event to other participants
   * Useful if you want to pause the stream without pausing the local media stream track
   */
  pauseUpstream() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      yield (_a = this.track) === null || _a === void 0 ? void 0 : _a.pauseUpstream();
    });
  }
  /**
   * Resumes sending the media stream track associated with this publication to the server after a call to [[pauseUpstream()]]
   * and signals "unmuted" event to other participants (unless the track is explicitly muted)
   */
  resumeUpstream() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      yield (_a = this.track) === null || _a === void 0 ? void 0 : _a.resumeUpstream();
    });
  }
  getTrackFeatures() {
    var _a;
    if (isAudioTrack(this.track)) {
      const settings = this.track.getSourceTrackSettings();
      const features = /* @__PURE__ */ new Set();
      if (settings.autoGainControl) {
        features.add(AudioTrackFeature.TF_AUTO_GAIN_CONTROL);
      }
      if (settings.echoCancellation) {
        features.add(AudioTrackFeature.TF_ECHO_CANCELLATION);
      }
      if (settings.noiseSuppression) {
        features.add(AudioTrackFeature.TF_NOISE_SUPPRESSION);
      }
      if (settings.channelCount && settings.channelCount > 1) {
        features.add(AudioTrackFeature.TF_STEREO);
      }
      if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.dtx)) {
        features.add(AudioTrackFeature.TF_NO_DTX);
      }
      if (this.track.enhancedNoiseCancellation) {
        features.add(AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION);
      }
      return Array.from(features.values());
    } else
      return [];
  }
};
var ConnectionQuality;
(function(ConnectionQuality2) {
  ConnectionQuality2["Excellent"] = "excellent";
  ConnectionQuality2["Good"] = "good";
  ConnectionQuality2["Poor"] = "poor";
  ConnectionQuality2["Lost"] = "lost";
  ConnectionQuality2["Unknown"] = "unknown";
})(ConnectionQuality || (ConnectionQuality = {}));
function qualityFromProto(q) {
  switch (q) {
    case ConnectionQuality$1.EXCELLENT:
      return ConnectionQuality.Excellent;
    case ConnectionQuality$1.GOOD:
      return ConnectionQuality.Good;
    case ConnectionQuality$1.POOR:
      return ConnectionQuality.Poor;
    case ConnectionQuality$1.LOST:
      return ConnectionQuality.Lost;
    default:
      return ConnectionQuality.Unknown;
  }
}
var Participant = class extends eventsExports.EventEmitter {
  get logContext() {
    var _a, _b;
    return Object.assign({}, (_b = (_a = this.loggerOptions) === null || _a === void 0 ? void 0 : _a.loggerContextCb) === null || _b === void 0 ? void 0 : _b.call(_a));
  }
  get isEncrypted() {
    return this.trackPublications.size > 0 && Array.from(this.trackPublications.values()).every((tr) => tr.isEncrypted);
  }
  get isAgent() {
    var _a;
    return ((_a = this.permissions) === null || _a === void 0 ? void 0 : _a.agent) || this.kind === ParticipantInfo_Kind.AGENT;
  }
  get kind() {
    return this._kind;
  }
  /** participant attributes, similar to metadata, but as a key/value map */
  get attributes() {
    return Object.freeze(Object.assign({}, this._attributes));
  }
  /** @internal */
  constructor(sid, identity, name, metadata, attributes, loggerOptions) {
    let kind = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : ParticipantInfo_Kind.STANDARD;
    var _a;
    super();
    this.audioLevel = 0;
    this.isSpeaking = false;
    this._connectionQuality = ConnectionQuality.Unknown;
    this.log = livekitLogger;
    this.log = getLogger((_a = loggerOptions === null || loggerOptions === void 0 ? void 0 : loggerOptions.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.Participant);
    this.loggerOptions = loggerOptions;
    this.setMaxListeners(100);
    this.sid = sid;
    this.identity = identity;
    this.name = name;
    this.metadata = metadata;
    this.audioTrackPublications = /* @__PURE__ */ new Map();
    this.videoTrackPublications = /* @__PURE__ */ new Map();
    this.trackPublications = /* @__PURE__ */ new Map();
    this._kind = kind;
    this._attributes = attributes !== null && attributes !== void 0 ? attributes : {};
  }
  getTrackPublications() {
    return Array.from(this.trackPublications.values());
  }
  /**
   * Finds the first track that matches the source filter, for example, getting
   * the user's camera track with getTrackBySource(Track.Source.Camera).
   */
  getTrackPublication(source) {
    for (const [, pub] of this.trackPublications) {
      if (pub.source === source) {
        return pub;
      }
    }
  }
  /**
   * Finds the first track that matches the track's name.
   */
  getTrackPublicationByName(name) {
    for (const [, pub] of this.trackPublications) {
      if (pub.trackName === name) {
        return pub;
      }
    }
  }
  get connectionQuality() {
    return this._connectionQuality;
  }
  get isCameraEnabled() {
    var _a;
    const track = this.getTrackPublication(Track.Source.Camera);
    return !((_a = track === null || track === void 0 ? void 0 : track.isMuted) !== null && _a !== void 0 ? _a : true);
  }
  get isMicrophoneEnabled() {
    var _a;
    const track = this.getTrackPublication(Track.Source.Microphone);
    return !((_a = track === null || track === void 0 ? void 0 : track.isMuted) !== null && _a !== void 0 ? _a : true);
  }
  get isScreenShareEnabled() {
    const track = this.getTrackPublication(Track.Source.ScreenShare);
    return !!track;
  }
  get isLocal() {
    return false;
  }
  /** when participant joined the room */
  get joinedAt() {
    if (this.participantInfo) {
      return new Date(Number.parseInt(this.participantInfo.joinedAt.toString()) * 1e3);
    }
    return /* @__PURE__ */ new Date();
  }
  /** @internal */
  updateInfo(info) {
    if (this.participantInfo && this.participantInfo.sid === info.sid && this.participantInfo.version > info.version) {
      return false;
    }
    this.identity = info.identity;
    this.sid = info.sid;
    this._setName(info.name);
    this._setMetadata(info.metadata);
    this._setAttributes(info.attributes);
    if (info.permission) {
      this.setPermissions(info.permission);
    }
    this.participantInfo = info;
    this.log.trace("update participant info", Object.assign(Object.assign({}, this.logContext), {
      info
    }));
    return true;
  }
  /**
   * Updates metadata from server
   **/
  _setMetadata(md) {
    const changed = this.metadata !== md;
    const prevMetadata = this.metadata;
    this.metadata = md;
    if (changed) {
      this.emit(ParticipantEvent.ParticipantMetadataChanged, prevMetadata);
    }
  }
  _setName(name) {
    const changed = this.name !== name;
    this.name = name;
    if (changed) {
      this.emit(ParticipantEvent.ParticipantNameChanged, name);
    }
  }
  /**
   * Updates metadata from server
   **/
  _setAttributes(attributes) {
    const diff = diffAttributes(this.attributes, attributes);
    this._attributes = attributes;
    if (Object.keys(diff).length > 0) {
      this.emit(ParticipantEvent.AttributesChanged, diff);
    }
  }
  /** @internal */
  setPermissions(permissions) {
    var _a, _b, _c, _d, _e, _f;
    const prevPermissions = this.permissions;
    const changed = permissions.canPublish !== ((_a = this.permissions) === null || _a === void 0 ? void 0 : _a.canPublish) || permissions.canSubscribe !== ((_b = this.permissions) === null || _b === void 0 ? void 0 : _b.canSubscribe) || permissions.canPublishData !== ((_c = this.permissions) === null || _c === void 0 ? void 0 : _c.canPublishData) || permissions.hidden !== ((_d = this.permissions) === null || _d === void 0 ? void 0 : _d.hidden) || permissions.recorder !== ((_e = this.permissions) === null || _e === void 0 ? void 0 : _e.recorder) || permissions.canPublishSources.length !== this.permissions.canPublishSources.length || permissions.canPublishSources.some((value, index) => {
      var _a2;
      return value !== ((_a2 = this.permissions) === null || _a2 === void 0 ? void 0 : _a2.canPublishSources[index]);
    }) || permissions.canSubscribeMetrics !== ((_f = this.permissions) === null || _f === void 0 ? void 0 : _f.canSubscribeMetrics);
    this.permissions = permissions;
    if (changed) {
      this.emit(ParticipantEvent.ParticipantPermissionsChanged, prevPermissions);
    }
    return changed;
  }
  /** @internal */
  setIsSpeaking(speaking) {
    if (speaking === this.isSpeaking) {
      return;
    }
    this.isSpeaking = speaking;
    if (speaking) {
      this.lastSpokeAt = /* @__PURE__ */ new Date();
    }
    this.emit(ParticipantEvent.IsSpeakingChanged, speaking);
  }
  /** @internal */
  setConnectionQuality(q) {
    const prevQuality = this._connectionQuality;
    this._connectionQuality = qualityFromProto(q);
    if (prevQuality !== this._connectionQuality) {
      this.emit(ParticipantEvent.ConnectionQualityChanged, this._connectionQuality);
    }
  }
  /**
   * @internal
   */
  setAudioContext(ctx) {
    this.audioContext = ctx;
    this.audioTrackPublications.forEach((track) => isAudioTrack(track.track) && track.track.setAudioContext(ctx));
  }
  addTrackPublication(publication) {
    publication.on(TrackEvent.Muted, () => {
      this.emit(ParticipantEvent.TrackMuted, publication);
    });
    publication.on(TrackEvent.Unmuted, () => {
      this.emit(ParticipantEvent.TrackUnmuted, publication);
    });
    const pub = publication;
    if (pub.track) {
      pub.track.sid = publication.trackSid;
    }
    this.trackPublications.set(publication.trackSid, publication);
    switch (publication.kind) {
      case Track.Kind.Audio:
        this.audioTrackPublications.set(publication.trackSid, publication);
        break;
      case Track.Kind.Video:
        this.videoTrackPublications.set(publication.trackSid, publication);
        break;
    }
  }
};
function trackPermissionToProto(perms) {
  var _a, _b, _c;
  if (!perms.participantSid && !perms.participantIdentity) {
    throw new Error("Invalid track permission, must provide at least one of participantIdentity and participantSid");
  }
  return new TrackPermission({
    participantIdentity: (_a = perms.participantIdentity) !== null && _a !== void 0 ? _a : "",
    participantSid: (_b = perms.participantSid) !== null && _b !== void 0 ? _b : "",
    allTracks: (_c = perms.allowAll) !== null && _c !== void 0 ? _c : false,
    trackSids: perms.allowedTrackSids || []
  });
}
var STREAM_CHUNK_SIZE = 15e3;
var LocalParticipant = class extends Participant {
  /** @internal */
  constructor(sid, identity, engine, options, roomRpcHandlers) {
    super(sid, identity, void 0, void 0, void 0, {
      loggerName: options.loggerName,
      loggerContextCb: () => this.engine.logContext
    });
    this.pendingPublishing = /* @__PURE__ */ new Set();
    this.pendingPublishPromises = /* @__PURE__ */ new Map();
    this.participantTrackPermissions = [];
    this.allParticipantsAllowedToSubscribe = true;
    this.encryptionType = Encryption_Type.NONE;
    this.enabledPublishVideoCodecs = [];
    this.pendingAcks = /* @__PURE__ */ new Map();
    this.pendingResponses = /* @__PURE__ */ new Map();
    this.handleReconnecting = () => {
      if (!this.reconnectFuture) {
        this.reconnectFuture = new Future();
      }
    };
    this.handleReconnected = () => {
      var _a, _b;
      (_b = (_a = this.reconnectFuture) === null || _a === void 0 ? void 0 : _a.resolve) === null || _b === void 0 ? void 0 : _b.call(_a);
      this.reconnectFuture = void 0;
      this.updateTrackSubscriptionPermissions();
    };
    this.handleDisconnected = () => {
      var _a, _b;
      if (this.reconnectFuture) {
        this.reconnectFuture.promise.catch((e2) => this.log.warn(e2.message, this.logContext));
        (_b = (_a = this.reconnectFuture) === null || _a === void 0 ? void 0 : _a.reject) === null || _b === void 0 ? void 0 : _b.call(_a, "Got disconnected during reconnection attempt");
        this.reconnectFuture = void 0;
      }
    };
    this.handleSignalRequestResponse = (response) => {
      const {
        requestId,
        reason,
        message
      } = response;
      const targetRequest = this.pendingSignalRequests.get(requestId);
      if (targetRequest) {
        if (reason !== RequestResponse_Reason.OK) {
          targetRequest.reject(new SignalRequestError(message, reason));
        }
        this.pendingSignalRequests.delete(requestId);
      }
    };
    this.handleDataPacket = (packet) => {
      switch (packet.value.case) {
        case "rpcResponse":
          let rpcResponse = packet.value.value;
          let payload = null;
          let error = null;
          if (rpcResponse.value.case === "payload") {
            payload = rpcResponse.value.value;
          } else if (rpcResponse.value.case === "error") {
            error = RpcError.fromProto(rpcResponse.value.value);
          }
          this.handleIncomingRpcResponse(rpcResponse.requestId, payload, error);
          break;
        case "rpcAck":
          let rpcAck = packet.value.value;
          this.handleIncomingRpcAck(rpcAck.requestId);
          break;
      }
    };
    this.updateTrackSubscriptionPermissions = () => {
      this.log.debug("updating track subscription permissions", Object.assign(Object.assign({}, this.logContext), {
        allParticipantsAllowed: this.allParticipantsAllowedToSubscribe,
        participantTrackPermissions: this.participantTrackPermissions
      }));
      this.engine.client.sendUpdateSubscriptionPermissions(this.allParticipantsAllowedToSubscribe, this.participantTrackPermissions.map((p) => trackPermissionToProto(p)));
    };
    this.onTrackUnmuted = (track) => {
      this.onTrackMuted(track, track.isUpstreamPaused);
    };
    this.onTrackMuted = (track, muted) => {
      if (muted === void 0) {
        muted = true;
      }
      if (!track.sid) {
        this.log.error("could not update mute status for unpublished track", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
        return;
      }
      this.engine.updateMuteStatus(track.sid, muted);
    };
    this.onTrackUpstreamPaused = (track) => {
      this.log.debug("upstream paused", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
      this.onTrackMuted(track, true);
    };
    this.onTrackUpstreamResumed = (track) => {
      this.log.debug("upstream resumed", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
      this.onTrackMuted(track, track.isMuted);
    };
    this.onTrackFeatureUpdate = (track) => {
      const pub = this.audioTrackPublications.get(track.sid);
      if (!pub) {
        this.log.warn("Could not update local audio track settings, missing publication for track ".concat(track.sid), this.logContext);
        return;
      }
      this.engine.client.sendUpdateLocalAudioTrack(pub.trackSid, pub.getTrackFeatures());
    };
    this.handleSubscribedQualityUpdate = (update) => __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      var _d, _e;
      if (!((_d = this.roomOptions) === null || _d === void 0 ? void 0 : _d.dynacast)) {
        return;
      }
      const pub = this.videoTrackPublications.get(update.trackSid);
      if (!pub) {
        this.log.warn("received subscribed quality update for unknown track", Object.assign(Object.assign({}, this.logContext), {
          trackSid: update.trackSid
        }));
        return;
      }
      if (update.subscribedCodecs.length > 0) {
        if (!pub.videoTrack) {
          return;
        }
        const newCodecs = yield pub.videoTrack.setPublishingCodecs(update.subscribedCodecs);
        try {
          for (var _f = true, newCodecs_1 = __asyncValues(newCodecs), newCodecs_1_1; newCodecs_1_1 = yield newCodecs_1.next(), _a = newCodecs_1_1.done, !_a; _f = true) {
            _c = newCodecs_1_1.value;
            _f = false;
            const codec = _c;
            if (isBackupCodec(codec)) {
              this.log.debug("publish ".concat(codec, " for ").concat(pub.videoTrack.sid), Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(pub)));
              yield this.publishAdditionalCodecForTrack(pub.videoTrack, codec, pub.options);
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_f && !_a && (_b = newCodecs_1.return))
              yield _b.call(newCodecs_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      } else if (update.subscribedQualities.length > 0) {
        yield (_e = pub.videoTrack) === null || _e === void 0 ? void 0 : _e.setPublishingLayers(update.subscribedQualities);
      }
    });
    this.handleLocalTrackUnpublished = (unpublished) => {
      const track = this.trackPublications.get(unpublished.trackSid);
      if (!track) {
        this.log.warn("received unpublished event for unknown track", Object.assign(Object.assign({}, this.logContext), {
          trackSid: unpublished.trackSid
        }));
        return;
      }
      this.unpublishTrack(track.track);
    };
    this.handleTrackEnded = (track) => __awaiter(this, void 0, void 0, function* () {
      if (track.source === Track.Source.ScreenShare || track.source === Track.Source.ScreenShareAudio) {
        this.log.debug("unpublishing local track due to TrackEnded", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
        this.unpublishTrack(track);
      } else if (track.isUserProvided) {
        yield track.mute();
      } else if (isLocalAudioTrack(track) || isLocalVideoTrack(track)) {
        try {
          if (isWeb()) {
            try {
              const currentPermissions = yield navigator === null || navigator === void 0 ? void 0 : navigator.permissions.query({
                // the permission query for camera and microphone currently not supported in Safari and Firefox
                // @ts-ignore
                name: track.source === Track.Source.Camera ? "camera" : "microphone"
              });
              if (currentPermissions && currentPermissions.state === "denied") {
                this.log.warn("user has revoked access to ".concat(track.source), Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
                currentPermissions.onchange = () => {
                  if (currentPermissions.state !== "denied") {
                    if (!track.isMuted) {
                      track.restartTrack();
                    }
                    currentPermissions.onchange = null;
                  }
                };
                throw new Error("GetUserMedia Permission denied");
              }
            } catch (e2) {
            }
          }
          if (!track.isMuted) {
            this.log.debug("track ended, attempting to use a different device", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
            if (isLocalAudioTrack(track)) {
              yield track.restartTrack({
                deviceId: "default"
              });
            } else {
              yield track.restartTrack();
            }
          }
        } catch (e2) {
          this.log.warn("could not restart track, muting instead", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
          yield track.mute();
        }
      }
    });
    this.audioTrackPublications = /* @__PURE__ */ new Map();
    this.videoTrackPublications = /* @__PURE__ */ new Map();
    this.trackPublications = /* @__PURE__ */ new Map();
    this.engine = engine;
    this.roomOptions = options;
    this.setupEngine(engine);
    this.activeDeviceMap = /* @__PURE__ */ new Map([["audioinput", "default"], ["videoinput", "default"], ["audiooutput", "default"]]);
    this.pendingSignalRequests = /* @__PURE__ */ new Map();
    this.rpcHandlers = roomRpcHandlers;
  }
  get lastCameraError() {
    return this.cameraError;
  }
  get lastMicrophoneError() {
    return this.microphoneError;
  }
  get isE2EEEnabled() {
    return this.encryptionType !== Encryption_Type.NONE;
  }
  getTrackPublication(source) {
    const track = super.getTrackPublication(source);
    if (track) {
      return track;
    }
  }
  getTrackPublicationByName(name) {
    const track = super.getTrackPublicationByName(name);
    if (track) {
      return track;
    }
  }
  /**
   * @internal
   */
  setupEngine(engine) {
    this.engine = engine;
    this.engine.on(EngineEvent.RemoteMute, (trackSid, muted) => {
      const pub = this.trackPublications.get(trackSid);
      if (!pub || !pub.track) {
        return;
      }
      if (muted) {
        pub.mute();
      } else {
        pub.unmute();
      }
    });
    this.engine.on(EngineEvent.Connected, this.handleReconnected).on(EngineEvent.SignalRestarted, this.handleReconnected).on(EngineEvent.SignalResumed, this.handleReconnected).on(EngineEvent.Restarting, this.handleReconnecting).on(EngineEvent.Resuming, this.handleReconnecting).on(EngineEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished).on(EngineEvent.SubscribedQualityUpdate, this.handleSubscribedQualityUpdate).on(EngineEvent.Disconnected, this.handleDisconnected).on(EngineEvent.SignalRequestResponse, this.handleSignalRequestResponse).on(EngineEvent.DataPacketReceived, this.handleDataPacket);
  }
  /**
   * Sets and updates the metadata of the local participant.
   * Note: this requires `canUpdateOwnMetadata` permission.
   * method will throw if the user doesn't have the required permissions
   * @param metadata
   */
  setMetadata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.requestMetadataUpdate({
        metadata
      });
    });
  }
  /**
   * Sets and updates the name of the local participant.
   * Note: this requires `canUpdateOwnMetadata` permission.
   * method will throw if the user doesn't have the required permissions
   * @param metadata
   */
  setName(name) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.requestMetadataUpdate({
        name
      });
    });
  }
  /**
   * Set or update participant attributes. It will make updates only to keys that
   * are present in `attributes`, and will not override others.
   * Note: this requires `canUpdateOwnMetadata` permission.
   * @param attributes attributes to update
   */
  setAttributes(attributes) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.requestMetadataUpdate({
        attributes
      });
    });
  }
  requestMetadataUpdate(_a) {
    return __awaiter(this, arguments, void 0, function(_ref) {
      var _this = this;
      let {
        metadata,
        name,
        attributes
      } = _ref;
      return function* () {
        return new Promise((resolve, reject) => __awaiter(_this, void 0, void 0, function* () {
          var _a2, _b;
          try {
            let isRejected = false;
            const requestId = yield this.engine.client.sendUpdateLocalMetadata((_a2 = metadata !== null && metadata !== void 0 ? metadata : this.metadata) !== null && _a2 !== void 0 ? _a2 : "", (_b = name !== null && name !== void 0 ? name : this.name) !== null && _b !== void 0 ? _b : "", attributes);
            const startTime = performance.now();
            this.pendingSignalRequests.set(requestId, {
              resolve,
              reject: (error) => {
                reject(error);
                isRejected = true;
              },
              values: {
                name,
                metadata,
                attributes
              }
            });
            while (performance.now() - startTime < 5e3 && !isRejected) {
              if ((!name || this.name === name) && (!metadata || this.metadata === metadata) && (!attributes || Object.entries(attributes).every((_ref2) => {
                let [key, value] = _ref2;
                return this.attributes[key] === value || value === "" && !this.attributes[key];
              }))) {
                this.pendingSignalRequests.delete(requestId);
                resolve();
                return;
              }
              yield sleep(50);
            }
            reject(new SignalRequestError("Request to update local metadata timed out", "TimeoutError"));
          } catch (e2) {
            if (e2 instanceof Error)
              reject(e2);
          }
        }));
      }();
    });
  }
  /**
   * Enable or disable a participant's camera track.
   *
   * If a track has already published, it'll mute or unmute the track.
   * Resolves with a `LocalTrackPublication` instance if successful and `undefined` otherwise
   */
  setCameraEnabled(enabled, options, publishOptions) {
    return this.setTrackEnabled(Track.Source.Camera, enabled, options, publishOptions);
  }
  /**
   * Enable or disable a participant's microphone track.
   *
   * If a track has already published, it'll mute or unmute the track.
   * Resolves with a `LocalTrackPublication` instance if successful and `undefined` otherwise
   */
  setMicrophoneEnabled(enabled, options, publishOptions) {
    return this.setTrackEnabled(Track.Source.Microphone, enabled, options, publishOptions);
  }
  /**
   * Start or stop sharing a participant's screen
   * Resolves with a `LocalTrackPublication` instance if successful and `undefined` otherwise
   */
  setScreenShareEnabled(enabled, options, publishOptions) {
    return this.setTrackEnabled(Track.Source.ScreenShare, enabled, options, publishOptions);
  }
  /** @internal */
  setPermissions(permissions) {
    const prevPermissions = this.permissions;
    const changed = super.setPermissions(permissions);
    if (changed && prevPermissions) {
      this.emit(ParticipantEvent.ParticipantPermissionsChanged, prevPermissions);
    }
    return changed;
  }
  /** @internal */
  setE2EEEnabled(enabled) {
    return __awaiter(this, void 0, void 0, function* () {
      this.encryptionType = enabled ? Encryption_Type.GCM : Encryption_Type.NONE;
      yield this.republishAllTracks(void 0, false);
    });
  }
  setTrackEnabled(source, enabled, options, publishOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      this.log.debug("setTrackEnabled", Object.assign(Object.assign({}, this.logContext), {
        source,
        enabled
      }));
      if (this.republishPromise) {
        yield this.republishPromise;
      }
      let track = this.getTrackPublication(source);
      if (enabled) {
        if (track) {
          yield track.unmute();
        } else {
          let localTracks;
          if (this.pendingPublishing.has(source)) {
            const pendingTrack = yield this.waitForPendingPublicationOfSource(source);
            if (!pendingTrack) {
              this.log.info("waiting for pending publication promise timed out", Object.assign(Object.assign({}, this.logContext), {
                source
              }));
            }
            yield pendingTrack === null || pendingTrack === void 0 ? void 0 : pendingTrack.unmute();
            return pendingTrack;
          }
          this.pendingPublishing.add(source);
          try {
            switch (source) {
              case Track.Source.Camera:
                localTracks = yield this.createTracks({
                  video: (_a = options) !== null && _a !== void 0 ? _a : true
                });
                break;
              case Track.Source.Microphone:
                localTracks = yield this.createTracks({
                  audio: (_b = options) !== null && _b !== void 0 ? _b : true
                });
                break;
              case Track.Source.ScreenShare:
                localTracks = yield this.createScreenTracks(Object.assign({}, options));
                break;
              default:
                throw new TrackInvalidError(source);
            }
          } catch (e2) {
            localTracks === null || localTracks === void 0 ? void 0 : localTracks.forEach((tr) => {
              tr.stop();
            });
            if (e2 instanceof Error) {
              this.emit(ParticipantEvent.MediaDevicesError, e2);
            }
            this.pendingPublishing.delete(source);
            throw e2;
          }
          try {
            const publishPromises = [];
            for (const localTrack of localTracks) {
              this.log.info("publishing track", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(localTrack)));
              publishPromises.push(this.publishTrack(localTrack, publishOptions));
            }
            const publishedTracks = yield Promise.all(publishPromises);
            [track] = publishedTracks;
          } catch (e2) {
            localTracks === null || localTracks === void 0 ? void 0 : localTracks.forEach((tr) => {
              tr.stop();
            });
            throw e2;
          } finally {
            this.pendingPublishing.delete(source);
          }
        }
      } else {
        if (!(track === null || track === void 0 ? void 0 : track.track) && this.pendingPublishing.has(source)) {
          track = yield this.waitForPendingPublicationOfSource(source);
          if (!track) {
            this.log.info("waiting for pending publication promise timed out", Object.assign(Object.assign({}, this.logContext), {
              source
            }));
          }
        }
        if (track && track.track) {
          if (source === Track.Source.ScreenShare) {
            track = yield this.unpublishTrack(track.track);
            const screenAudioTrack = this.getTrackPublication(Track.Source.ScreenShareAudio);
            if (screenAudioTrack && screenAudioTrack.track) {
              this.unpublishTrack(screenAudioTrack.track);
            }
          } else {
            yield track.mute();
          }
        }
      }
      return track;
    });
  }
  /**
   * Publish both camera and microphone at the same time. This is useful for
   * displaying a single Permission Dialog box to the end user.
   */
  enableCameraAndMicrophone() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.pendingPublishing.has(Track.Source.Camera) || this.pendingPublishing.has(Track.Source.Microphone)) {
        return;
      }
      this.pendingPublishing.add(Track.Source.Camera);
      this.pendingPublishing.add(Track.Source.Microphone);
      try {
        const tracks = yield this.createTracks({
          audio: true,
          video: true
        });
        yield Promise.all(tracks.map((track) => this.publishTrack(track)));
      } finally {
        this.pendingPublishing.delete(Track.Source.Camera);
        this.pendingPublishing.delete(Track.Source.Microphone);
      }
    });
  }
  /**
   * Create local camera and/or microphone tracks
   * @param options
   * @returns
   */
  createTracks(options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      options !== null && options !== void 0 ? options : options = {};
      const {
        audioProcessor,
        videoProcessor,
        optionsWithoutProcessor
      } = extractProcessorsFromOptions(options);
      const mergedOptions = mergeDefaultOptions(optionsWithoutProcessor, (_a = this.roomOptions) === null || _a === void 0 ? void 0 : _a.audioCaptureDefaults, (_b = this.roomOptions) === null || _b === void 0 ? void 0 : _b.videoCaptureDefaults);
      const constraints = constraintsForOptions(mergedOptions);
      let stream;
      try {
        stream = yield navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        if (err instanceof Error) {
          if (constraints.audio) {
            this.microphoneError = err;
          }
          if (constraints.video) {
            this.cameraError = err;
          }
        }
        throw err;
      }
      if (constraints.audio) {
        this.microphoneError = void 0;
        this.emit(ParticipantEvent.AudioStreamAcquired);
      }
      if (constraints.video) {
        this.cameraError = void 0;
      }
      return Promise.all(stream.getTracks().map((mediaStreamTrack) => __awaiter(this, void 0, void 0, function* () {
        const isAudio = mediaStreamTrack.kind === "audio";
        isAudio ? mergedOptions.audio : mergedOptions.video;
        let trackConstraints;
        const conOrBool = isAudio ? constraints.audio : constraints.video;
        if (typeof conOrBool !== "boolean") {
          trackConstraints = conOrBool;
        }
        const track = mediaTrackToLocalTrack(mediaStreamTrack, trackConstraints, {
          loggerName: this.roomOptions.loggerName,
          loggerContextCb: () => this.logContext
        });
        if (track.kind === Track.Kind.Video) {
          track.source = Track.Source.Camera;
        } else if (track.kind === Track.Kind.Audio) {
          track.source = Track.Source.Microphone;
          track.setAudioContext(this.audioContext);
        }
        track.mediaStream = stream;
        if (isAudioTrack(track) && audioProcessor) {
          yield track.setProcessor(audioProcessor);
        } else if (isVideoTrack(track) && videoProcessor) {
          yield track.setProcessor(videoProcessor);
        }
        return track;
      })));
    });
  }
  /**
   * Creates a screen capture tracks with getDisplayMedia().
   * A LocalVideoTrack is always created and returned.
   * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
   */
  createScreenTracks(options) {
    return __awaiter(this, void 0, void 0, function* () {
      if (options === void 0) {
        options = {};
      }
      if (navigator.mediaDevices.getDisplayMedia === void 0) {
        throw new DeviceUnsupportedError("getDisplayMedia not supported");
      }
      if (options.resolution === void 0 && !isSafari17()) {
        options.resolution = ScreenSharePresets.h1080fps30.resolution;
      }
      const constraints = screenCaptureToDisplayMediaStreamOptions(options);
      const stream = yield navigator.mediaDevices.getDisplayMedia(constraints);
      const tracks = stream.getVideoTracks();
      if (tracks.length === 0) {
        throw new TrackInvalidError("no video track found");
      }
      const screenVideo = new LocalVideoTrack(tracks[0], void 0, false, {
        loggerName: this.roomOptions.loggerName,
        loggerContextCb: () => this.logContext
      });
      screenVideo.source = Track.Source.ScreenShare;
      if (options.contentHint) {
        screenVideo.mediaStreamTrack.contentHint = options.contentHint;
      }
      const localTracks = [screenVideo];
      if (stream.getAudioTracks().length > 0) {
        this.emit(ParticipantEvent.AudioStreamAcquired);
        const screenAudio = new LocalAudioTrack(stream.getAudioTracks()[0], void 0, false, this.audioContext, {
          loggerName: this.roomOptions.loggerName,
          loggerContextCb: () => this.logContext
        });
        screenAudio.source = Track.Source.ScreenShareAudio;
        localTracks.push(screenAudio);
      }
      return localTracks;
    });
  }
  /**
   * Publish a new track to the room
   * @param track
   * @param options
   */
  publishTrack(track, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.publishOrRepublishTrack(track, options);
    });
  }
  publishOrRepublishTrack(track_1, options_1) {
    return __awaiter(this, arguments, void 0, function(track, options) {
      var _this2 = this;
      let isRepublish = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      return function* () {
        var _a, _b, _c, _d;
        if (isLocalAudioTrack(track)) {
          track.setAudioContext(_this2.audioContext);
        }
        yield (_a = _this2.reconnectFuture) === null || _a === void 0 ? void 0 : _a.promise;
        if (_this2.republishPromise && !isRepublish) {
          yield _this2.republishPromise;
        }
        if (isLocalTrack(track) && _this2.pendingPublishPromises.has(track)) {
          yield _this2.pendingPublishPromises.get(track);
        }
        let defaultConstraints;
        if (track instanceof MediaStreamTrack) {
          defaultConstraints = track.getConstraints();
        } else {
          defaultConstraints = track.constraints;
          let deviceKind = void 0;
          switch (track.source) {
            case Track.Source.Microphone:
              deviceKind = "audioinput";
              break;
            case Track.Source.Camera:
              deviceKind = "videoinput";
          }
          if (deviceKind && _this2.activeDeviceMap.has(deviceKind)) {
            defaultConstraints = Object.assign(Object.assign({}, defaultConstraints), {
              deviceId: _this2.activeDeviceMap.get(deviceKind)
            });
          }
        }
        if (track instanceof MediaStreamTrack) {
          switch (track.kind) {
            case "audio":
              track = new LocalAudioTrack(track, defaultConstraints, true, _this2.audioContext, {
                loggerName: _this2.roomOptions.loggerName,
                loggerContextCb: () => _this2.logContext
              });
              break;
            case "video":
              track = new LocalVideoTrack(track, defaultConstraints, true, {
                loggerName: _this2.roomOptions.loggerName,
                loggerContextCb: () => _this2.logContext
              });
              break;
            default:
              throw new TrackInvalidError("unsupported MediaStreamTrack kind ".concat(track.kind));
          }
        } else {
          track.updateLoggerOptions({
            loggerName: _this2.roomOptions.loggerName,
            loggerContextCb: () => _this2.logContext
          });
        }
        let existingPublication;
        _this2.trackPublications.forEach((publication) => {
          if (!publication.track) {
            return;
          }
          if (publication.track === track) {
            existingPublication = publication;
          }
        });
        if (existingPublication) {
          _this2.log.warn("track has already been published, skipping", Object.assign(Object.assign({}, _this2.logContext), getLogContextFromTrack(existingPublication)));
          return existingPublication;
        }
        const isStereoInput = "channelCount" in track.mediaStreamTrack.getSettings() && // @ts-ignore `channelCount` on getSettings() is currently only available for Safari, but is generally the best way to determine a stereo track https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/channelCount
        track.mediaStreamTrack.getSettings().channelCount === 2 || track.mediaStreamTrack.getConstraints().channelCount === 2;
        const isStereo = (_b = options === null || options === void 0 ? void 0 : options.forceStereo) !== null && _b !== void 0 ? _b : isStereoInput;
        if (isStereo) {
          if (!options) {
            options = {};
          }
          if (options.dtx === void 0) {
            _this2.log.info("Opus DTX will be disabled for stereo tracks by default. Enable them explicitly to make it work.", Object.assign(Object.assign({}, _this2.logContext), getLogContextFromTrack(track)));
          }
          if (options.red === void 0) {
            _this2.log.info("Opus RED will be disabled for stereo tracks by default. Enable them explicitly to make it work.");
          }
          (_c = options.dtx) !== null && _c !== void 0 ? _c : options.dtx = false;
          (_d = options.red) !== null && _d !== void 0 ? _d : options.red = false;
        }
        const opts = Object.assign(Object.assign({}, _this2.roomOptions.publishDefaults), options);
        if (!isE2EESimulcastSupported() && _this2.roomOptions.e2ee) {
          _this2.log.info("End-to-end encryption is set up, simulcast publishing will be disabled on Safari versions and iOS browsers running iOS < v17.2", Object.assign({}, _this2.logContext));
          opts.simulcast = false;
        }
        if (opts.source) {
          track.source = opts.source;
        }
        const publishPromise = _this2.publish(track, opts, isStereo);
        _this2.pendingPublishPromises.set(track, publishPromise);
        try {
          const publication = yield publishPromise;
          return publication;
        } catch (e2) {
          throw e2;
        } finally {
          _this2.pendingPublishPromises.delete(track);
        }
      }();
    });
  }
  publish(track, opts, isStereo) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
      const existingTrackOfSource = Array.from(this.trackPublications.values()).find((publishedTrack) => isLocalTrack(track) && publishedTrack.source === track.source);
      if (existingTrackOfSource && track.source !== Track.Source.Unknown) {
        this.log.info("publishing a second track with the same source: ".concat(track.source), Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
      }
      if (opts.stopMicTrackOnMute && isAudioTrack(track)) {
        track.stopOnMute = true;
      }
      if (track.source === Track.Source.ScreenShare && isFireFox()) {
        opts.simulcast = false;
      }
      if (opts.videoCodec === "av1" && !supportsAV1()) {
        opts.videoCodec = void 0;
      }
      if (opts.videoCodec === "vp9" && !supportsVP9()) {
        opts.videoCodec = void 0;
      }
      if (opts.videoCodec === void 0) {
        opts.videoCodec = defaultVideoCodec;
      }
      if (this.enabledPublishVideoCodecs.length > 0) {
        if (!this.enabledPublishVideoCodecs.some((c) => opts.videoCodec === mimeTypeToVideoCodecString(c.mime))) {
          opts.videoCodec = mimeTypeToVideoCodecString(this.enabledPublishVideoCodecs[0].mime);
        }
      }
      const videoCodec = opts.videoCodec;
      track.on(TrackEvent.Muted, this.onTrackMuted);
      track.on(TrackEvent.Unmuted, this.onTrackUnmuted);
      track.on(TrackEvent.Ended, this.handleTrackEnded);
      track.on(TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused);
      track.on(TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed);
      track.on(TrackEvent.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate);
      const req = new AddTrackRequest({
        // get local track id for use during publishing
        cid: track.mediaStreamTrack.id,
        name: opts.name,
        type: Track.kindToProto(track.kind),
        muted: track.isMuted,
        source: Track.sourceToProto(track.source),
        disableDtx: !((_a = opts.dtx) !== null && _a !== void 0 ? _a : true),
        encryption: this.encryptionType,
        stereo: isStereo,
        disableRed: this.isE2EEEnabled || !((_b = opts.red) !== null && _b !== void 0 ? _b : true),
        stream: opts === null || opts === void 0 ? void 0 : opts.stream,
        backupCodecPolicy: opts === null || opts === void 0 ? void 0 : opts.backupCodecPolicy
      });
      let encodings;
      if (track.kind === Track.Kind.Video) {
        let dims = {
          width: 0,
          height: 0
        };
        try {
          dims = yield track.waitForDimensions();
        } catch (e2) {
          const defaultRes = (_d = (_c = this.roomOptions.videoCaptureDefaults) === null || _c === void 0 ? void 0 : _c.resolution) !== null && _d !== void 0 ? _d : VideoPresets.h720.resolution;
          dims = {
            width: defaultRes.width,
            height: defaultRes.height
          };
          this.log.error("could not determine track dimensions, using defaults", Object.assign(Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)), {
            dims
          }));
        }
        req.width = dims.width;
        req.height = dims.height;
        if (isLocalVideoTrack(track)) {
          if (isSVCCodec(videoCodec)) {
            if (track.source === Track.Source.ScreenShare) {
              opts.scalabilityMode = "L1T3";
              if ("contentHint" in track.mediaStreamTrack) {
                track.mediaStreamTrack.contentHint = "motion";
                this.log.info("forcing contentHint to motion for screenshare with SVC codecs", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
              }
            }
            opts.scalabilityMode = (_e = opts.scalabilityMode) !== null && _e !== void 0 ? _e : "L3T3_KEY";
          }
          req.simulcastCodecs = [new SimulcastCodec({
            codec: videoCodec,
            cid: track.mediaStreamTrack.id
          })];
          if (opts.backupCodec === true) {
            opts.backupCodec = {
              codec: defaultVideoCodec
            };
          }
          if (opts.backupCodec && videoCodec !== opts.backupCodec.codec && // TODO remove this once e2ee is supported for backup codecs
          req.encryption === Encryption_Type.NONE) {
            if (!this.roomOptions.dynacast) {
              this.roomOptions.dynacast = true;
            }
            req.simulcastCodecs.push(new SimulcastCodec({
              codec: opts.backupCodec.codec,
              cid: ""
            }));
          }
        }
        encodings = computeVideoEncodings(track.source === Track.Source.ScreenShare, req.width, req.height, opts);
        req.layers = videoLayersFromEncodings(req.width, req.height, encodings, isSVCCodec(opts.videoCodec));
      } else if (track.kind === Track.Kind.Audio) {
        encodings = [{
          maxBitrate: (_f = opts.audioPreset) === null || _f === void 0 ? void 0 : _f.maxBitrate,
          priority: (_h = (_g = opts.audioPreset) === null || _g === void 0 ? void 0 : _g.priority) !== null && _h !== void 0 ? _h : "high",
          networkPriority: (_k = (_j = opts.audioPreset) === null || _j === void 0 ? void 0 : _j.priority) !== null && _k !== void 0 ? _k : "high"
        }];
      }
      if (!this.engine || this.engine.isClosed) {
        throw new UnexpectedConnectionState("cannot publish track when not connected");
      }
      const negotiate = () => __awaiter(this, void 0, void 0, function* () {
        var _a2, _b2, _c2;
        if (!this.engine.pcManager) {
          throw new UnexpectedConnectionState("pcManager is not ready");
        }
        track.sender = yield this.engine.createSender(track, opts, encodings);
        if (isLocalVideoTrack(track)) {
          (_a2 = opts.degradationPreference) !== null && _a2 !== void 0 ? _a2 : opts.degradationPreference = getDefaultDegradationPreference(track);
          track.setDegradationPreference(opts.degradationPreference);
        }
        if (encodings) {
          if (isFireFox() && track.kind === Track.Kind.Audio) {
            let trackTransceiver = void 0;
            for (const transceiver of this.engine.pcManager.publisher.getTransceivers()) {
              if (transceiver.sender === track.sender) {
                trackTransceiver = transceiver;
                break;
              }
            }
            if (trackTransceiver) {
              this.engine.pcManager.publisher.setTrackCodecBitrate({
                transceiver: trackTransceiver,
                codec: "opus",
                maxbr: ((_b2 = encodings[0]) === null || _b2 === void 0 ? void 0 : _b2.maxBitrate) ? encodings[0].maxBitrate / 1e3 : 0
              });
            }
          } else if (track.codec && isSVCCodec(track.codec) && ((_c2 = encodings[0]) === null || _c2 === void 0 ? void 0 : _c2.maxBitrate)) {
            this.engine.pcManager.publisher.setTrackCodecBitrate({
              cid: req.cid,
              codec: track.codec,
              maxbr: encodings[0].maxBitrate / 1e3
            });
          }
        }
        yield this.engine.negotiate();
      });
      let ti;
      if (this.enabledPublishVideoCodecs.length > 0) {
        const rets = yield Promise.all([this.engine.addTrack(req), negotiate()]);
        ti = rets[0];
      } else {
        ti = yield this.engine.addTrack(req);
        let primaryCodecMime;
        ti.codecs.forEach((codec) => {
          if (primaryCodecMime === void 0) {
            primaryCodecMime = codec.mimeType;
          }
        });
        if (primaryCodecMime && track.kind === Track.Kind.Video) {
          const updatedCodec = mimeTypeToVideoCodecString(primaryCodecMime);
          if (updatedCodec !== videoCodec) {
            this.log.debug("falling back to server selected codec", Object.assign(Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)), {
              codec: updatedCodec
            }));
            opts.videoCodec = updatedCodec;
            encodings = computeVideoEncodings(track.source === Track.Source.ScreenShare, req.width, req.height, opts);
          }
        }
        yield negotiate();
      }
      const publication = new LocalTrackPublication(track.kind, ti, track, {
        loggerName: this.roomOptions.loggerName,
        loggerContextCb: () => this.logContext
      });
      publication.options = opts;
      track.sid = ti.sid;
      this.log.debug("publishing ".concat(track.kind, " with encodings"), Object.assign(Object.assign({}, this.logContext), {
        encodings,
        trackInfo: ti
      }));
      if (isLocalVideoTrack(track)) {
        track.startMonitor(this.engine.client);
      } else if (isLocalAudioTrack(track)) {
        track.startMonitor();
      }
      this.addTrackPublication(publication);
      this.emit(ParticipantEvent.LocalTrackPublished, publication);
      return publication;
    });
  }
  get isLocal() {
    return true;
  }
  /** @internal
   * publish additional codec to existing track
   */
  publishAdditionalCodecForTrack(track, videoCodec, options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (this.encryptionType !== Encryption_Type.NONE) {
        return;
      }
      let existingPublication;
      this.trackPublications.forEach((publication) => {
        if (!publication.track) {
          return;
        }
        if (publication.track === track) {
          existingPublication = publication;
        }
      });
      if (!existingPublication) {
        throw new TrackInvalidError("track is not published");
      }
      if (!isLocalVideoTrack(track)) {
        throw new TrackInvalidError("track is not a video track");
      }
      const opts = Object.assign(Object.assign({}, (_a = this.roomOptions) === null || _a === void 0 ? void 0 : _a.publishDefaults), options);
      const encodings = computeTrackBackupEncodings(track, videoCodec, opts);
      if (!encodings) {
        this.log.info("backup codec has been disabled, ignoring request to add additional codec for track", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
        return;
      }
      const simulcastTrack = track.addSimulcastTrack(videoCodec, encodings);
      if (!simulcastTrack) {
        return;
      }
      const req = new AddTrackRequest({
        cid: simulcastTrack.mediaStreamTrack.id,
        type: Track.kindToProto(track.kind),
        muted: track.isMuted,
        source: Track.sourceToProto(track.source),
        sid: track.sid,
        simulcastCodecs: [{
          codec: opts.videoCodec,
          cid: simulcastTrack.mediaStreamTrack.id
        }]
      });
      req.layers = videoLayersFromEncodings(req.width, req.height, encodings);
      if (!this.engine || this.engine.isClosed) {
        throw new UnexpectedConnectionState("cannot publish track when not connected");
      }
      const negotiate = () => __awaiter(this, void 0, void 0, function* () {
        yield this.engine.createSimulcastSender(track, simulcastTrack, opts, encodings);
        yield this.engine.negotiate();
      });
      const rets = yield Promise.all([this.engine.addTrack(req), negotiate()]);
      const ti = rets[0];
      this.log.debug("published ".concat(videoCodec, " for track ").concat(track.sid), Object.assign(Object.assign({}, this.logContext), {
        encodings,
        trackInfo: ti
      }));
    });
  }
  unpublishTrack(track, stopOnUnpublish) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      if (isLocalTrack(track)) {
        const publishPromise = this.pendingPublishPromises.get(track);
        if (publishPromise) {
          this.log.info("awaiting publish promise before attempting to unpublish", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(track)));
          yield publishPromise;
        }
      }
      const publication = this.getPublicationForTrack(track);
      const pubLogContext = publication ? getLogContextFromTrack(publication) : void 0;
      this.log.debug("unpublishing track", Object.assign(Object.assign({}, this.logContext), pubLogContext));
      if (!publication || !publication.track) {
        this.log.warn("track was not unpublished because no publication was found", Object.assign(Object.assign({}, this.logContext), pubLogContext));
        return void 0;
      }
      track = publication.track;
      track.off(TrackEvent.Muted, this.onTrackMuted);
      track.off(TrackEvent.Unmuted, this.onTrackUnmuted);
      track.off(TrackEvent.Ended, this.handleTrackEnded);
      track.off(TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused);
      track.off(TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed);
      track.off(TrackEvent.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate);
      if (stopOnUnpublish === void 0) {
        stopOnUnpublish = (_b = (_a = this.roomOptions) === null || _a === void 0 ? void 0 : _a.stopLocalTrackOnUnpublish) !== null && _b !== void 0 ? _b : true;
      }
      if (stopOnUnpublish) {
        track.stop();
      } else {
        track.stopMonitor();
      }
      let negotiationNeeded = false;
      const trackSender = track.sender;
      track.sender = void 0;
      if (this.engine.pcManager && this.engine.pcManager.currentState < PCTransportState.FAILED && trackSender) {
        try {
          for (const transceiver of this.engine.pcManager.publisher.getTransceivers()) {
            if (transceiver.sender === trackSender) {
              transceiver.direction = "inactive";
              negotiationNeeded = true;
            }
          }
          if (this.engine.removeTrack(trackSender)) {
            negotiationNeeded = true;
          }
          if (isLocalVideoTrack(track)) {
            for (const [, trackInfo] of track.simulcastCodecs) {
              if (trackInfo.sender) {
                if (this.engine.removeTrack(trackInfo.sender)) {
                  negotiationNeeded = true;
                }
                trackInfo.sender = void 0;
              }
            }
            track.simulcastCodecs.clear();
          }
        } catch (e2) {
          this.log.warn("failed to unpublish track", Object.assign(Object.assign(Object.assign({}, this.logContext), pubLogContext), {
            error: e2
          }));
        }
      }
      this.trackPublications.delete(publication.trackSid);
      switch (publication.kind) {
        case Track.Kind.Audio:
          this.audioTrackPublications.delete(publication.trackSid);
          break;
        case Track.Kind.Video:
          this.videoTrackPublications.delete(publication.trackSid);
          break;
      }
      this.emit(ParticipantEvent.LocalTrackUnpublished, publication);
      publication.setTrack(void 0);
      if (negotiationNeeded) {
        yield this.engine.negotiate();
      }
      return publication;
    });
  }
  unpublishTracks(tracks) {
    return __awaiter(this, void 0, void 0, function* () {
      const results = yield Promise.all(tracks.map((track) => this.unpublishTrack(track)));
      return results.filter((track) => !!track);
    });
  }
  republishAllTracks(options_1) {
    return __awaiter(this, arguments, void 0, function(options) {
      var _this3 = this;
      let restartTracks = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return function* () {
        if (_this3.republishPromise) {
          yield _this3.republishPromise;
        }
        _this3.republishPromise = new Promise((resolve, reject) => __awaiter(_this3, void 0, void 0, function* () {
          try {
            const localPubs = [];
            this.trackPublications.forEach((pub) => {
              if (pub.track) {
                if (options) {
                  pub.options = Object.assign(Object.assign({}, pub.options), options);
                }
                localPubs.push(pub);
              }
            });
            yield Promise.all(localPubs.map((pub) => __awaiter(this, void 0, void 0, function* () {
              const track = pub.track;
              yield this.unpublishTrack(track, false);
              if (restartTracks && !track.isMuted && track.source !== Track.Source.ScreenShare && track.source !== Track.Source.ScreenShareAudio && (isLocalAudioTrack(track) || isLocalVideoTrack(track)) && !track.isUserProvided) {
                this.log.debug("restarting existing track", Object.assign(Object.assign({}, this.logContext), {
                  track: pub.trackSid
                }));
                yield track.restartTrack();
              }
              yield this.publishOrRepublishTrack(track, pub.options, true);
            })));
            resolve();
          } catch (error) {
            reject(error);
          } finally {
            this.republishPromise = void 0;
          }
        }));
        yield _this3.republishPromise;
      }();
    });
  }
  /**
   * Publish a new data payload to the room. Data will be forwarded to each
   * participant in the room if the destination field in publishOptions is empty
   *
   * @param data Uint8Array of the payload. To send string data, use TextEncoder.encode
   * @param options optionally specify a `reliable`, `topic` and `destination`
   */
  publishData(data_1) {
    return __awaiter(this, arguments, void 0, function(data) {
      var _this4 = this;
      let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return function* () {
        const kind = options.reliable ? DataPacket_Kind.RELIABLE : DataPacket_Kind.LOSSY;
        const destinationIdentities = options.destinationIdentities;
        const topic = options.topic;
        const packet = new DataPacket({
          kind,
          value: {
            case: "user",
            value: new UserPacket({
              participantIdentity: _this4.identity,
              payload: data,
              destinationIdentities,
              topic
            })
          }
        });
        yield _this4.engine.sendDataPacket(packet, kind);
      }();
    });
  }
  /**
   * Publish SIP DTMF message to the room.
   *
   * @param code DTMF code
   * @param digit DTMF digit
   */
  publishDtmf(code, digit) {
    return __awaiter(this, void 0, void 0, function* () {
      const packet = new DataPacket({
        kind: DataPacket_Kind.RELIABLE,
        value: {
          case: "sipDtmf",
          value: new SipDTMF({
            code,
            digit
          })
        }
      });
      yield this.engine.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
    });
  }
  sendChatMessage(text, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const msg = {
        id: crypto.randomUUID(),
        message: text,
        timestamp: Date.now(),
        attachedFiles: options === null || options === void 0 ? void 0 : options.attachments
      };
      const packet = new DataPacket({
        value: {
          case: "chatMessage",
          value: new ChatMessage(Object.assign(Object.assign({}, msg), {
            timestamp: protoInt64.parse(msg.timestamp)
          }))
        }
      });
      yield this.engine.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
      this.emit(ParticipantEvent.ChatMessage, msg);
      return msg;
    });
  }
  editChatMessage(editText, originalMessage) {
    return __awaiter(this, void 0, void 0, function* () {
      const msg = Object.assign(Object.assign({}, originalMessage), {
        message: editText,
        editTimestamp: Date.now()
      });
      const packet = new DataPacket({
        value: {
          case: "chatMessage",
          value: new ChatMessage(Object.assign(Object.assign({}, msg), {
            timestamp: protoInt64.parse(msg.timestamp),
            editTimestamp: protoInt64.parse(msg.editTimestamp)
          }))
        }
      });
      yield this.engine.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
      this.emit(ParticipantEvent.ChatMessage, msg);
      return msg;
    });
  }
  sendText(text, options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const streamId = crypto.randomUUID();
      const textInBytes = new TextEncoder().encode(text);
      const totalTextLength = textInBytes.byteLength;
      const fileIds = (_a = options === null || options === void 0 ? void 0 : options.attachments) === null || _a === void 0 ? void 0 : _a.map(() => crypto.randomUUID());
      const progresses = new Array(fileIds ? fileIds.length + 1 : 1).fill(0);
      const handleProgress = (progress, idx) => {
        var _a2;
        progresses[idx] = progress;
        const totalProgress = progresses.reduce((acc, val) => acc + val, 0);
        (_a2 = options === null || options === void 0 ? void 0 : options.onProgress) === null || _a2 === void 0 ? void 0 : _a2.call(options, totalProgress);
      };
      const writer2 = yield this.streamText({
        streamId,
        totalSize: totalTextLength,
        destinationIdentities: options === null || options === void 0 ? void 0 : options.destinationIdentities,
        topic: options === null || options === void 0 ? void 0 : options.topic,
        attachedStreamIds: fileIds
      });
      const textChunkSize = Math.floor(STREAM_CHUNK_SIZE / 4);
      const totalTextChunks = Math.ceil(totalTextLength / textChunkSize);
      for (let i = 0; i < totalTextChunks; i++) {
        const chunkData = text.slice(i * textChunkSize, Math.min((i + 1) * textChunkSize, totalTextLength));
        yield this.engine.waitForBufferStatusLow(DataPacket_Kind.RELIABLE);
        yield writer2.write(chunkData);
        handleProgress(Math.ceil((i + 1) / totalTextChunks), 0);
      }
      yield writer2.close();
      if ((options === null || options === void 0 ? void 0 : options.attachments) && fileIds) {
        yield Promise.all(options.attachments.map((file, idx) => __awaiter(this, void 0, void 0, function* () {
          return this._sendFile(fileIds[idx], file, {
            topic: options.topic,
            mimeType: file.type,
            onProgress: (progress) => {
              handleProgress(progress, idx + 1);
            }
          });
        })));
      }
      return writer2.info;
    });
  }
  /**
   * @internal
   * @experimental CAUTION, might get removed in a minor release
   */
  streamText(options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const streamId = (_a = options === null || options === void 0 ? void 0 : options.streamId) !== null && _a !== void 0 ? _a : crypto.randomUUID();
      const info = {
        id: streamId,
        mimeType: "text/plain",
        timestamp: Date.now(),
        topic: (_b = options === null || options === void 0 ? void 0 : options.topic) !== null && _b !== void 0 ? _b : "",
        size: options === null || options === void 0 ? void 0 : options.totalSize
      };
      const header = new DataStream_Header({
        streamId,
        mimeType: info.mimeType,
        topic: info.topic,
        timestamp: numberToBigInt(info.timestamp),
        totalLength: numberToBigInt(options === null || options === void 0 ? void 0 : options.totalSize),
        contentHeader: {
          case: "textHeader",
          value: new DataStream_TextHeader({
            version: options === null || options === void 0 ? void 0 : options.version,
            attachedStreamIds: options === null || options === void 0 ? void 0 : options.attachedStreamIds,
            replyToStreamId: options === null || options === void 0 ? void 0 : options.replyToStreamId,
            operationType: (options === null || options === void 0 ? void 0 : options.type) === "update" ? DataStream_OperationType.UPDATE : DataStream_OperationType.CREATE
          })
        }
      });
      const destinationIdentities = options === null || options === void 0 ? void 0 : options.destinationIdentities;
      const packet = new DataPacket({
        destinationIdentities,
        value: {
          case: "streamHeader",
          value: header
        }
      });
      yield this.engine.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
      let chunkId = 0;
      const localP = this;
      const writableStream = new WritableStream({
        // Implement the sink
        write(_ref3) {
          let [textChunk] = _ref3;
          var _a2;
          const textInBytes = new TextEncoder().encode(textChunk);
          if (textInBytes.byteLength > STREAM_CHUNK_SIZE) {
            (_a2 = this.abort) === null || _a2 === void 0 ? void 0 : _a2.call(this);
            throw new Error("chunk size too large");
          }
          return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield localP.engine.waitForBufferStatusLow(DataPacket_Kind.RELIABLE);
            const chunk = new DataStream_Chunk({
              content: textInBytes,
              streamId,
              chunkIndex: numberToBigInt(chunkId)
            });
            const chunkPacket = new DataPacket({
              destinationIdentities,
              value: {
                case: "streamChunk",
                value: chunk
              }
            });
            yield localP.engine.sendDataPacket(chunkPacket, DataPacket_Kind.RELIABLE);
            chunkId += 1;
            resolve();
          }));
        },
        close() {
          return __awaiter(this, void 0, void 0, function* () {
            const trailer = new DataStream_Trailer({
              streamId
            });
            const trailerPacket = new DataPacket({
              destinationIdentities,
              value: {
                case: "streamTrailer",
                value: trailer
              }
            });
            yield localP.engine.sendDataPacket(trailerPacket, DataPacket_Kind.RELIABLE);
          });
        },
        abort(err) {
          console.log("Sink error:", err);
        }
      });
      let onEngineClose = () => __awaiter(this, void 0, void 0, function* () {
        yield writer2.close();
      });
      localP.engine.once(EngineEvent.Closing, onEngineClose);
      const writer2 = new TextStreamWriter(writableStream, info, () => this.engine.off(EngineEvent.Closing, onEngineClose));
      return writer2;
    });
  }
  sendFile(file, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const streamId = crypto.randomUUID();
      yield this._sendFile(streamId, file, options);
      return {
        id: streamId
      };
    });
  }
  _sendFile(streamId, file, options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const totalLength = file.size;
      const header = new DataStream_Header({
        totalLength: numberToBigInt(totalLength),
        mimeType: (_a = options === null || options === void 0 ? void 0 : options.mimeType) !== null && _a !== void 0 ? _a : file.type,
        streamId,
        topic: options === null || options === void 0 ? void 0 : options.topic,
        encryptionType: options === null || options === void 0 ? void 0 : options.encryptionType,
        timestamp: numberToBigInt(Date.now()),
        contentHeader: {
          case: "byteHeader",
          value: new DataStream_ByteHeader({
            name: file.name
          })
        }
      });
      const destinationIdentities = options === null || options === void 0 ? void 0 : options.destinationIdentities;
      const packet = new DataPacket({
        destinationIdentities,
        value: {
          case: "streamHeader",
          value: header
        }
      });
      yield this.engine.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
      function read(b) {
        return new Promise((resolve) => {
          const fr = new FileReader();
          fr.onload = () => {
            resolve(new Uint8Array(fr.result));
          };
          fr.readAsArrayBuffer(b);
        });
      }
      const totalChunks = Math.ceil(totalLength / STREAM_CHUNK_SIZE);
      for (let i = 0; i < totalChunks; i++) {
        const chunkData = yield read(file.slice(i * STREAM_CHUNK_SIZE, Math.min((i + 1) * STREAM_CHUNK_SIZE, totalLength)));
        yield this.engine.waitForBufferStatusLow(DataPacket_Kind.RELIABLE);
        const chunk = new DataStream_Chunk({
          content: chunkData,
          streamId,
          chunkIndex: numberToBigInt(i)
        });
        const chunkPacket = new DataPacket({
          destinationIdentities,
          value: {
            case: "streamChunk",
            value: chunk
          }
        });
        yield this.engine.sendDataPacket(chunkPacket, DataPacket_Kind.RELIABLE);
        (_b = options === null || options === void 0 ? void 0 : options.onProgress) === null || _b === void 0 ? void 0 : _b.call(options, (i + 1) / totalChunks);
      }
      const trailer = new DataStream_Trailer({
        streamId
      });
      const trailerPacket = new DataPacket({
        destinationIdentities,
        value: {
          case: "streamTrailer",
          value: trailer
        }
      });
      yield this.engine.sendDataPacket(trailerPacket, DataPacket_Kind.RELIABLE);
    });
  }
  /**
   * Initiate an RPC call to a remote participant
   * @param params - Parameters for initiating the RPC call, see {@link PerformRpcParams}
   * @returns A promise that resolves with the response payload or rejects with an error.
   * @throws Error on failure. Details in `message`.
   */
  performRpc(_a) {
    return __awaiter(this, arguments, void 0, function(_ref4) {
      var _this5 = this;
      let {
        destinationIdentity,
        method,
        payload,
        responseTimeout = 1e4
      } = _ref4;
      return function* () {
        const maxRoundTripLatency = 2e3;
        return new Promise((resolve, reject) => __awaiter(_this5, void 0, void 0, function* () {
          var _a2, _b, _c, _d;
          if (byteLength(payload) > MAX_PAYLOAD_BYTES) {
            reject(RpcError.builtIn("REQUEST_PAYLOAD_TOO_LARGE"));
            return;
          }
          if (((_b = (_a2 = this.engine.latestJoinResponse) === null || _a2 === void 0 ? void 0 : _a2.serverInfo) === null || _b === void 0 ? void 0 : _b.version) && compareVersions((_d = (_c = this.engine.latestJoinResponse) === null || _c === void 0 ? void 0 : _c.serverInfo) === null || _d === void 0 ? void 0 : _d.version, "1.8.0") < 0) {
            reject(RpcError.builtIn("UNSUPPORTED_SERVER"));
            return;
          }
          const id = crypto.randomUUID();
          yield this.publishRpcRequest(destinationIdentity, id, method, payload, responseTimeout - maxRoundTripLatency);
          const ackTimeoutId = setTimeout(() => {
            this.pendingAcks.delete(id);
            reject(RpcError.builtIn("CONNECTION_TIMEOUT"));
            this.pendingResponses.delete(id);
            clearTimeout(responseTimeoutId);
          }, maxRoundTripLatency);
          this.pendingAcks.set(id, {
            resolve: () => {
              clearTimeout(ackTimeoutId);
            },
            participantIdentity: destinationIdentity
          });
          const responseTimeoutId = setTimeout(() => {
            this.pendingResponses.delete(id);
            reject(RpcError.builtIn("RESPONSE_TIMEOUT"));
          }, responseTimeout);
          this.pendingResponses.set(id, {
            resolve: (responsePayload, responseError) => {
              clearTimeout(responseTimeoutId);
              if (this.pendingAcks.has(id)) {
                console.warn("RPC response received before ack", id);
                this.pendingAcks.delete(id);
                clearTimeout(ackTimeoutId);
              }
              if (responseError) {
                reject(responseError);
              } else {
                resolve(responsePayload !== null && responsePayload !== void 0 ? responsePayload : "");
              }
            },
            participantIdentity: destinationIdentity
          });
        }));
      }();
    });
  }
  /**
   * @deprecated use `room.registerRpcMethod` instead
   */
  registerRpcMethod(method, handler) {
    if (this.rpcHandlers.has(method)) {
      this.log.warn("you're overriding the RPC handler for method ".concat(method, ", in the future this will throw an error"));
    }
    this.rpcHandlers.set(method, handler);
  }
  /**
   * @deprecated use `room.unregisterRpcMethod` instead
   */
  unregisterRpcMethod(method) {
    this.rpcHandlers.delete(method);
  }
  /**
   * Control who can subscribe to LocalParticipant's published tracks.
   *
   * By default, all participants can subscribe. This allows fine-grained control over
   * who is able to subscribe at a participant and track level.
   *
   * Note: if access is given at a track-level (i.e. both [allParticipantsAllowed] and
   * [ParticipantTrackPermission.allTracksAllowed] are false), any newer published tracks
   * will not grant permissions to any participants and will require a subsequent
   * permissions update to allow subscription.
   *
   * @param allParticipantsAllowed Allows all participants to subscribe all tracks.
   *  Takes precedence over [[participantTrackPermissions]] if set to true.
   *  By default this is set to true.
   * @param participantTrackPermissions Full list of individual permissions per
   *  participant/track. Any omitted participants will not receive any permissions.
   */
  setTrackSubscriptionPermissions(allParticipantsAllowed) {
    let participantTrackPermissions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    this.participantTrackPermissions = participantTrackPermissions;
    this.allParticipantsAllowedToSubscribe = allParticipantsAllowed;
    if (!this.engine.client.isDisconnected) {
      this.updateTrackSubscriptionPermissions();
    }
  }
  handleIncomingRpcAck(requestId) {
    const handler = this.pendingAcks.get(requestId);
    if (handler) {
      handler.resolve();
      this.pendingAcks.delete(requestId);
    } else {
      console.error("Ack received for unexpected RPC request", requestId);
    }
  }
  handleIncomingRpcResponse(requestId, payload, error) {
    const handler = this.pendingResponses.get(requestId);
    if (handler) {
      handler.resolve(payload, error);
      this.pendingResponses.delete(requestId);
    } else {
      console.error("Response received for unexpected RPC request", requestId);
    }
  }
  /** @internal */
  publishRpcRequest(destinationIdentity, requestId, method, payload, responseTimeout) {
    return __awaiter(this, void 0, void 0, function* () {
      const packet = new DataPacket({
        destinationIdentities: [destinationIdentity],
        kind: DataPacket_Kind.RELIABLE,
        value: {
          case: "rpcRequest",
          value: new RpcRequest({
            id: requestId,
            method,
            payload,
            responseTimeoutMs: responseTimeout,
            version: 1
          })
        }
      });
      yield this.engine.sendDataPacket(packet, DataPacket_Kind.RELIABLE);
    });
  }
  /** @internal */
  handleParticipantDisconnected(participantIdentity) {
    for (const [id, {
      participantIdentity: pendingIdentity
    }] of this.pendingAcks) {
      if (pendingIdentity === participantIdentity) {
        this.pendingAcks.delete(id);
      }
    }
    for (const [id, {
      participantIdentity: pendingIdentity,
      resolve
    }] of this.pendingResponses) {
      if (pendingIdentity === participantIdentity) {
        resolve(null, RpcError.builtIn("RECIPIENT_DISCONNECTED"));
        this.pendingResponses.delete(id);
      }
    }
  }
  /** @internal */
  setEnabledPublishCodecs(codecs) {
    this.enabledPublishVideoCodecs = codecs.filter((c) => c.mime.split("/")[0].toLowerCase() === "video");
  }
  /** @internal */
  updateInfo(info) {
    if (info.sid !== this.sid) {
      return false;
    }
    if (!super.updateInfo(info)) {
      return false;
    }
    info.tracks.forEach((ti) => {
      var _a, _b;
      const pub = this.trackPublications.get(ti.sid);
      if (pub) {
        const mutedOnServer = pub.isMuted || ((_b = (_a = pub.track) === null || _a === void 0 ? void 0 : _a.isUpstreamPaused) !== null && _b !== void 0 ? _b : false);
        if (mutedOnServer !== ti.muted) {
          this.log.debug("updating server mute state after reconcile", Object.assign(Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(pub)), {
            mutedOnServer
          }));
          this.engine.client.sendMuteTrack(ti.sid, mutedOnServer);
        }
      }
    });
    return true;
  }
  getPublicationForTrack(track) {
    let publication;
    this.trackPublications.forEach((pub) => {
      const localTrack = pub.track;
      if (!localTrack) {
        return;
      }
      if (track instanceof MediaStreamTrack) {
        if (isLocalAudioTrack(localTrack) || isLocalVideoTrack(localTrack)) {
          if (localTrack.mediaStreamTrack === track) {
            publication = pub;
          }
        }
      } else if (track === localTrack) {
        publication = pub;
      }
    });
    return publication;
  }
  waitForPendingPublicationOfSource(source) {
    return __awaiter(this, void 0, void 0, function* () {
      const waitForPendingTimeout = 1e4;
      const startTime = Date.now();
      while (Date.now() < startTime + waitForPendingTimeout) {
        const publishPromiseEntry = Array.from(this.pendingPublishPromises.entries()).find((_ref5) => {
          let [pendingTrack] = _ref5;
          return pendingTrack.source === source;
        });
        if (publishPromiseEntry) {
          return publishPromiseEntry[1];
        }
        yield sleep(20);
      }
    });
  }
};
var RemoteTrackPublication = class extends TrackPublication {
  constructor(kind, ti, autoSubscribe, loggerOptions) {
    super(kind, ti.sid, ti.name, loggerOptions);
    this.track = void 0;
    this.allowed = true;
    this.disabled = false;
    this.currentVideoQuality = VideoQuality.HIGH;
    this.handleEnded = (track) => {
      this.setTrack(void 0);
      this.emit(TrackEvent.Ended, track);
    };
    this.handleVisibilityChange = (visible) => {
      this.log.debug("adaptivestream video visibility ".concat(this.trackSid, ", visible=").concat(visible), this.logContext);
      this.disabled = !visible;
      this.emitTrackUpdate();
    };
    this.handleVideoDimensionsChange = (dimensions) => {
      this.log.debug("adaptivestream video dimensions ".concat(dimensions.width, "x").concat(dimensions.height), this.logContext);
      this.videoDimensions = dimensions;
      this.emitTrackUpdate();
    };
    this.subscribed = autoSubscribe;
    this.updateInfo(ti);
  }
  /**
   * Subscribe or unsubscribe to this remote track
   * @param subscribed true to subscribe to a track, false to unsubscribe
   */
  setSubscribed(subscribed) {
    const prevStatus = this.subscriptionStatus;
    const prevPermission = this.permissionStatus;
    this.subscribed = subscribed;
    if (subscribed) {
      this.allowed = true;
    }
    const sub = new UpdateSubscription({
      trackSids: [this.trackSid],
      subscribe: this.subscribed,
      participantTracks: [new ParticipantTracks({
        // sending an empty participant id since TrackPublication doesn't keep it
        // this is filled in by the participant that receives this message
        participantSid: "",
        trackSids: [this.trackSid]
      })]
    });
    this.emit(TrackEvent.UpdateSubscription, sub);
    this.emitSubscriptionUpdateIfChanged(prevStatus);
    this.emitPermissionUpdateIfChanged(prevPermission);
  }
  get subscriptionStatus() {
    if (this.subscribed === false) {
      return TrackPublication.SubscriptionStatus.Unsubscribed;
    }
    if (!super.isSubscribed) {
      return TrackPublication.SubscriptionStatus.Desired;
    }
    return TrackPublication.SubscriptionStatus.Subscribed;
  }
  get permissionStatus() {
    return this.allowed ? TrackPublication.PermissionStatus.Allowed : TrackPublication.PermissionStatus.NotAllowed;
  }
  /**
   * Returns true if track is subscribed, and ready for playback
   */
  get isSubscribed() {
    if (this.subscribed === false) {
      return false;
    }
    return super.isSubscribed;
  }
  // returns client's desire to subscribe to a track, also true if autoSubscribe is enabled
  get isDesired() {
    return this.subscribed !== false;
  }
  get isEnabled() {
    return !this.disabled;
  }
  get isLocal() {
    return false;
  }
  /**
   * disable server from sending down data for this track. this is useful when
   * the participant is off screen, you may disable streaming down their video
   * to reduce bandwidth requirements
   * @param enabled
   */
  setEnabled(enabled) {
    if (!this.isManualOperationAllowed() || this.disabled === !enabled) {
      return;
    }
    this.disabled = !enabled;
    this.emitTrackUpdate();
  }
  /**
   * for tracks that support simulcasting, adjust subscribed quality
   *
   * This indicates the highest quality the client can accept. if network
   * bandwidth does not allow, server will automatically reduce quality to
   * optimize for uninterrupted video
   */
  setVideoQuality(quality) {
    if (!this.isManualOperationAllowed() || this.currentVideoQuality === quality) {
      return;
    }
    this.currentVideoQuality = quality;
    this.videoDimensions = void 0;
    this.emitTrackUpdate();
  }
  setVideoDimensions(dimensions) {
    var _a, _b;
    if (!this.isManualOperationAllowed()) {
      return;
    }
    if (((_a = this.videoDimensions) === null || _a === void 0 ? void 0 : _a.width) === dimensions.width && ((_b = this.videoDimensions) === null || _b === void 0 ? void 0 : _b.height) === dimensions.height) {
      return;
    }
    if (isRemoteVideoTrack(this.track)) {
      this.videoDimensions = dimensions;
    }
    this.currentVideoQuality = void 0;
    this.emitTrackUpdate();
  }
  setVideoFPS(fps) {
    if (!this.isManualOperationAllowed()) {
      return;
    }
    if (!isRemoteVideoTrack(this.track)) {
      return;
    }
    if (this.fps === fps) {
      return;
    }
    this.fps = fps;
    this.emitTrackUpdate();
  }
  get videoQuality() {
    return this.currentVideoQuality;
  }
  /** @internal */
  setTrack(track) {
    const prevStatus = this.subscriptionStatus;
    const prevPermission = this.permissionStatus;
    const prevTrack = this.track;
    if (prevTrack === track) {
      return;
    }
    if (prevTrack) {
      prevTrack.off(TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
      prevTrack.off(TrackEvent.VisibilityChanged, this.handleVisibilityChange);
      prevTrack.off(TrackEvent.Ended, this.handleEnded);
      prevTrack.detach();
      prevTrack.stopMonitor();
      this.emit(TrackEvent.Unsubscribed, prevTrack);
    }
    super.setTrack(track);
    if (track) {
      track.sid = this.trackSid;
      track.on(TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange);
      track.on(TrackEvent.VisibilityChanged, this.handleVisibilityChange);
      track.on(TrackEvent.Ended, this.handleEnded);
      this.emit(TrackEvent.Subscribed, track);
    }
    this.emitPermissionUpdateIfChanged(prevPermission);
    this.emitSubscriptionUpdateIfChanged(prevStatus);
  }
  /** @internal */
  setAllowed(allowed) {
    const prevStatus = this.subscriptionStatus;
    const prevPermission = this.permissionStatus;
    this.allowed = allowed;
    this.emitPermissionUpdateIfChanged(prevPermission);
    this.emitSubscriptionUpdateIfChanged(prevStatus);
  }
  /** @internal */
  setSubscriptionError(error) {
    this.emit(TrackEvent.SubscriptionFailed, error);
  }
  /** @internal */
  updateInfo(info) {
    super.updateInfo(info);
    const prevMetadataMuted = this.metadataMuted;
    this.metadataMuted = info.muted;
    if (this.track) {
      this.track.setMuted(info.muted);
    } else if (prevMetadataMuted !== info.muted) {
      this.emit(info.muted ? TrackEvent.Muted : TrackEvent.Unmuted);
    }
  }
  emitSubscriptionUpdateIfChanged(previousStatus) {
    const currentStatus = this.subscriptionStatus;
    if (previousStatus === currentStatus) {
      return;
    }
    this.emit(TrackEvent.SubscriptionStatusChanged, currentStatus, previousStatus);
  }
  emitPermissionUpdateIfChanged(previousPermissionStatus) {
    const currentPermissionStatus = this.permissionStatus;
    if (currentPermissionStatus !== previousPermissionStatus) {
      this.emit(TrackEvent.SubscriptionPermissionChanged, this.permissionStatus, previousPermissionStatus);
    }
  }
  isManualOperationAllowed() {
    if (this.kind === Track.Kind.Video && this.isAdaptiveStream) {
      this.log.warn("adaptive stream is enabled, cannot change video track settings", this.logContext);
      return false;
    }
    if (!this.isDesired) {
      this.log.warn("cannot update track settings when not subscribed", this.logContext);
      return false;
    }
    return true;
  }
  get isAdaptiveStream() {
    return isRemoteVideoTrack(this.track) && this.track.isAdaptiveStream;
  }
  /* @internal */
  emitTrackUpdate() {
    const settings = new UpdateTrackSettings({
      trackSids: [this.trackSid],
      disabled: this.disabled,
      fps: this.fps
    });
    if (this.videoDimensions) {
      settings.width = Math.ceil(this.videoDimensions.width);
      settings.height = Math.ceil(this.videoDimensions.height);
    } else if (this.currentVideoQuality !== void 0) {
      settings.quality = this.currentVideoQuality;
    } else {
      settings.quality = VideoQuality.HIGH;
    }
    this.emit(TrackEvent.UpdateSettings, settings);
  }
};
var RemoteParticipant = class _RemoteParticipant extends Participant {
  /** @internal */
  static fromParticipantInfo(signalClient, pi, loggerOptions) {
    return new _RemoteParticipant(signalClient, pi.sid, pi.identity, pi.name, pi.metadata, pi.attributes, loggerOptions, pi.kind);
  }
  get logContext() {
    return Object.assign(Object.assign({}, super.logContext), {
      rpID: this.sid,
      remoteParticipant: this.identity
    });
  }
  /** @internal */
  constructor(signalClient, sid, identity, name, metadata, attributes, loggerOptions) {
    let kind = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : ParticipantInfo_Kind.STANDARD;
    super(sid, identity || "", name, metadata, attributes, loggerOptions, kind);
    this.signalClient = signalClient;
    this.trackPublications = /* @__PURE__ */ new Map();
    this.audioTrackPublications = /* @__PURE__ */ new Map();
    this.videoTrackPublications = /* @__PURE__ */ new Map();
    this.volumeMap = /* @__PURE__ */ new Map();
  }
  addTrackPublication(publication) {
    super.addTrackPublication(publication);
    publication.on(TrackEvent.UpdateSettings, (settings) => {
      this.log.debug("send update settings", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(publication)));
      this.signalClient.sendUpdateTrackSettings(settings);
    });
    publication.on(TrackEvent.UpdateSubscription, (sub) => {
      sub.participantTracks.forEach((pt) => {
        pt.participantSid = this.sid;
      });
      this.signalClient.sendUpdateSubscription(sub);
    });
    publication.on(TrackEvent.SubscriptionPermissionChanged, (status) => {
      this.emit(ParticipantEvent.TrackSubscriptionPermissionChanged, publication, status);
    });
    publication.on(TrackEvent.SubscriptionStatusChanged, (status) => {
      this.emit(ParticipantEvent.TrackSubscriptionStatusChanged, publication, status);
    });
    publication.on(TrackEvent.Subscribed, (track) => {
      this.emit(ParticipantEvent.TrackSubscribed, track, publication);
    });
    publication.on(TrackEvent.Unsubscribed, (previousTrack) => {
      this.emit(ParticipantEvent.TrackUnsubscribed, previousTrack, publication);
    });
    publication.on(TrackEvent.SubscriptionFailed, (error) => {
      this.emit(ParticipantEvent.TrackSubscriptionFailed, publication.trackSid, error);
    });
  }
  getTrackPublication(source) {
    const track = super.getTrackPublication(source);
    if (track) {
      return track;
    }
  }
  getTrackPublicationByName(name) {
    const track = super.getTrackPublicationByName(name);
    if (track) {
      return track;
    }
  }
  /**
   * sets the volume on the participant's audio track
   * by default, this affects the microphone publication
   * a different source can be passed in as a second argument
   * if no track exists the volume will be applied when the microphone track is added
   */
  setVolume(volume) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Track.Source.Microphone;
    this.volumeMap.set(source, volume);
    const audioPublication = this.getTrackPublication(source);
    if (audioPublication && audioPublication.track) {
      audioPublication.track.setVolume(volume);
    }
  }
  /**
   * gets the volume on the participant's microphone track
   */
  getVolume() {
    let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Track.Source.Microphone;
    const audioPublication = this.getTrackPublication(source);
    if (audioPublication && audioPublication.track) {
      return audioPublication.track.getVolume();
    }
    return this.volumeMap.get(source);
  }
  /** @internal */
  addSubscribedMediaTrack(mediaTrack, sid, mediaStream, receiver, adaptiveStreamSettings, triesLeft) {
    let publication = this.getTrackPublicationBySid(sid);
    if (!publication) {
      if (!sid.startsWith("TR")) {
        this.trackPublications.forEach((p) => {
          if (!publication && mediaTrack.kind === p.kind.toString()) {
            publication = p;
          }
        });
      }
    }
    if (!publication) {
      if (triesLeft === 0) {
        this.log.error("could not find published track", Object.assign(Object.assign({}, this.logContext), {
          trackSid: sid
        }));
        this.emit(ParticipantEvent.TrackSubscriptionFailed, sid);
        return;
      }
      if (triesLeft === void 0)
        triesLeft = 20;
      setTimeout(() => {
        this.addSubscribedMediaTrack(mediaTrack, sid, mediaStream, receiver, adaptiveStreamSettings, triesLeft - 1);
      }, 150);
      return;
    }
    if (mediaTrack.readyState === "ended") {
      this.log.error("unable to subscribe because MediaStreamTrack is ended. Do not call MediaStreamTrack.stop()", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(publication)));
      this.emit(ParticipantEvent.TrackSubscriptionFailed, sid);
      return;
    }
    const isVideo = mediaTrack.kind === "video";
    let track;
    if (isVideo) {
      track = new RemoteVideoTrack(mediaTrack, sid, receiver, adaptiveStreamSettings);
    } else {
      track = new RemoteAudioTrack(mediaTrack, sid, receiver, this.audioContext, this.audioOutput);
    }
    track.source = publication.source;
    track.isMuted = publication.isMuted;
    track.setMediaStream(mediaStream);
    track.start();
    publication.setTrack(track);
    if (this.volumeMap.has(publication.source) && isRemoteTrack(track) && isAudioTrack(track)) {
      track.setVolume(this.volumeMap.get(publication.source));
    }
    return publication;
  }
  /** @internal */
  get hasMetadata() {
    return !!this.participantInfo;
  }
  /**
   * @internal
   */
  getTrackPublicationBySid(sid) {
    return this.trackPublications.get(sid);
  }
  /** @internal */
  updateInfo(info) {
    if (!super.updateInfo(info)) {
      return false;
    }
    const validTracks = /* @__PURE__ */ new Map();
    const newTracks = /* @__PURE__ */ new Map();
    info.tracks.forEach((ti) => {
      var _a, _b;
      let publication = this.getTrackPublicationBySid(ti.sid);
      if (!publication) {
        const kind = Track.kindFromProto(ti.type);
        if (!kind) {
          return;
        }
        publication = new RemoteTrackPublication(kind, ti, (_a = this.signalClient.connectOptions) === null || _a === void 0 ? void 0 : _a.autoSubscribe, {
          loggerContextCb: () => this.logContext,
          loggerName: (_b = this.loggerOptions) === null || _b === void 0 ? void 0 : _b.loggerName
        });
        publication.updateInfo(ti);
        newTracks.set(ti.sid, publication);
        const existingTrackOfSource = Array.from(this.trackPublications.values()).find((publishedTrack) => publishedTrack.source === (publication === null || publication === void 0 ? void 0 : publication.source));
        if (existingTrackOfSource && publication.source !== Track.Source.Unknown) {
          this.log.debug("received a second track publication for ".concat(this.identity, " with the same source: ").concat(publication.source), Object.assign(Object.assign({}, this.logContext), {
            oldTrack: getLogContextFromTrack(existingTrackOfSource),
            newTrack: getLogContextFromTrack(publication)
          }));
        }
        this.addTrackPublication(publication);
      } else {
        publication.updateInfo(ti);
      }
      validTracks.set(ti.sid, publication);
    });
    this.trackPublications.forEach((publication) => {
      if (!validTracks.has(publication.trackSid)) {
        this.log.trace("detected removed track on remote participant, unpublishing", Object.assign(Object.assign({}, this.logContext), getLogContextFromTrack(publication)));
        this.unpublishTrack(publication.trackSid, true);
      }
    });
    newTracks.forEach((publication) => {
      this.emit(ParticipantEvent.TrackPublished, publication);
    });
    return true;
  }
  /** @internal */
  unpublishTrack(sid, sendUnpublish) {
    const publication = this.trackPublications.get(sid);
    if (!publication) {
      return;
    }
    const {
      track
    } = publication;
    if (track) {
      track.stop();
      publication.setTrack(void 0);
    }
    this.trackPublications.delete(sid);
    switch (publication.kind) {
      case Track.Kind.Audio:
        this.audioTrackPublications.delete(sid);
        break;
      case Track.Kind.Video:
        this.videoTrackPublications.delete(sid);
        break;
    }
    if (sendUnpublish) {
      this.emit(ParticipantEvent.TrackUnpublished, publication);
    }
  }
  /**
   * @internal
   */
  setAudioOutput(output) {
    return __awaiter(this, void 0, void 0, function* () {
      this.audioOutput = output;
      const promises = [];
      this.audioTrackPublications.forEach((pub) => {
        var _a;
        if (isAudioTrack(pub.track) && isRemoteTrack(pub.track)) {
          promises.push(pub.track.setSinkId((_a = output.deviceId) !== null && _a !== void 0 ? _a : "default"));
        }
      });
      yield Promise.all(promises);
    });
  }
  /** @internal */
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    this.log.trace("participant event", Object.assign(Object.assign({}, this.logContext), {
      event,
      args
    }));
    return super.emit(event, ...args);
  }
};
var ConnectionState;
(function(ConnectionState2) {
  ConnectionState2["Disconnected"] = "disconnected";
  ConnectionState2["Connecting"] = "connecting";
  ConnectionState2["Connected"] = "connected";
  ConnectionState2["Reconnecting"] = "reconnecting";
  ConnectionState2["SignalReconnecting"] = "signalReconnecting";
})(ConnectionState || (ConnectionState = {}));
var connectionReconcileFrequency = 4 * 1e3;
var Room = class _Room extends eventsExports.EventEmitter {
  /**
   * Creates a new Room, the primary construct for a LiveKit session.
   * @param options
   */
  constructor(options) {
    var _this;
    var _a, _b, _c;
    super();
    _this = this;
    this.state = ConnectionState.Disconnected;
    this.activeSpeakers = [];
    this.isE2EEEnabled = false;
    this.audioEnabled = true;
    this.isVideoPlaybackBlocked = false;
    this.log = livekitLogger;
    this.bufferedEvents = [];
    this.isResuming = false;
    this.byteStreamControllers = /* @__PURE__ */ new Map();
    this.textStreamControllers = /* @__PURE__ */ new Map();
    this.byteStreamHandlers = /* @__PURE__ */ new Map();
    this.textStreamHandlers = /* @__PURE__ */ new Map();
    this.rpcHandlers = /* @__PURE__ */ new Map();
    this.connect = (url, token, opts) => __awaiter(this, void 0, void 0, function* () {
      var _a2;
      if (!isBrowserSupported()) {
        if (isReactNative()) {
          throw Error("WebRTC isn't detected, have you called registerGlobals?");
        } else {
          throw Error("LiveKit doesn't seem to be supported on this browser. Try to update your browser and make sure no browser extensions are disabling webRTC.");
        }
      }
      const unlockDisconnect = yield this.disconnectLock.lock();
      if (this.state === ConnectionState.Connected) {
        this.log.info("already connected to room ".concat(this.name), this.logContext);
        unlockDisconnect();
        return Promise.resolve();
      }
      if (this.connectFuture) {
        unlockDisconnect();
        return this.connectFuture.promise;
      }
      this.setAndEmitConnectionState(ConnectionState.Connecting);
      if (((_a2 = this.regionUrlProvider) === null || _a2 === void 0 ? void 0 : _a2.getServerUrl().toString()) !== url) {
        this.regionUrl = void 0;
        this.regionUrlProvider = void 0;
      }
      if (isCloud(new URL(url))) {
        if (this.regionUrlProvider === void 0) {
          this.regionUrlProvider = new RegionUrlProvider(url, token);
        } else {
          this.regionUrlProvider.updateToken(token);
        }
        this.regionUrlProvider.fetchRegionSettings().then((settings) => {
          var _a3;
          (_a3 = this.regionUrlProvider) === null || _a3 === void 0 ? void 0 : _a3.setServerReportedRegions(settings);
        }).catch((e2) => {
          this.log.warn("could not fetch region settings", Object.assign(Object.assign({}, this.logContext), {
            error: e2
          }));
        });
      }
      const connectFn = (resolve, reject, regionUrl2) => __awaiter(this, void 0, void 0, function* () {
        var _a3, _b2;
        if (this.abortController) {
          this.abortController.abort();
        }
        const abortController = new AbortController();
        this.abortController = abortController;
        unlockDisconnect === null || unlockDisconnect === void 0 ? void 0 : unlockDisconnect();
        try {
          yield this.attemptConnection(regionUrl2 !== null && regionUrl2 !== void 0 ? regionUrl2 : url, token, opts, abortController);
          this.abortController = void 0;
          resolve();
        } catch (e2) {
          if (this.regionUrlProvider && e2 instanceof ConnectionError && e2.reason !== ConnectionErrorReason.Cancelled && e2.reason !== ConnectionErrorReason.NotAllowed) {
            let nextUrl = null;
            try {
              nextUrl = yield this.regionUrlProvider.getNextBestRegionUrl((_a3 = this.abortController) === null || _a3 === void 0 ? void 0 : _a3.signal);
            } catch (error) {
              if (error instanceof ConnectionError && (error.status === 401 || error.reason === ConnectionErrorReason.Cancelled)) {
                this.handleDisconnect(this.options.stopLocalTrackOnUnpublish);
                reject(error);
                return;
              }
            }
            if (nextUrl && !((_b2 = this.abortController) === null || _b2 === void 0 ? void 0 : _b2.signal.aborted)) {
              this.log.info("Initial connection failed with ConnectionError: ".concat(e2.message, ". Retrying with another region: ").concat(nextUrl), this.logContext);
              this.recreateEngine();
              yield connectFn(resolve, reject, nextUrl);
            } else {
              this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, getDisconnectReasonFromConnectionError(e2));
              reject(e2);
            }
          } else {
            let disconnectReason = DisconnectReason.UNKNOWN_REASON;
            if (e2 instanceof ConnectionError) {
              disconnectReason = getDisconnectReasonFromConnectionError(e2);
            }
            this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, disconnectReason);
            reject(e2);
          }
        }
      });
      const regionUrl = this.regionUrl;
      this.regionUrl = void 0;
      this.connectFuture = new Future((resolve, reject) => {
        connectFn(resolve, reject, regionUrl);
      }, () => {
        this.clearConnectionFutures();
      });
      return this.connectFuture.promise;
    });
    this.connectSignal = (url, token, engine, connectOptions, roomOptions, abortController) => __awaiter(this, void 0, void 0, function* () {
      var _a2, _b2, _c2;
      const joinResponse = yield engine.join(url, token, {
        autoSubscribe: connectOptions.autoSubscribe,
        adaptiveStream: typeof roomOptions.adaptiveStream === "object" ? true : roomOptions.adaptiveStream,
        maxRetries: connectOptions.maxRetries,
        e2eeEnabled: !!this.e2eeManager,
        websocketTimeout: connectOptions.websocketTimeout
      }, abortController.signal);
      let serverInfo = joinResponse.serverInfo;
      if (!serverInfo) {
        serverInfo = {
          version: joinResponse.serverVersion,
          region: joinResponse.serverRegion
        };
      }
      this.serverInfo = serverInfo;
      this.log.debug("connected to Livekit Server ".concat(Object.entries(serverInfo).map((_ref) => {
        let [key, value] = _ref;
        return "".concat(key, ": ").concat(value);
      }).join(", ")), {
        room: (_a2 = joinResponse.room) === null || _a2 === void 0 ? void 0 : _a2.name,
        roomSid: (_b2 = joinResponse.room) === null || _b2 === void 0 ? void 0 : _b2.sid,
        identity: (_c2 = joinResponse.participant) === null || _c2 === void 0 ? void 0 : _c2.identity
      });
      if (!serverInfo.version) {
        throw new UnsupportedServer("unknown server version");
      }
      if (serverInfo.version === "0.15.1" && this.options.dynacast) {
        this.log.debug("disabling dynacast due to server version", this.logContext);
        roomOptions.dynacast = false;
      }
      return joinResponse;
    });
    this.applyJoinResponse = (joinResponse) => {
      const pi = joinResponse.participant;
      this.localParticipant.sid = pi.sid;
      this.localParticipant.identity = pi.identity;
      this.localParticipant.setEnabledPublishCodecs(joinResponse.enabledPublishCodecs);
      if (this.options.e2ee && this.e2eeManager) {
        try {
          this.e2eeManager.setSifTrailer(joinResponse.sifTrailer);
        } catch (e2) {
          this.log.error(e2 instanceof Error ? e2.message : "Could not set SifTrailer", Object.assign(Object.assign({}, this.logContext), {
            error: e2
          }));
        }
      }
      this.handleParticipantUpdates([pi, ...joinResponse.otherParticipants]);
      if (joinResponse.room) {
        this.handleRoomUpdate(joinResponse.room);
      }
    };
    this.attemptConnection = (url, token, opts, abortController) => __awaiter(this, void 0, void 0, function* () {
      var _a2, _b2;
      if (this.state === ConnectionState.Reconnecting || this.isResuming || ((_a2 = this.engine) === null || _a2 === void 0 ? void 0 : _a2.pendingReconnect)) {
        this.log.info("Reconnection attempt replaced by new connection attempt", this.logContext);
        this.recreateEngine();
      } else {
        this.maybeCreateEngine();
      }
      if ((_b2 = this.regionUrlProvider) === null || _b2 === void 0 ? void 0 : _b2.isCloud()) {
        this.engine.setRegionUrlProvider(this.regionUrlProvider);
      }
      this.acquireAudioContext();
      this.connOptions = Object.assign(Object.assign({}, roomConnectOptionDefaults), opts);
      if (this.connOptions.rtcConfig) {
        this.engine.rtcConfig = this.connOptions.rtcConfig;
      }
      if (this.connOptions.peerConnectionTimeout) {
        this.engine.peerConnectionTimeout = this.connOptions.peerConnectionTimeout;
      }
      try {
        const joinResponse = yield this.connectSignal(url, token, this.engine, this.connOptions, this.options, abortController);
        this.applyJoinResponse(joinResponse);
        this.setupLocalParticipantEvents();
        this.emit(RoomEvent.SignalConnected);
      } catch (err) {
        yield this.engine.close();
        this.recreateEngine();
        const resultingError = new ConnectionError("could not establish signal connection", ConnectionErrorReason.ServerUnreachable);
        if (err instanceof Error) {
          resultingError.message = "".concat(resultingError.message, ": ").concat(err.message);
        }
        if (err instanceof ConnectionError) {
          resultingError.reason = err.reason;
          resultingError.status = err.status;
        }
        this.log.debug("error trying to establish signal connection", Object.assign(Object.assign({}, this.logContext), {
          error: err
        }));
        throw resultingError;
      }
      if (abortController.signal.aborted) {
        yield this.engine.close();
        this.recreateEngine();
        throw new ConnectionError("Connection attempt aborted", ConnectionErrorReason.Cancelled);
      }
      try {
        yield this.engine.waitForPCInitialConnection(this.connOptions.peerConnectionTimeout, abortController);
      } catch (e2) {
        yield this.engine.close();
        this.recreateEngine();
        throw e2;
      }
      if (isWeb() && this.options.disconnectOnPageLeave) {
        window.addEventListener("pagehide", this.onPageLeave);
        window.addEventListener("beforeunload", this.onPageLeave);
      }
      if (isWeb()) {
        document.addEventListener("freeze", this.onPageLeave);
      }
      this.setAndEmitConnectionState(ConnectionState.Connected);
      this.emit(RoomEvent.Connected);
      this.registerConnectionReconcile();
    });
    this.disconnect = function() {
      for (var _len = arguments.length, args_1 = new Array(_len), _key = 0; _key < _len; _key++) {
        args_1[_key] = arguments[_key];
      }
      return __awaiter(_this, [...args_1], void 0, function() {
        var _this2 = this;
        let stopTracks = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
        return function* () {
          var _a2, _b2, _c2, _d;
          const unlock = yield _this2.disconnectLock.lock();
          try {
            if (_this2.state === ConnectionState.Disconnected) {
              _this2.log.debug("already disconnected", _this2.logContext);
              return;
            }
            _this2.log.info("disconnect from room", Object.assign({}, _this2.logContext));
            if (_this2.state === ConnectionState.Connecting || _this2.state === ConnectionState.Reconnecting || _this2.isResuming) {
              _this2.log.warn("abort connection attempt", _this2.logContext);
              (_a2 = _this2.abortController) === null || _a2 === void 0 ? void 0 : _a2.abort();
              (_c2 = (_b2 = _this2.connectFuture) === null || _b2 === void 0 ? void 0 : _b2.reject) === null || _c2 === void 0 ? void 0 : _c2.call(_b2, new ConnectionError("Client initiated disconnect", ConnectionErrorReason.Cancelled));
              _this2.connectFuture = void 0;
            }
            if (!((_d = _this2.engine) === null || _d === void 0 ? void 0 : _d.client.isDisconnected)) {
              yield _this2.engine.client.sendLeave();
            }
            if (_this2.engine) {
              yield _this2.engine.close();
            }
            _this2.handleDisconnect(stopTracks, DisconnectReason.CLIENT_INITIATED);
            _this2.engine = void 0;
          } finally {
            unlock();
          }
        }();
      });
    };
    this.onPageLeave = () => __awaiter(this, void 0, void 0, function* () {
      this.log.info("Page leave detected, disconnecting", this.logContext);
      yield this.disconnect();
    });
    this.startAudio = () => __awaiter(this, void 0, void 0, function* () {
      const elements = [];
      const browser = getBrowser();
      if (browser && browser.os === "iOS") {
        const audioId = "livekit-dummy-audio-el";
        let dummyAudioEl = document.getElementById(audioId);
        if (!dummyAudioEl) {
          dummyAudioEl = document.createElement("audio");
          dummyAudioEl.id = audioId;
          dummyAudioEl.autoplay = true;
          dummyAudioEl.hidden = true;
          const track = getEmptyAudioStreamTrack();
          track.enabled = true;
          const stream = new MediaStream([track]);
          dummyAudioEl.srcObject = stream;
          document.addEventListener("visibilitychange", () => {
            if (!dummyAudioEl) {
              return;
            }
            dummyAudioEl.srcObject = document.hidden ? null : stream;
            if (!document.hidden) {
              this.log.debug("page visible again, triggering startAudio to resume playback and update playback status", this.logContext);
              this.startAudio();
            }
          });
          document.body.append(dummyAudioEl);
          this.once(RoomEvent.Disconnected, () => {
            dummyAudioEl === null || dummyAudioEl === void 0 ? void 0 : dummyAudioEl.remove();
            dummyAudioEl = null;
          });
        }
        elements.push(dummyAudioEl);
      }
      this.remoteParticipants.forEach((p) => {
        p.audioTrackPublications.forEach((t) => {
          if (t.track) {
            t.track.attachedElements.forEach((e2) => {
              elements.push(e2);
            });
          }
        });
      });
      try {
        yield Promise.all([this.acquireAudioContext(), ...elements.map((e2) => {
          e2.muted = false;
          return e2.play();
        })]);
        this.handleAudioPlaybackStarted();
      } catch (err) {
        this.handleAudioPlaybackFailed(err);
        throw err;
      }
    });
    this.startVideo = () => __awaiter(this, void 0, void 0, function* () {
      const elements = [];
      for (const p of this.remoteParticipants.values()) {
        p.videoTrackPublications.forEach((tr) => {
          var _a2;
          (_a2 = tr.track) === null || _a2 === void 0 ? void 0 : _a2.attachedElements.forEach((el) => {
            if (!elements.includes(el)) {
              elements.push(el);
            }
          });
        });
      }
      yield Promise.all(elements.map((el) => el.play())).then(() => {
        this.handleVideoPlaybackStarted();
      }).catch((e2) => {
        if (e2.name === "NotAllowedError") {
          this.handleVideoPlaybackFailed();
        } else {
          this.log.warn("Resuming video playback failed, make sure you call `startVideo` directly in a user gesture handler", this.logContext);
        }
      });
    });
    this.handleRestarting = () => {
      this.clearConnectionReconcile();
      this.isResuming = false;
      for (const p of this.remoteParticipants.values()) {
        this.handleParticipantDisconnected(p.identity, p);
      }
      if (this.setAndEmitConnectionState(ConnectionState.Reconnecting)) {
        this.emit(RoomEvent.Reconnecting);
      }
    };
    this.handleSignalRestarted = (joinResponse) => __awaiter(this, void 0, void 0, function* () {
      this.log.debug("signal reconnected to server, region ".concat(joinResponse.serverRegion), Object.assign(Object.assign({}, this.logContext), {
        region: joinResponse.serverRegion
      }));
      this.bufferedEvents = [];
      this.applyJoinResponse(joinResponse);
      try {
        yield this.localParticipant.republishAllTracks(void 0, true);
      } catch (error) {
        this.log.error("error trying to re-publish tracks after reconnection", Object.assign(Object.assign({}, this.logContext), {
          error
        }));
      }
      try {
        yield this.engine.waitForRestarted();
        this.log.debug("fully reconnected to server", Object.assign(Object.assign({}, this.logContext), {
          region: joinResponse.serverRegion
        }));
      } catch (_a2) {
        return;
      }
      this.setAndEmitConnectionState(ConnectionState.Connected);
      this.emit(RoomEvent.Reconnected);
      this.registerConnectionReconcile();
      this.emitBufferedEvents();
    });
    this.handleParticipantUpdates = (participantInfos) => {
      participantInfos.forEach((info) => {
        var _a2;
        if (info.identity === this.localParticipant.identity) {
          this.localParticipant.updateInfo(info);
          return;
        }
        if (info.identity === "") {
          info.identity = (_a2 = this.sidToIdentity.get(info.sid)) !== null && _a2 !== void 0 ? _a2 : "";
        }
        let remoteParticipant = this.remoteParticipants.get(info.identity);
        if (info.state === ParticipantInfo_State.DISCONNECTED) {
          this.handleParticipantDisconnected(info.identity, remoteParticipant);
        } else {
          remoteParticipant = this.getOrCreateParticipant(info.identity, info);
        }
      });
    };
    this.handleActiveSpeakersUpdate = (speakers) => {
      const activeSpeakers = [];
      const seenSids = {};
      speakers.forEach((speaker) => {
        seenSids[speaker.sid] = true;
        if (speaker.sid === this.localParticipant.sid) {
          this.localParticipant.audioLevel = speaker.level;
          this.localParticipant.setIsSpeaking(true);
          activeSpeakers.push(this.localParticipant);
        } else {
          const p = this.getRemoteParticipantBySid(speaker.sid);
          if (p) {
            p.audioLevel = speaker.level;
            p.setIsSpeaking(true);
            activeSpeakers.push(p);
          }
        }
      });
      if (!seenSids[this.localParticipant.sid]) {
        this.localParticipant.audioLevel = 0;
        this.localParticipant.setIsSpeaking(false);
      }
      this.remoteParticipants.forEach((p) => {
        if (!seenSids[p.sid]) {
          p.audioLevel = 0;
          p.setIsSpeaking(false);
        }
      });
      this.activeSpeakers = activeSpeakers;
      this.emitWhenConnected(RoomEvent.ActiveSpeakersChanged, activeSpeakers);
    };
    this.handleSpeakersChanged = (speakerUpdates) => {
      const lastSpeakers = /* @__PURE__ */ new Map();
      this.activeSpeakers.forEach((p) => {
        const remoteParticipant = this.remoteParticipants.get(p.identity);
        if (remoteParticipant && remoteParticipant.sid !== p.sid) {
          return;
        }
        lastSpeakers.set(p.sid, p);
      });
      speakerUpdates.forEach((speaker) => {
        let p = this.getRemoteParticipantBySid(speaker.sid);
        if (speaker.sid === this.localParticipant.sid) {
          p = this.localParticipant;
        }
        if (!p) {
          return;
        }
        p.audioLevel = speaker.level;
        p.setIsSpeaking(speaker.active);
        if (speaker.active) {
          lastSpeakers.set(speaker.sid, p);
        } else {
          lastSpeakers.delete(speaker.sid);
        }
      });
      const activeSpeakers = Array.from(lastSpeakers.values());
      activeSpeakers.sort((a, b) => b.audioLevel - a.audioLevel);
      this.activeSpeakers = activeSpeakers;
      this.emitWhenConnected(RoomEvent.ActiveSpeakersChanged, activeSpeakers);
    };
    this.handleStreamStateUpdate = (streamStateUpdate) => {
      streamStateUpdate.streamStates.forEach((streamState) => {
        const participant = this.getRemoteParticipantBySid(streamState.participantSid);
        if (!participant) {
          return;
        }
        const pub = participant.getTrackPublicationBySid(streamState.trackSid);
        if (!pub || !pub.track) {
          return;
        }
        const newStreamState = Track.streamStateFromProto(streamState.state);
        if (newStreamState !== pub.track.streamState) {
          pub.track.streamState = newStreamState;
          participant.emit(ParticipantEvent.TrackStreamStateChanged, pub, pub.track.streamState);
          this.emitWhenConnected(RoomEvent.TrackStreamStateChanged, pub, pub.track.streamState, participant);
        }
      });
    };
    this.handleSubscriptionPermissionUpdate = (update) => {
      const participant = this.getRemoteParticipantBySid(update.participantSid);
      if (!participant) {
        return;
      }
      const pub = participant.getTrackPublicationBySid(update.trackSid);
      if (!pub) {
        return;
      }
      pub.setAllowed(update.allowed);
    };
    this.handleSubscriptionError = (update) => {
      const participant = Array.from(this.remoteParticipants.values()).find((p) => p.trackPublications.has(update.trackSid));
      if (!participant) {
        return;
      }
      const pub = participant.getTrackPublicationBySid(update.trackSid);
      if (!pub) {
        return;
      }
      pub.setSubscriptionError(update.err);
    };
    this.handleDataPacket = (packet) => {
      const participant = this.remoteParticipants.get(packet.participantIdentity);
      if (packet.value.case === "user") {
        this.handleUserPacket(participant, packet.value.value, packet.kind);
      } else if (packet.value.case === "transcription") {
        this.handleTranscription(participant, packet.value.value);
      } else if (packet.value.case === "sipDtmf") {
        this.handleSipDtmf(participant, packet.value.value);
      } else if (packet.value.case === "chatMessage") {
        this.handleChatMessage(participant, packet.value.value);
      } else if (packet.value.case === "metrics") {
        this.handleMetrics(packet.value.value, participant);
      } else if (packet.value.case === "streamHeader") {
        this.handleStreamHeader(packet.value.value, packet.participantIdentity);
      } else if (packet.value.case === "streamChunk") {
        this.handleStreamChunk(packet.value.value);
      } else if (packet.value.case === "streamTrailer") {
        this.handleStreamTrailer(packet.value.value);
      } else if (packet.value.case === "rpcRequest") {
        const rpc = packet.value.value;
        this.handleIncomingRpcRequest(packet.participantIdentity, rpc.id, rpc.method, rpc.payload, rpc.responseTimeoutMs, rpc.version);
      }
    };
    this.handleUserPacket = (participant, userPacket, kind) => {
      this.emit(RoomEvent.DataReceived, userPacket.payload, participant, kind, userPacket.topic);
      participant === null || participant === void 0 ? void 0 : participant.emit(ParticipantEvent.DataReceived, userPacket.payload, kind);
    };
    this.handleSipDtmf = (participant, dtmf) => {
      this.emit(RoomEvent.SipDTMFReceived, dtmf, participant);
      participant === null || participant === void 0 ? void 0 : participant.emit(ParticipantEvent.SipDTMFReceived, dtmf);
    };
    this.bufferedSegments = /* @__PURE__ */ new Map();
    this.handleTranscription = (_remoteParticipant, transcription) => {
      const participant = transcription.transcribedParticipantIdentity === this.localParticipant.identity ? this.localParticipant : this.getParticipantByIdentity(transcription.transcribedParticipantIdentity);
      const publication = participant === null || participant === void 0 ? void 0 : participant.trackPublications.get(transcription.trackId);
      const segments = extractTranscriptionSegments(transcription, this.transcriptionReceivedTimes);
      publication === null || publication === void 0 ? void 0 : publication.emit(TrackEvent.TranscriptionReceived, segments);
      participant === null || participant === void 0 ? void 0 : participant.emit(ParticipantEvent.TranscriptionReceived, segments, publication);
      this.emit(RoomEvent.TranscriptionReceived, segments, participant, publication);
    };
    this.handleChatMessage = (participant, chatMessage) => {
      const msg = extractChatMessage(chatMessage);
      this.emit(RoomEvent.ChatMessage, msg, participant);
    };
    this.handleMetrics = (metrics, participant) => {
      this.emit(RoomEvent.MetricsReceived, metrics, participant);
    };
    this.handleAudioPlaybackStarted = () => {
      if (this.canPlaybackAudio) {
        return;
      }
      this.audioEnabled = true;
      this.emit(RoomEvent.AudioPlaybackStatusChanged, true);
    };
    this.handleAudioPlaybackFailed = (e2) => {
      this.log.warn("could not playback audio", Object.assign(Object.assign({}, this.logContext), {
        error: e2
      }));
      if (!this.canPlaybackAudio) {
        return;
      }
      this.audioEnabled = false;
      this.emit(RoomEvent.AudioPlaybackStatusChanged, false);
    };
    this.handleVideoPlaybackStarted = () => {
      if (this.isVideoPlaybackBlocked) {
        this.isVideoPlaybackBlocked = false;
        this.emit(RoomEvent.VideoPlaybackStatusChanged, true);
      }
    };
    this.handleVideoPlaybackFailed = () => {
      if (!this.isVideoPlaybackBlocked) {
        this.isVideoPlaybackBlocked = true;
        this.emit(RoomEvent.VideoPlaybackStatusChanged, false);
      }
    };
    this.handleDeviceChange = () => __awaiter(this, void 0, void 0, function* () {
      var _a2, _b2;
      const previousDevices = DeviceManager.getInstance().previousDevices;
      const availableDevices = yield DeviceManager.getInstance().getDevices(void 0, false);
      const browser = getBrowser();
      if ((browser === null || browser === void 0 ? void 0 : browser.name) === "Chrome" && browser.os !== "iOS") {
        for (let availableDevice of availableDevices) {
          const previousDevice = previousDevices.find((info) => info.deviceId === availableDevice.deviceId);
          if (previousDevice && previousDevice.label !== "" && previousDevice.kind === availableDevice.kind && previousDevice.label !== availableDevice.label) {
            if (this.getActiveDevice(availableDevice.kind) === "default") {
              this.emit(RoomEvent.ActiveDeviceChanged, availableDevice.kind, availableDevice.deviceId);
            }
          }
        }
      }
      const kinds = ["audiooutput", "audioinput", "videoinput"];
      for (let kind of kinds) {
        const devicesOfKind = availableDevices.filter((d) => d.kind === kind);
        const activeDevice = this.getActiveDevice(kind);
        if (activeDevice === ((_a2 = previousDevices.filter((info) => info.kind === kind)[0]) === null || _a2 === void 0 ? void 0 : _a2.deviceId)) {
          if (devicesOfKind.length > 0 && ((_b2 = devicesOfKind[0]) === null || _b2 === void 0 ? void 0 : _b2.deviceId) !== activeDevice) {
            yield this.switchActiveDevice(kind, devicesOfKind[0].deviceId);
            continue;
          }
        }
        if (kind === "audioinput" && !isSafari() || kind === "videoinput") {
          continue;
        }
        if (devicesOfKind.length > 0 && !devicesOfKind.find((deviceInfo) => deviceInfo.deviceId === this.getActiveDevice(kind))) {
          yield this.switchActiveDevice(kind, devicesOfKind[0].deviceId);
        }
      }
      this.emit(RoomEvent.MediaDevicesChanged);
    });
    this.handleRoomUpdate = (room) => {
      const oldRoom = this.roomInfo;
      this.roomInfo = room;
      if (oldRoom && oldRoom.metadata !== room.metadata) {
        this.emitWhenConnected(RoomEvent.RoomMetadataChanged, room.metadata);
      }
      if ((oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.activeRecording) !== room.activeRecording) {
        this.emitWhenConnected(RoomEvent.RecordingStatusChanged, room.activeRecording);
      }
    };
    this.handleConnectionQualityUpdate = (update) => {
      update.updates.forEach((info) => {
        if (info.participantSid === this.localParticipant.sid) {
          this.localParticipant.setConnectionQuality(info.quality);
          return;
        }
        const participant = this.getRemoteParticipantBySid(info.participantSid);
        if (participant) {
          participant.setConnectionQuality(info.quality);
        }
      });
    };
    this.onLocalParticipantMetadataChanged = (metadata) => {
      this.emit(RoomEvent.ParticipantMetadataChanged, metadata, this.localParticipant);
    };
    this.onLocalParticipantNameChanged = (name) => {
      this.emit(RoomEvent.ParticipantNameChanged, name, this.localParticipant);
    };
    this.onLocalAttributesChanged = (changedAttributes) => {
      this.emit(RoomEvent.ParticipantAttributesChanged, changedAttributes, this.localParticipant);
    };
    this.onLocalTrackMuted = (pub) => {
      this.emit(RoomEvent.TrackMuted, pub, this.localParticipant);
    };
    this.onLocalTrackUnmuted = (pub) => {
      this.emit(RoomEvent.TrackUnmuted, pub, this.localParticipant);
    };
    this.onTrackProcessorUpdate = (processor) => {
      var _a2;
      (_a2 = processor === null || processor === void 0 ? void 0 : processor.onPublish) === null || _a2 === void 0 ? void 0 : _a2.call(processor, this);
    };
    this.onLocalTrackPublished = (pub) => __awaiter(this, void 0, void 0, function* () {
      var _a2, _b2, _c2, _d, _e, _f;
      (_a2 = pub.track) === null || _a2 === void 0 ? void 0 : _a2.on(TrackEvent.TrackProcessorUpdate, this.onTrackProcessorUpdate);
      (_b2 = pub.track) === null || _b2 === void 0 ? void 0 : _b2.on(TrackEvent.Restarted, this.onLocalTrackRestarted);
      (_e = (_d = (_c2 = pub.track) === null || _c2 === void 0 ? void 0 : _c2.getProcessor()) === null || _d === void 0 ? void 0 : _d.onPublish) === null || _e === void 0 ? void 0 : _e.call(_d, this);
      this.emit(RoomEvent.LocalTrackPublished, pub, this.localParticipant);
      if (isLocalAudioTrack(pub.track)) {
        const trackIsSilent = yield pub.track.checkForSilence();
        if (trackIsSilent) {
          this.emit(RoomEvent.LocalAudioSilenceDetected, pub);
        }
      }
      const deviceId = yield (_f = pub.track) === null || _f === void 0 ? void 0 : _f.getDeviceId(false);
      const deviceKind = sourceToKind(pub.source);
      if (deviceKind && deviceId && deviceId !== this.localParticipant.activeDeviceMap.get(deviceKind)) {
        this.localParticipant.activeDeviceMap.set(deviceKind, deviceId);
        this.emit(RoomEvent.ActiveDeviceChanged, deviceKind, deviceId);
      }
    });
    this.onLocalTrackUnpublished = (pub) => {
      var _a2, _b2;
      (_a2 = pub.track) === null || _a2 === void 0 ? void 0 : _a2.off(TrackEvent.TrackProcessorUpdate, this.onTrackProcessorUpdate);
      (_b2 = pub.track) === null || _b2 === void 0 ? void 0 : _b2.off(TrackEvent.Restarted, this.onLocalTrackRestarted);
      this.emit(RoomEvent.LocalTrackUnpublished, pub, this.localParticipant);
    };
    this.onLocalTrackRestarted = (track) => __awaiter(this, void 0, void 0, function* () {
      const deviceId = yield track.getDeviceId(false);
      const deviceKind = sourceToKind(track.source);
      if (deviceKind && deviceId && deviceId !== this.localParticipant.activeDeviceMap.get(deviceKind)) {
        this.log.debug("local track restarted, setting ".concat(deviceKind, " ").concat(deviceId, " active"), this.logContext);
        this.localParticipant.activeDeviceMap.set(deviceKind, deviceId);
        this.emit(RoomEvent.ActiveDeviceChanged, deviceKind, deviceId);
      }
    });
    this.onLocalConnectionQualityChanged = (quality) => {
      this.emit(RoomEvent.ConnectionQualityChanged, quality, this.localParticipant);
    };
    this.onMediaDevicesError = (e2) => {
      this.emit(RoomEvent.MediaDevicesError, e2);
    };
    this.onLocalParticipantPermissionsChanged = (prevPermissions) => {
      this.emit(RoomEvent.ParticipantPermissionsChanged, prevPermissions, this.localParticipant);
    };
    this.onLocalChatMessageSent = (msg) => {
      this.emit(RoomEvent.ChatMessage, msg, this.localParticipant);
    };
    this.setMaxListeners(100);
    this.remoteParticipants = /* @__PURE__ */ new Map();
    this.sidToIdentity = /* @__PURE__ */ new Map();
    this.options = Object.assign(Object.assign({}, roomOptionDefaults), options);
    this.log = getLogger((_a = this.options.loggerName) !== null && _a !== void 0 ? _a : LoggerNames.Room);
    this.transcriptionReceivedTimes = /* @__PURE__ */ new Map();
    this.options.audioCaptureDefaults = Object.assign(Object.assign({}, audioDefaults), options === null || options === void 0 ? void 0 : options.audioCaptureDefaults);
    this.options.videoCaptureDefaults = Object.assign(Object.assign({}, videoDefaults), options === null || options === void 0 ? void 0 : options.videoCaptureDefaults);
    this.options.publishDefaults = Object.assign(Object.assign({}, publishDefaults), options === null || options === void 0 ? void 0 : options.publishDefaults);
    this.maybeCreateEngine();
    this.disconnectLock = new _();
    this.localParticipant = new LocalParticipant("", "", this.engine, this.options, this.rpcHandlers);
    if (this.options.videoCaptureDefaults.deviceId) {
      this.localParticipant.activeDeviceMap.set("videoinput", unwrapConstraint(this.options.videoCaptureDefaults.deviceId));
    }
    if (this.options.audioCaptureDefaults.deviceId) {
      this.localParticipant.activeDeviceMap.set("audioinput", unwrapConstraint(this.options.audioCaptureDefaults.deviceId));
    }
    if ((_b = this.options.audioOutput) === null || _b === void 0 ? void 0 : _b.deviceId) {
      this.switchActiveDevice("audiooutput", unwrapConstraint(this.options.audioOutput.deviceId)).catch((e2) => this.log.warn("Could not set audio output: ".concat(e2.message), this.logContext));
    }
    if (this.options.e2ee) {
      this.setupE2EE();
    }
    if (isWeb()) {
      const abortController = new AbortController();
      (_c = navigator.mediaDevices) === null || _c === void 0 ? void 0 : _c.addEventListener("devicechange", this.handleDeviceChange, {
        signal: abortController.signal
      });
      if (_Room.cleanupRegistry) {
        _Room.cleanupRegistry.register(this, () => {
          abortController.abort();
        });
      }
    }
  }
  registerTextStreamHandler(topic, callback) {
    if (this.textStreamHandlers.has(topic)) {
      throw new TypeError('A text stream handler for topic "'.concat(topic, '" has already been set.'));
    }
    this.textStreamHandlers.set(topic, callback);
  }
  unregisterTextStreamHandler(topic) {
    this.textStreamHandlers.delete(topic);
  }
  registerByteStreamHandler(topic, callback) {
    if (this.byteStreamHandlers.has(topic)) {
      throw new TypeError('A byte stream handler for topic "'.concat(topic, '" has already been set.'));
    }
    this.byteStreamHandlers.set(topic, callback);
  }
  unregisterByteStreamHandler(topic) {
    this.byteStreamHandlers.delete(topic);
  }
  /**
   * Establishes the participant as a receiver for calls of the specified RPC method.
   * Will overwrite any existing callback for the same method.
   *
   * @param method - The name of the indicated RPC method
   * @param handler - Will be invoked when an RPC request for this method is received
   * @returns A promise that resolves when the method is successfully registered
   * @throws {Error} if the handler for a specific method has already been registered already
   *
   * @example
   * ```typescript
   * room.localParticipant?.registerRpcMethod(
   *   'greet',
   *   async (data: RpcInvocationData) => {
   *     console.log(`Received greeting from ${data.callerIdentity}: ${data.payload}`);
   *     return `Hello, ${data.callerIdentity}!`;
   *   }
   * );
   * ```
   *
   * The handler should return a Promise that resolves to a string.
   * If unable to respond within `responseTimeout`, the request will result in an error on the caller's side.
   *
   * You may throw errors of type `RpcError` with a string `message` in the handler,
   * and they will be received on the caller's side with the message intact.
   * Other errors thrown in your handler will not be transmitted as-is, and will instead arrive to the caller as `1500` ("Application Error").
   */
  registerRpcMethod(method, handler) {
    if (this.rpcHandlers.has(method)) {
      throw Error("RPC handler already registered for method ".concat(method, ", unregisterRpcMethod before trying to register again"));
    }
    this.rpcHandlers.set(method, handler);
  }
  /**
   * Unregisters a previously registered RPC method.
   *
   * @param method - The name of the RPC method to unregister
   */
  unregisterRpcMethod(method) {
    this.rpcHandlers.delete(method);
  }
  handleIncomingRpcRequest(callerIdentity, requestId, method, payload, responseTimeout, version2) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.engine.publishRpcAck(callerIdentity, requestId);
      if (version2 !== 1) {
        yield this.engine.publishRpcResponse(callerIdentity, requestId, null, RpcError.builtIn("UNSUPPORTED_VERSION"));
        return;
      }
      const handler = this.rpcHandlers.get(method);
      if (!handler) {
        yield this.engine.publishRpcResponse(callerIdentity, requestId, null, RpcError.builtIn("UNSUPPORTED_METHOD"));
        return;
      }
      let responseError = null;
      let responsePayload = null;
      try {
        const response = yield handler({
          requestId,
          callerIdentity,
          payload,
          responseTimeout
        });
        if (byteLength(response) > MAX_PAYLOAD_BYTES) {
          responseError = RpcError.builtIn("RESPONSE_PAYLOAD_TOO_LARGE");
          console.warn("RPC Response payload too large for ".concat(method));
        } else {
          responsePayload = response;
        }
      } catch (error) {
        if (error instanceof RpcError) {
          responseError = error;
        } else {
          console.warn("Uncaught error returned by RPC handler for ".concat(method, ". Returning APPLICATION_ERROR instead."), error);
          responseError = RpcError.builtIn("APPLICATION_ERROR");
        }
      }
      yield this.engine.publishRpcResponse(callerIdentity, requestId, responsePayload, responseError);
    });
  }
  /**
   * @experimental
   */
  setE2EEEnabled(enabled) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.e2eeManager) {
        yield Promise.all([this.localParticipant.setE2EEEnabled(enabled)]);
        if (this.localParticipant.identity !== "") {
          this.e2eeManager.setParticipantCryptorEnabled(enabled, this.localParticipant.identity);
        }
      } else {
        throw Error("e2ee not configured, please set e2ee settings within the room options");
      }
    });
  }
  setupE2EE() {
    var _a;
    if (this.options.e2ee) {
      if ("e2eeManager" in this.options.e2ee) {
        this.e2eeManager = this.options.e2ee.e2eeManager;
      } else {
        this.e2eeManager = new E2EEManager(this.options.e2ee);
      }
      this.e2eeManager.on(EncryptionEvent.ParticipantEncryptionStatusChanged, (enabled, participant) => {
        if (isLocalParticipant(participant)) {
          this.isE2EEEnabled = enabled;
        }
        this.emit(RoomEvent.ParticipantEncryptionStatusChanged, enabled, participant);
      });
      this.e2eeManager.on(EncryptionEvent.EncryptionError, (error) => this.emit(RoomEvent.EncryptionError, error));
      (_a = this.e2eeManager) === null || _a === void 0 ? void 0 : _a.setup(this);
    }
  }
  get logContext() {
    var _a;
    return {
      room: this.name,
      roomID: (_a = this.roomInfo) === null || _a === void 0 ? void 0 : _a.sid,
      participant: this.localParticipant.identity,
      pID: this.localParticipant.sid
    };
  }
  /**
   * if the current room has a participant with `recorder: true` in its JWT grant
   **/
  get isRecording() {
    var _a, _b;
    return (_b = (_a = this.roomInfo) === null || _a === void 0 ? void 0 : _a.activeRecording) !== null && _b !== void 0 ? _b : false;
  }
  /**
   * server assigned unique room id.
   * returns once a sid has been issued by the server.
   */
  getSid() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.state === ConnectionState.Disconnected) {
        return "";
      }
      if (this.roomInfo && this.roomInfo.sid !== "") {
        return this.roomInfo.sid;
      }
      return new Promise((resolve, reject) => {
        const handleRoomUpdate = (roomInfo) => {
          if (roomInfo.sid !== "") {
            this.engine.off(EngineEvent.RoomUpdate, handleRoomUpdate);
            resolve(roomInfo.sid);
          }
        };
        this.engine.on(EngineEvent.RoomUpdate, handleRoomUpdate);
        this.once(RoomEvent.Disconnected, () => {
          this.engine.off(EngineEvent.RoomUpdate, handleRoomUpdate);
          reject("Room disconnected before room server id was available");
        });
      });
    });
  }
  /** user assigned name, derived from JWT token */
  get name() {
    var _a, _b;
    return (_b = (_a = this.roomInfo) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "";
  }
  /** room metadata */
  get metadata() {
    var _a;
    return (_a = this.roomInfo) === null || _a === void 0 ? void 0 : _a.metadata;
  }
  get numParticipants() {
    var _a, _b;
    return (_b = (_a = this.roomInfo) === null || _a === void 0 ? void 0 : _a.numParticipants) !== null && _b !== void 0 ? _b : 0;
  }
  get numPublishers() {
    var _a, _b;
    return (_b = (_a = this.roomInfo) === null || _a === void 0 ? void 0 : _a.numPublishers) !== null && _b !== void 0 ? _b : 0;
  }
  maybeCreateEngine() {
    if (this.engine && !this.engine.isClosed) {
      return;
    }
    this.engine = new RTCEngine(this.options);
    this.engine.on(EngineEvent.ParticipantUpdate, this.handleParticipantUpdates).on(EngineEvent.RoomUpdate, this.handleRoomUpdate).on(EngineEvent.SpeakersChanged, this.handleSpeakersChanged).on(EngineEvent.StreamStateChanged, this.handleStreamStateUpdate).on(EngineEvent.ConnectionQualityUpdate, this.handleConnectionQualityUpdate).on(EngineEvent.SubscriptionError, this.handleSubscriptionError).on(EngineEvent.SubscriptionPermissionUpdate, this.handleSubscriptionPermissionUpdate).on(EngineEvent.MediaTrackAdded, (mediaTrack, stream, receiver) => {
      this.onTrackAdded(mediaTrack, stream, receiver);
    }).on(EngineEvent.Disconnected, (reason) => {
      this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, reason);
    }).on(EngineEvent.ActiveSpeakersUpdate, this.handleActiveSpeakersUpdate).on(EngineEvent.DataPacketReceived, this.handleDataPacket).on(EngineEvent.Resuming, () => {
      this.clearConnectionReconcile();
      this.isResuming = true;
      this.log.info("Resuming signal connection", this.logContext);
      if (this.setAndEmitConnectionState(ConnectionState.SignalReconnecting)) {
        this.emit(RoomEvent.SignalReconnecting);
      }
    }).on(EngineEvent.Resumed, () => {
      this.registerConnectionReconcile();
      this.isResuming = false;
      this.log.info("Resumed signal connection", this.logContext);
      this.updateSubscriptions();
      this.emitBufferedEvents();
      if (this.setAndEmitConnectionState(ConnectionState.Connected)) {
        this.emit(RoomEvent.Reconnected);
      }
    }).on(EngineEvent.SignalResumed, () => {
      this.bufferedEvents = [];
      if (this.state === ConnectionState.Reconnecting || this.isResuming) {
        this.sendSyncState();
      }
    }).on(EngineEvent.Restarting, this.handleRestarting).on(EngineEvent.SignalRestarted, this.handleSignalRestarted).on(EngineEvent.Offline, () => {
      if (this.setAndEmitConnectionState(ConnectionState.Reconnecting)) {
        this.emit(RoomEvent.Reconnecting);
      }
    }).on(EngineEvent.DCBufferStatusChanged, (status, kind) => {
      this.emit(RoomEvent.DCBufferStatusChanged, status, kind);
    }).on(EngineEvent.LocalTrackSubscribed, (subscribedSid) => {
      const trackPublication = this.localParticipant.getTrackPublications().find((_ref2) => {
        let {
          trackSid
        } = _ref2;
        return trackSid === subscribedSid;
      });
      if (!trackPublication) {
        this.log.warn("could not find local track subscription for subscribed event", this.logContext);
        return;
      }
      this.localParticipant.emit(ParticipantEvent.LocalTrackSubscribed, trackPublication);
      this.emitWhenConnected(RoomEvent.LocalTrackSubscribed, trackPublication, this.localParticipant);
    });
    if (this.localParticipant) {
      this.localParticipant.setupEngine(this.engine);
    }
    if (this.e2eeManager) {
      this.e2eeManager.setupEngine(this.engine);
    }
  }
  /**
   * getLocalDevices abstracts navigator.mediaDevices.enumerateDevices.
   * In particular, it requests device permissions by default if needed
   * and makes sure the returned device does not consist of dummy devices
   * @param kind
   * @returns a list of available local devices
   */
  static getLocalDevices(kind) {
    let requestPermissions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return DeviceManager.getInstance().getDevices(kind, requestPermissions);
  }
  /**
   * prepareConnection should be called as soon as the page is loaded, in order
   * to speed up the connection attempt. This function will
   * - perform DNS resolution and pre-warm the DNS cache
   * - establish TLS connection and cache TLS keys
   *
   * With LiveKit Cloud, it will also determine the best edge data center for
   * the current client to connect to if a token is provided.
   */
  prepareConnection(url, token) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.state !== ConnectionState.Disconnected) {
        return;
      }
      this.log.debug("prepareConnection to ".concat(url), this.logContext);
      try {
        if (isCloud(new URL(url)) && token) {
          this.regionUrlProvider = new RegionUrlProvider(url, token);
          const regionUrl = yield this.regionUrlProvider.getNextBestRegionUrl();
          if (regionUrl && this.state === ConnectionState.Disconnected) {
            this.regionUrl = regionUrl;
            yield fetch(toHttpUrl(regionUrl), {
              method: "HEAD"
            });
            this.log.debug("prepared connection to ".concat(regionUrl), this.logContext);
          }
        } else {
          yield fetch(toHttpUrl(url), {
            method: "HEAD"
          });
        }
      } catch (e2) {
        this.log.warn("could not prepare connection", Object.assign(Object.assign({}, this.logContext), {
          error: e2
        }));
      }
    });
  }
  /**
   * retrieves a participant by identity
   * @param identity
   * @returns
   */
  getParticipantByIdentity(identity) {
    if (this.localParticipant.identity === identity) {
      return this.localParticipant;
    }
    return this.remoteParticipants.get(identity);
  }
  clearConnectionFutures() {
    this.connectFuture = void 0;
  }
  /**
   * @internal for testing
   */
  simulateScenario(scenario, arg) {
    return __awaiter(this, void 0, void 0, function* () {
      let postAction = () => {
      };
      let req;
      switch (scenario) {
        case "signal-reconnect":
          yield this.engine.client.handleOnClose("simulate disconnect");
          break;
        case "speaker":
          req = new SimulateScenario({
            scenario: {
              case: "speakerUpdate",
              value: 3
            }
          });
          break;
        case "node-failure":
          req = new SimulateScenario({
            scenario: {
              case: "nodeFailure",
              value: true
            }
          });
          break;
        case "server-leave":
          req = new SimulateScenario({
            scenario: {
              case: "serverLeave",
              value: true
            }
          });
          break;
        case "migration":
          req = new SimulateScenario({
            scenario: {
              case: "migration",
              value: true
            }
          });
          break;
        case "resume-reconnect":
          this.engine.failNext();
          yield this.engine.client.handleOnClose("simulate resume-disconnect");
          break;
        case "disconnect-signal-on-resume":
          postAction = () => __awaiter(this, void 0, void 0, function* () {
            yield this.engine.client.handleOnClose("simulate resume-disconnect");
          });
          req = new SimulateScenario({
            scenario: {
              case: "disconnectSignalOnResume",
              value: true
            }
          });
          break;
        case "disconnect-signal-on-resume-no-messages":
          postAction = () => __awaiter(this, void 0, void 0, function* () {
            yield this.engine.client.handleOnClose("simulate resume-disconnect");
          });
          req = new SimulateScenario({
            scenario: {
              case: "disconnectSignalOnResumeNoMessages",
              value: true
            }
          });
          break;
        case "full-reconnect":
          this.engine.fullReconnectOnNext = true;
          yield this.engine.client.handleOnClose("simulate full-reconnect");
          break;
        case "force-tcp":
        case "force-tls":
          req = new SimulateScenario({
            scenario: {
              case: "switchCandidateProtocol",
              value: scenario === "force-tls" ? 2 : 1
            }
          });
          postAction = () => __awaiter(this, void 0, void 0, function* () {
            const onLeave = this.engine.client.onLeave;
            if (onLeave) {
              onLeave(new LeaveRequest({
                reason: DisconnectReason.CLIENT_INITIATED,
                action: LeaveRequest_Action.RECONNECT
              }));
            }
          });
          break;
        case "subscriber-bandwidth":
          if (arg === void 0 || typeof arg !== "number") {
            throw new Error("subscriber-bandwidth requires a number as argument");
          }
          req = new SimulateScenario({
            scenario: {
              case: "subscriberBandwidth",
              value: numberToBigInt(arg)
            }
          });
          break;
        case "leave-full-reconnect":
          req = new SimulateScenario({
            scenario: {
              case: "leaveRequestFullReconnect",
              value: true
            }
          });
      }
      if (req) {
        yield this.engine.client.sendSimulateScenario(req);
        yield postAction();
      }
    });
  }
  /**
   * Returns true if audio playback is enabled
   */
  get canPlaybackAudio() {
    return this.audioEnabled;
  }
  /**
   * Returns true if video playback is enabled
   */
  get canPlaybackVideo() {
    return !this.isVideoPlaybackBlocked;
  }
  getActiveDevice(kind) {
    return this.localParticipant.activeDeviceMap.get(kind);
  }
  /**
   * Switches all active devices used in this room to the given device.
   *
   * Note: setting AudioOutput is not supported on some browsers. See [setSinkId](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId#browser_compatibility)
   *
   * @param kind use `videoinput` for camera track,
   *  `audioinput` for microphone track,
   *  `audiooutput` to set speaker for all incoming audio tracks
   * @param deviceId
   */
  switchActiveDevice(kind_1, deviceId_1) {
    return __awaiter(this, arguments, void 0, function(kind, deviceId) {
      var _this3 = this;
      let exact = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      return function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        var _h;
        let success = true;
        let needsUpdateWithoutTracks = false;
        const deviceConstraint = exact ? {
          exact: deviceId
        } : deviceId;
        if (kind === "audioinput") {
          needsUpdateWithoutTracks = _this3.localParticipant.audioTrackPublications.size === 0;
          const prevDeviceId = (_a = _this3.getActiveDevice(kind)) !== null && _a !== void 0 ? _a : _this3.options.audioCaptureDefaults.deviceId;
          _this3.options.audioCaptureDefaults.deviceId = deviceConstraint;
          const tracks = Array.from(_this3.localParticipant.audioTrackPublications.values()).filter((track) => track.source === Track.Source.Microphone);
          try {
            success = (yield Promise.all(tracks.map((t) => {
              var _a2;
              return (_a2 = t.audioTrack) === null || _a2 === void 0 ? void 0 : _a2.setDeviceId(deviceConstraint);
            }))).every((val) => val === true);
          } catch (e2) {
            _this3.options.audioCaptureDefaults.deviceId = prevDeviceId;
            throw e2;
          }
        } else if (kind === "videoinput") {
          needsUpdateWithoutTracks = _this3.localParticipant.videoTrackPublications.size === 0;
          const prevDeviceId = (_b = _this3.getActiveDevice(kind)) !== null && _b !== void 0 ? _b : _this3.options.videoCaptureDefaults.deviceId;
          _this3.options.videoCaptureDefaults.deviceId = deviceConstraint;
          const tracks = Array.from(_this3.localParticipant.videoTrackPublications.values()).filter((track) => track.source === Track.Source.Camera);
          try {
            success = (yield Promise.all(tracks.map((t) => {
              var _a2;
              return (_a2 = t.videoTrack) === null || _a2 === void 0 ? void 0 : _a2.setDeviceId(deviceConstraint);
            }))).every((val) => val === true);
          } catch (e2) {
            _this3.options.videoCaptureDefaults.deviceId = prevDeviceId;
            throw e2;
          }
        } else if (kind === "audiooutput") {
          if (!supportsSetSinkId() && !_this3.options.webAudioMix || _this3.options.webAudioMix && _this3.audioContext && !("setSinkId" in _this3.audioContext)) {
            throw new Error("cannot switch audio output, setSinkId not supported");
          }
          if (_this3.options.webAudioMix) {
            deviceId = (_c = yield DeviceManager.getInstance().normalizeDeviceId("audiooutput", deviceId)) !== null && _c !== void 0 ? _c : "";
          }
          (_d = (_h = _this3.options).audioOutput) !== null && _d !== void 0 ? _d : _h.audioOutput = {};
          const prevDeviceId = (_e = _this3.getActiveDevice(kind)) !== null && _e !== void 0 ? _e : _this3.options.audioOutput.deviceId;
          _this3.options.audioOutput.deviceId = deviceId;
          try {
            if (_this3.options.webAudioMix) {
              (_f = _this3.audioContext) === null || _f === void 0 ? void 0 : _f.setSinkId(deviceId);
            }
            yield Promise.all(Array.from(_this3.remoteParticipants.values()).map((p) => p.setAudioOutput({
              deviceId
            })));
          } catch (e2) {
            _this3.options.audioOutput.deviceId = prevDeviceId;
            throw e2;
          }
        }
        if (needsUpdateWithoutTracks || kind === "audiooutput") {
          _this3.localParticipant.activeDeviceMap.set(kind, kind === "audiooutput" && ((_g = _this3.options.audioOutput) === null || _g === void 0 ? void 0 : _g.deviceId) || deviceId);
          _this3.emit(RoomEvent.ActiveDeviceChanged, kind, deviceId);
        }
        return success;
      }();
    });
  }
  setupLocalParticipantEvents() {
    this.localParticipant.on(ParticipantEvent.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).on(ParticipantEvent.ParticipantNameChanged, this.onLocalParticipantNameChanged).on(ParticipantEvent.AttributesChanged, this.onLocalAttributesChanged).on(ParticipantEvent.TrackMuted, this.onLocalTrackMuted).on(ParticipantEvent.TrackUnmuted, this.onLocalTrackUnmuted).on(ParticipantEvent.LocalTrackPublished, this.onLocalTrackPublished).on(ParticipantEvent.LocalTrackUnpublished, this.onLocalTrackUnpublished).on(ParticipantEvent.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).on(ParticipantEvent.MediaDevicesError, this.onMediaDevicesError).on(ParticipantEvent.AudioStreamAcquired, this.startAudio).on(ParticipantEvent.ChatMessage, this.onLocalChatMessageSent).on(ParticipantEvent.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged);
  }
  recreateEngine() {
    var _a;
    (_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
    this.engine = void 0;
    this.isResuming = false;
    this.remoteParticipants.clear();
    this.sidToIdentity.clear();
    this.bufferedEvents = [];
    this.maybeCreateEngine();
  }
  onTrackAdded(mediaTrack, stream, receiver) {
    if (this.state === ConnectionState.Connecting || this.state === ConnectionState.Reconnecting) {
      const reconnectedHandler = () => {
        this.onTrackAdded(mediaTrack, stream, receiver);
        cleanup();
      };
      const cleanup = () => {
        this.off(RoomEvent.Reconnected, reconnectedHandler);
        this.off(RoomEvent.Connected, reconnectedHandler);
        this.off(RoomEvent.Disconnected, cleanup);
      };
      this.once(RoomEvent.Reconnected, reconnectedHandler);
      this.once(RoomEvent.Connected, reconnectedHandler);
      this.once(RoomEvent.Disconnected, cleanup);
      return;
    }
    if (this.state === ConnectionState.Disconnected) {
      this.log.warn("skipping incoming track after Room disconnected", this.logContext);
      return;
    }
    const parts = unpackStreamId(stream.id);
    const participantSid = parts[0];
    let streamId = parts[1];
    let trackId = mediaTrack.id;
    if (streamId && streamId.startsWith("TR"))
      trackId = streamId;
    if (participantSid === this.localParticipant.sid) {
      this.log.warn("tried to create RemoteParticipant for local participant", this.logContext);
      return;
    }
    const participant = Array.from(this.remoteParticipants.values()).find((p) => p.sid === participantSid);
    if (!participant) {
      this.log.error("Tried to add a track for a participant, that's not present. Sid: ".concat(participantSid), this.logContext);
      return;
    }
    let adaptiveStreamSettings;
    if (this.options.adaptiveStream) {
      if (typeof this.options.adaptiveStream === "object") {
        adaptiveStreamSettings = this.options.adaptiveStream;
      } else {
        adaptiveStreamSettings = {};
      }
    }
    participant.addSubscribedMediaTrack(mediaTrack, trackId, stream, receiver, adaptiveStreamSettings);
  }
  handleDisconnect() {
    let shouldStopTracks = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    let reason = arguments.length > 1 ? arguments[1] : void 0;
    var _a;
    this.clearConnectionReconcile();
    this.isResuming = false;
    this.bufferedEvents = [];
    this.transcriptionReceivedTimes.clear();
    if (this.state === ConnectionState.Disconnected) {
      return;
    }
    this.regionUrl = void 0;
    try {
      this.remoteParticipants.forEach((p) => {
        p.trackPublications.forEach((pub) => {
          p.unpublishTrack(pub.trackSid);
        });
      });
      this.localParticipant.trackPublications.forEach((pub) => {
        var _a2, _b, _c;
        if (pub.track) {
          this.localParticipant.unpublishTrack(pub.track, shouldStopTracks);
        }
        if (shouldStopTracks) {
          (_a2 = pub.track) === null || _a2 === void 0 ? void 0 : _a2.detach();
          (_b = pub.track) === null || _b === void 0 ? void 0 : _b.stop();
        } else {
          (_c = pub.track) === null || _c === void 0 ? void 0 : _c.stopMonitor();
        }
      });
      this.localParticipant.off(ParticipantEvent.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).off(ParticipantEvent.ParticipantNameChanged, this.onLocalParticipantNameChanged).off(ParticipantEvent.AttributesChanged, this.onLocalAttributesChanged).off(ParticipantEvent.TrackMuted, this.onLocalTrackMuted).off(ParticipantEvent.TrackUnmuted, this.onLocalTrackUnmuted).off(ParticipantEvent.LocalTrackPublished, this.onLocalTrackPublished).off(ParticipantEvent.LocalTrackUnpublished, this.onLocalTrackUnpublished).off(ParticipantEvent.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).off(ParticipantEvent.MediaDevicesError, this.onMediaDevicesError).off(ParticipantEvent.AudioStreamAcquired, this.startAudio).off(ParticipantEvent.ChatMessage, this.onLocalChatMessageSent).off(ParticipantEvent.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged);
      this.localParticipant.trackPublications.clear();
      this.localParticipant.videoTrackPublications.clear();
      this.localParticipant.audioTrackPublications.clear();
      this.remoteParticipants.clear();
      this.sidToIdentity.clear();
      this.activeSpeakers = [];
      if (this.audioContext && typeof this.options.webAudioMix === "boolean") {
        this.audioContext.close();
        this.audioContext = void 0;
      }
      if (isWeb()) {
        window.removeEventListener("beforeunload", this.onPageLeave);
        window.removeEventListener("pagehide", this.onPageLeave);
        window.removeEventListener("freeze", this.onPageLeave);
        (_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.removeEventListener("devicechange", this.handleDeviceChange);
      }
    } finally {
      this.setAndEmitConnectionState(ConnectionState.Disconnected);
      this.emit(RoomEvent.Disconnected, reason);
    }
  }
  handleParticipantDisconnected(identity, participant) {
    var _a;
    this.remoteParticipants.delete(identity);
    if (!participant) {
      return;
    }
    participant.trackPublications.forEach((publication) => {
      participant.unpublishTrack(publication.trackSid, true);
    });
    this.emit(RoomEvent.ParticipantDisconnected, participant);
    (_a = this.localParticipant) === null || _a === void 0 ? void 0 : _a.handleParticipantDisconnected(participant.identity);
  }
  handleStreamHeader(streamHeader, participantIdentity) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (streamHeader.contentHeader.case === "byteHeader") {
        const streamHandlerCallback = this.byteStreamHandlers.get(streamHeader.topic);
        if (!streamHandlerCallback) {
          this.log.debug("ignoring incoming byte stream due to no handler for topic", streamHeader.topic);
          return;
        }
        let streamController;
        const info = {
          id: streamHeader.streamId,
          name: (_a = streamHeader.contentHeader.value.name) !== null && _a !== void 0 ? _a : "unknown",
          mimeType: streamHeader.mimeType,
          size: streamHeader.totalLength ? Number(streamHeader.totalLength) : void 0,
          topic: streamHeader.topic,
          timestamp: bigIntToNumber(streamHeader.timestamp),
          attributes: streamHeader.attributes
        };
        const stream = new ReadableStream({
          start: (controller) => {
            streamController = controller;
            this.byteStreamControllers.set(streamHeader.streamId, {
              info,
              controller: streamController,
              startTime: Date.now()
            });
          }
        });
        streamHandlerCallback(new ByteStreamReader(info, stream, bigIntToNumber(streamHeader.totalLength)), {
          identity: participantIdentity
        });
      } else if (streamHeader.contentHeader.case === "textHeader") {
        const streamHandlerCallback = this.textStreamHandlers.get(streamHeader.topic);
        if (!streamHandlerCallback) {
          this.log.debug("ignoring incoming text stream due to no handler for topic", streamHeader.topic);
          return;
        }
        let streamController;
        const info = {
          id: streamHeader.streamId,
          mimeType: streamHeader.mimeType,
          size: streamHeader.totalLength ? Number(streamHeader.totalLength) : void 0,
          topic: streamHeader.topic,
          timestamp: Number(streamHeader.timestamp),
          attributes: streamHeader.attributes
        };
        const stream = new ReadableStream({
          start: (controller) => {
            streamController = controller;
            this.textStreamControllers.set(streamHeader.streamId, {
              info,
              controller: streamController,
              startTime: Date.now()
            });
          }
        });
        streamHandlerCallback(new TextStreamReader(info, stream, bigIntToNumber(streamHeader.totalLength)), {
          identity: participantIdentity
        });
      }
    });
  }
  handleStreamChunk(chunk) {
    const fileBuffer = this.byteStreamControllers.get(chunk.streamId);
    if (fileBuffer) {
      if (chunk.content.length > 0) {
        fileBuffer.controller.enqueue(chunk);
      }
    }
    const textBuffer = this.textStreamControllers.get(chunk.streamId);
    if (textBuffer) {
      if (chunk.content.length > 0) {
        textBuffer.controller.enqueue(chunk);
      }
    }
  }
  handleStreamTrailer(trailer) {
    const textBuffer = this.textStreamControllers.get(trailer.streamId);
    if (textBuffer) {
      textBuffer.info.attributes = Object.assign(Object.assign({}, textBuffer.info.attributes), trailer.attributes);
      textBuffer.controller.close();
      this.byteStreamControllers.delete(trailer.streamId);
    }
    const fileBuffer = this.byteStreamControllers.get(trailer.streamId);
    if (fileBuffer) {
      {
        fileBuffer.info.attributes = Object.assign(Object.assign({}, fileBuffer.info.attributes), trailer.attributes);
        fileBuffer.controller.close();
        this.byteStreamControllers.delete(trailer.streamId);
      }
    }
  }
  acquireAudioContext() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      if (typeof this.options.webAudioMix !== "boolean" && this.options.webAudioMix.audioContext) {
        this.audioContext = this.options.webAudioMix.audioContext;
      } else if (!this.audioContext || this.audioContext.state === "closed") {
        this.audioContext = (_a = getNewAudioContext()) !== null && _a !== void 0 ? _a : void 0;
      }
      if (this.options.webAudioMix) {
        this.remoteParticipants.forEach((participant) => participant.setAudioContext(this.audioContext));
      }
      this.localParticipant.setAudioContext(this.audioContext);
      if (this.audioContext && this.audioContext.state === "suspended") {
        try {
          yield Promise.race([this.audioContext.resume(), sleep(200)]);
        } catch (e2) {
          this.log.warn("Could not resume audio context", Object.assign(Object.assign({}, this.logContext), {
            error: e2
          }));
        }
      }
      const newContextIsRunning = ((_b = this.audioContext) === null || _b === void 0 ? void 0 : _b.state) === "running";
      if (newContextIsRunning !== this.canPlaybackAudio) {
        this.audioEnabled = newContextIsRunning;
        this.emit(RoomEvent.AudioPlaybackStatusChanged, newContextIsRunning);
      }
    });
  }
  createParticipant(identity, info) {
    var _a;
    let participant;
    if (info) {
      participant = RemoteParticipant.fromParticipantInfo(this.engine.client, info, {
        loggerContextCb: () => this.logContext,
        loggerName: this.options.loggerName
      });
    } else {
      participant = new RemoteParticipant(this.engine.client, "", identity, void 0, void 0, void 0, {
        loggerContextCb: () => this.logContext,
        loggerName: this.options.loggerName
      });
    }
    if (this.options.webAudioMix) {
      participant.setAudioContext(this.audioContext);
    }
    if ((_a = this.options.audioOutput) === null || _a === void 0 ? void 0 : _a.deviceId) {
      participant.setAudioOutput(this.options.audioOutput).catch((e2) => this.log.warn("Could not set audio output: ".concat(e2.message), this.logContext));
    }
    return participant;
  }
  getOrCreateParticipant(identity, info) {
    if (this.remoteParticipants.has(identity)) {
      const existingParticipant = this.remoteParticipants.get(identity);
      if (info) {
        const wasUpdated = existingParticipant.updateInfo(info);
        if (wasUpdated) {
          this.sidToIdentity.set(info.sid, info.identity);
        }
      }
      return existingParticipant;
    }
    const participant = this.createParticipant(identity, info);
    this.remoteParticipants.set(identity, participant);
    this.sidToIdentity.set(info.sid, info.identity);
    this.emitWhenConnected(RoomEvent.ParticipantConnected, participant);
    participant.on(ParticipantEvent.TrackPublished, (trackPublication) => {
      this.emitWhenConnected(RoomEvent.TrackPublished, trackPublication, participant);
    }).on(ParticipantEvent.TrackSubscribed, (track, publication) => {
      if (track.kind === Track.Kind.Audio) {
        track.on(TrackEvent.AudioPlaybackStarted, this.handleAudioPlaybackStarted);
        track.on(TrackEvent.AudioPlaybackFailed, this.handleAudioPlaybackFailed);
      } else if (track.kind === Track.Kind.Video) {
        track.on(TrackEvent.VideoPlaybackFailed, this.handleVideoPlaybackFailed);
        track.on(TrackEvent.VideoPlaybackStarted, this.handleVideoPlaybackStarted);
      }
      this.emit(RoomEvent.TrackSubscribed, track, publication, participant);
    }).on(ParticipantEvent.TrackUnpublished, (publication) => {
      this.emit(RoomEvent.TrackUnpublished, publication, participant);
    }).on(ParticipantEvent.TrackUnsubscribed, (track, publication) => {
      this.emit(RoomEvent.TrackUnsubscribed, track, publication, participant);
    }).on(ParticipantEvent.TrackMuted, (pub) => {
      this.emitWhenConnected(RoomEvent.TrackMuted, pub, participant);
    }).on(ParticipantEvent.TrackUnmuted, (pub) => {
      this.emitWhenConnected(RoomEvent.TrackUnmuted, pub, participant);
    }).on(ParticipantEvent.ParticipantMetadataChanged, (metadata) => {
      this.emitWhenConnected(RoomEvent.ParticipantMetadataChanged, metadata, participant);
    }).on(ParticipantEvent.ParticipantNameChanged, (name) => {
      this.emitWhenConnected(RoomEvent.ParticipantNameChanged, name, participant);
    }).on(ParticipantEvent.AttributesChanged, (changedAttributes) => {
      this.emitWhenConnected(RoomEvent.ParticipantAttributesChanged, changedAttributes, participant);
    }).on(ParticipantEvent.ConnectionQualityChanged, (quality) => {
      this.emitWhenConnected(RoomEvent.ConnectionQualityChanged, quality, participant);
    }).on(ParticipantEvent.ParticipantPermissionsChanged, (prevPermissions) => {
      this.emitWhenConnected(RoomEvent.ParticipantPermissionsChanged, prevPermissions, participant);
    }).on(ParticipantEvent.TrackSubscriptionStatusChanged, (pub, status) => {
      this.emitWhenConnected(RoomEvent.TrackSubscriptionStatusChanged, pub, status, participant);
    }).on(ParticipantEvent.TrackSubscriptionFailed, (trackSid, error) => {
      this.emit(RoomEvent.TrackSubscriptionFailed, trackSid, participant, error);
    }).on(ParticipantEvent.TrackSubscriptionPermissionChanged, (pub, status) => {
      this.emitWhenConnected(RoomEvent.TrackSubscriptionPermissionChanged, pub, status, participant);
    });
    if (info) {
      participant.updateInfo(info);
    }
    return participant;
  }
  sendSyncState() {
    const remoteTracks = Array.from(this.remoteParticipants.values()).reduce((acc, participant) => {
      acc.push(...participant.getTrackPublications());
      return acc;
    }, []);
    const localTracks = this.localParticipant.getTrackPublications();
    this.engine.sendSyncState(remoteTracks, localTracks);
  }
  /**
   * After resuming, we'll need to notify the server of the current
   * subscription settings.
   */
  updateSubscriptions() {
    for (const p of this.remoteParticipants.values()) {
      for (const pub of p.videoTrackPublications.values()) {
        if (pub.isSubscribed && isRemotePub(pub)) {
          pub.emitTrackUpdate();
        }
      }
    }
  }
  getRemoteParticipantBySid(sid) {
    const identity = this.sidToIdentity.get(sid);
    if (identity) {
      return this.remoteParticipants.get(identity);
    }
  }
  registerConnectionReconcile() {
    this.clearConnectionReconcile();
    let consecutiveFailures = 0;
    this.connectionReconcileInterval = CriticalTimers.setInterval(() => {
      if (
        // ensure we didn't tear it down
        !this.engine || // engine detected close, but Room missed it
        this.engine.isClosed || // transports failed without notifying engine
        !this.engine.verifyTransport()
      ) {
        consecutiveFailures++;
        this.log.warn("detected connection state mismatch", Object.assign(Object.assign({}, this.logContext), {
          numFailures: consecutiveFailures,
          engine: this.engine ? {
            closed: this.engine.isClosed,
            transportsConnected: this.engine.verifyTransport()
          } : void 0
        }));
        if (consecutiveFailures >= 3) {
          this.recreateEngine();
          this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, DisconnectReason.STATE_MISMATCH);
        }
      } else {
        consecutiveFailures = 0;
      }
    }, connectionReconcileFrequency);
  }
  clearConnectionReconcile() {
    if (this.connectionReconcileInterval) {
      CriticalTimers.clearInterval(this.connectionReconcileInterval);
    }
  }
  setAndEmitConnectionState(state) {
    if (state === this.state) {
      return false;
    }
    this.state = state;
    this.emit(RoomEvent.ConnectionStateChanged, this.state);
    return true;
  }
  emitBufferedEvents() {
    this.bufferedEvents.forEach((_ref3) => {
      let [ev, args] = _ref3;
      this.emit(ev, ...args);
    });
    this.bufferedEvents = [];
  }
  emitWhenConnected(event) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    if (this.state === ConnectionState.Reconnecting || this.isResuming || !this.engine || this.engine.pendingReconnect) {
      this.bufferedEvents.push([event, args]);
    } else if (this.state === ConnectionState.Connected) {
      return this.emit(event, ...args);
    }
    return false;
  }
  /**
   * Allows to populate a room with simulated participants.
   * No actual connection to a server will be established, all state is
   * @experimental
   */
  simulateParticipants(options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const publishOptions = Object.assign({
        audio: true,
        video: true,
        useRealTracks: false
      }, options.publish);
      const participantOptions = Object.assign({
        count: 9,
        audio: false,
        video: true,
        aspectRatios: [1.66, 1.7, 1.3]
      }, options.participants);
      this.handleDisconnect();
      this.roomInfo = new Room$1({
        sid: "RM_SIMULATED",
        name: "simulated-room",
        emptyTimeout: 0,
        maxParticipants: 0,
        creationTime: protoInt64.parse((/* @__PURE__ */ new Date()).getTime()),
        metadata: "",
        numParticipants: 1,
        numPublishers: 1,
        turnPassword: "",
        enabledCodecs: [],
        activeRecording: false
      });
      this.localParticipant.updateInfo(new ParticipantInfo({
        identity: "simulated-local",
        name: "local-name"
      }));
      this.setupLocalParticipantEvents();
      this.emit(RoomEvent.SignalConnected);
      this.emit(RoomEvent.Connected);
      this.setAndEmitConnectionState(ConnectionState.Connected);
      if (publishOptions.video) {
        const camPub = new LocalTrackPublication(Track.Kind.Video, new TrackInfo({
          source: TrackSource.CAMERA,
          sid: Math.floor(Math.random() * 1e4).toString(),
          type: TrackType.AUDIO,
          name: "video-dummy"
        }), new LocalVideoTrack(publishOptions.useRealTracks ? (yield window.navigator.mediaDevices.getUserMedia({
          video: true
        })).getVideoTracks()[0] : createDummyVideoStreamTrack(160 * ((_a = participantOptions.aspectRatios[0]) !== null && _a !== void 0 ? _a : 1), 160, true, true), void 0, false, {
          loggerName: this.options.loggerName,
          loggerContextCb: () => this.logContext
        }), {
          loggerName: this.options.loggerName,
          loggerContextCb: () => this.logContext
        });
        this.localParticipant.addTrackPublication(camPub);
        this.localParticipant.emit(ParticipantEvent.LocalTrackPublished, camPub);
      }
      if (publishOptions.audio) {
        const audioPub = new LocalTrackPublication(Track.Kind.Audio, new TrackInfo({
          source: TrackSource.MICROPHONE,
          sid: Math.floor(Math.random() * 1e4).toString(),
          type: TrackType.AUDIO
        }), new LocalAudioTrack(publishOptions.useRealTracks ? (yield navigator.mediaDevices.getUserMedia({
          audio: true
        })).getAudioTracks()[0] : getEmptyAudioStreamTrack(), void 0, false, this.audioContext, {
          loggerName: this.options.loggerName,
          loggerContextCb: () => this.logContext
        }), {
          loggerName: this.options.loggerName,
          loggerContextCb: () => this.logContext
        });
        this.localParticipant.addTrackPublication(audioPub);
        this.localParticipant.emit(ParticipantEvent.LocalTrackPublished, audioPub);
      }
      for (let i = 0; i < participantOptions.count - 1; i += 1) {
        let info = new ParticipantInfo({
          sid: Math.floor(Math.random() * 1e4).toString(),
          identity: "simulated-".concat(i),
          state: ParticipantInfo_State.ACTIVE,
          tracks: [],
          joinedAt: protoInt64.parse(Date.now())
        });
        const p = this.getOrCreateParticipant(info.identity, info);
        if (participantOptions.video) {
          const dummyVideo = createDummyVideoStreamTrack(160 * ((_b = participantOptions.aspectRatios[i % participantOptions.aspectRatios.length]) !== null && _b !== void 0 ? _b : 1), 160, false, true);
          const videoTrack = new TrackInfo({
            source: TrackSource.CAMERA,
            sid: Math.floor(Math.random() * 1e4).toString(),
            type: TrackType.AUDIO
          });
          p.addSubscribedMediaTrack(dummyVideo, videoTrack.sid, new MediaStream([dummyVideo]), new RTCRtpReceiver());
          info.tracks = [...info.tracks, videoTrack];
        }
        if (participantOptions.audio) {
          const dummyTrack = getEmptyAudioStreamTrack();
          const audioTrack = new TrackInfo({
            source: TrackSource.MICROPHONE,
            sid: Math.floor(Math.random() * 1e4).toString(),
            type: TrackType.AUDIO
          });
          p.addSubscribedMediaTrack(dummyTrack, audioTrack.sid, new MediaStream([dummyTrack]), new RTCRtpReceiver());
          info.tracks = [...info.tracks, audioTrack];
        }
        p.updateInfo(info);
      }
    });
  }
  // /** @internal */
  emit(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    if (event !== RoomEvent.ActiveSpeakersChanged) {
      const minimizedArgs = mapArgs(args).filter((arg) => arg !== void 0);
      this.log.debug("room event ".concat(event), Object.assign(Object.assign({}, this.logContext), {
        event,
        args: minimizedArgs
      }));
    }
    return super.emit(event, ...args);
  }
};
Room.cleanupRegistry = typeof FinalizationRegistry !== "undefined" && new FinalizationRegistry((cleanup) => {
  cleanup();
});
function mapArgs(args) {
  return args.map((arg) => {
    if (!arg) {
      return;
    }
    if (Array.isArray(arg)) {
      return mapArgs(arg);
    }
    if (typeof arg === "object") {
      return "logContext" in arg ? arg.logContext : void 0;
    }
    return arg;
  });
}
var CheckStatus;
(function(CheckStatus2) {
  CheckStatus2[CheckStatus2["IDLE"] = 0] = "IDLE";
  CheckStatus2[CheckStatus2["RUNNING"] = 1] = "RUNNING";
  CheckStatus2[CheckStatus2["SKIPPED"] = 2] = "SKIPPED";
  CheckStatus2[CheckStatus2["SUCCESS"] = 3] = "SUCCESS";
  CheckStatus2[CheckStatus2["FAILED"] = 4] = "FAILED";
})(CheckStatus || (CheckStatus = {}));
var Checker = class extends eventsExports.EventEmitter {
  constructor(url, token) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    super();
    this.status = CheckStatus.IDLE;
    this.logs = [];
    this.errorsAsWarnings = false;
    this.url = url;
    this.token = token;
    this.name = this.constructor.name;
    this.room = new Room(options.roomOptions);
    this.connectOptions = options.connectOptions;
    if (options.errorsAsWarnings) {
      this.errorsAsWarnings = options.errorsAsWarnings;
    }
  }
  run(onComplete) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.status !== CheckStatus.IDLE) {
        throw Error("check is running already");
      }
      this.setStatus(CheckStatus.RUNNING);
      try {
        yield this.perform();
      } catch (err) {
        if (err instanceof Error) {
          if (this.errorsAsWarnings) {
            this.appendWarning(err.message);
          } else {
            this.appendError(err.message);
          }
        }
      }
      yield this.disconnect();
      yield new Promise((resolve) => setTimeout(resolve, 500));
      if (this.status !== CheckStatus.SKIPPED) {
        this.setStatus(this.isSuccess() ? CheckStatus.SUCCESS : CheckStatus.FAILED);
      }
      if (onComplete) {
        onComplete();
      }
      return this.getInfo();
    });
  }
  isSuccess() {
    return !this.logs.some((l) => l.level === "error");
  }
  connect() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.room.state === ConnectionState.Connected) {
        return this.room;
      }
      yield this.room.connect(this.url, this.token, this.connectOptions);
      return this.room;
    });
  }
  disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.room && this.room.state !== ConnectionState.Disconnected) {
        yield this.room.disconnect();
        yield new Promise((resolve) => setTimeout(resolve, 500));
      }
    });
  }
  skip() {
    this.setStatus(CheckStatus.SKIPPED);
  }
  appendMessage(message) {
    this.logs.push({
      level: "info",
      message
    });
    this.emit("update", this.getInfo());
  }
  appendWarning(message) {
    this.logs.push({
      level: "warning",
      message
    });
    this.emit("update", this.getInfo());
  }
  appendError(message) {
    this.logs.push({
      level: "error",
      message
    });
    this.emit("update", this.getInfo());
  }
  setStatus(status) {
    this.status = status;
    this.emit("update", this.getInfo());
  }
  get engine() {
    var _a;
    return (_a = this.room) === null || _a === void 0 ? void 0 : _a.engine;
  }
  getInfo() {
    return {
      logs: this.logs,
      name: this.name,
      status: this.status,
      description: this.description
    };
  }
};
function createLocalTracks(options) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b;
    options !== null && options !== void 0 ? options : options = {};
    (_a = options.audio) !== null && _a !== void 0 ? _a : options.audio = {
      deviceId: "default"
    };
    (_b = options.video) !== null && _b !== void 0 ? _b : options.video = {
      deviceId: "default"
    };
    const {
      audioProcessor,
      videoProcessor
    } = extractProcessorsFromOptions(options);
    const opts = mergeDefaultOptions(options, audioDefaults, videoDefaults);
    const constraints = constraintsForOptions(opts);
    const mediaPromise = navigator.mediaDevices.getUserMedia(constraints);
    if (options.audio) {
      DeviceManager.userMediaPromiseMap.set("audioinput", mediaPromise);
      mediaPromise.catch(() => DeviceManager.userMediaPromiseMap.delete("audioinput"));
    }
    if (options.video) {
      DeviceManager.userMediaPromiseMap.set("videoinput", mediaPromise);
      mediaPromise.catch(() => DeviceManager.userMediaPromiseMap.delete("videoinput"));
    }
    const stream = yield mediaPromise;
    return Promise.all(stream.getTracks().map((mediaStreamTrack) => __awaiter(this, void 0, void 0, function* () {
      const isAudio = mediaStreamTrack.kind === "audio";
      isAudio ? opts.audio : opts.video;
      let trackConstraints;
      const conOrBool = isAudio ? constraints.audio : constraints.video;
      if (typeof conOrBool !== "boolean") {
        trackConstraints = conOrBool;
      }
      if (trackConstraints) {
        trackConstraints.deviceId = mediaStreamTrack.getSettings().deviceId;
      } else {
        trackConstraints = {
          deviceId: mediaStreamTrack.getSettings().deviceId
        };
      }
      const track = mediaTrackToLocalTrack(mediaStreamTrack, trackConstraints);
      if (track.kind === Track.Kind.Video) {
        track.source = Track.Source.Camera;
      } else if (track.kind === Track.Kind.Audio) {
        track.source = Track.Source.Microphone;
      }
      track.mediaStream = stream;
      if (isAudioTrack(track) && audioProcessor) {
        yield track.setProcessor(audioProcessor);
      } else if (isVideoTrack(track) && videoProcessor) {
        yield track.setProcessor(videoProcessor);
      }
      return track;
    })));
  });
}
function createLocalVideoTrack(options) {
  return __awaiter(this, void 0, void 0, function* () {
    const tracks = yield createLocalTracks({
      audio: false,
      video: options
    });
    return tracks[0];
  });
}
function createLocalAudioTrack(options) {
  return __awaiter(this, void 0, void 0, function* () {
    const tracks = yield createLocalTracks({
      audio: options,
      video: false
    });
    return tracks[0];
  });
}
function createLocalScreenTracks(options) {
  return __awaiter(this, void 0, void 0, function* () {
    if (options === void 0) {
      options = {};
    }
    if (options.resolution === void 0 && !isSafari17()) {
      options.resolution = ScreenSharePresets.h1080fps30.resolution;
    }
    if (navigator.mediaDevices.getDisplayMedia === void 0) {
      throw new DeviceUnsupportedError("getDisplayMedia not supported");
    }
    const constraints = screenCaptureToDisplayMediaStreamOptions(options);
    const stream = yield navigator.mediaDevices.getDisplayMedia(constraints);
    const tracks = stream.getVideoTracks();
    if (tracks.length === 0) {
      throw new TrackInvalidError("no video track found");
    }
    const screenVideo = new LocalVideoTrack(tracks[0], void 0, false);
    screenVideo.source = Track.Source.ScreenShare;
    const localTracks = [screenVideo];
    if (stream.getAudioTracks().length > 0) {
      const screenAudio = new LocalAudioTrack(stream.getAudioTracks()[0], void 0, false);
      screenAudio.source = Track.Source.ScreenShareAudio;
      localTracks.push(screenAudio);
    }
    return localTracks;
  });
}
var PublishAudioCheck = class extends Checker {
  get description() {
    return "Can publish audio";
  }
  perform() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const room = yield this.connect();
      const track = yield createLocalAudioTrack();
      room.localParticipant.publishTrack(track);
      yield new Promise((resolve) => setTimeout(resolve, 3e3));
      const stats = yield (_a = track.sender) === null || _a === void 0 ? void 0 : _a.getStats();
      if (!stats) {
        throw new Error("Could not get RTCStats");
      }
      let numPackets = 0;
      stats.forEach((stat) => {
        if (stat.type === "outbound-rtp" && (stat.kind === "audio" || !stat.kind && stat.mediaType === "audio")) {
          numPackets = stat.packetsSent;
        }
      });
      if (numPackets === 0) {
        throw new Error("Could not determine packets are sent");
      }
      this.appendMessage("published ".concat(numPackets, " audio packets"));
    });
  }
};
var PublishVideoCheck = class extends Checker {
  get description() {
    return "Can publish video";
  }
  perform() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const room = yield this.connect();
      const track = yield createLocalVideoTrack();
      room.localParticipant.publishTrack(track);
      yield new Promise((resolve) => setTimeout(resolve, 5e3));
      const stats = yield (_a = track.sender) === null || _a === void 0 ? void 0 : _a.getStats();
      if (!stats) {
        throw new Error("Could not get RTCStats");
      }
      let numPackets = 0;
      stats.forEach((stat) => {
        if (stat.type === "outbound-rtp" && (stat.kind === "video" || !stat.kind && stat.mediaType === "video")) {
          numPackets += stat.packetsSent;
        }
      });
      if (numPackets === 0) {
        throw new Error("Could not determine packets are sent");
      }
      this.appendMessage("published ".concat(numPackets, " video packets"));
    });
  }
};
var ReconnectCheck = class extends Checker {
  get description() {
    return "Resuming connection after interruption";
  }
  perform() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const room = yield this.connect();
      let reconnectingTriggered = false;
      let reconnected = false;
      let reconnectResolver;
      const reconnectTimeout = new Promise((resolve) => {
        setTimeout(resolve, 5e3);
        reconnectResolver = resolve;
      });
      const handleReconnecting = () => {
        reconnectingTriggered = true;
      };
      room.on(RoomEvent.SignalReconnecting, handleReconnecting).on(RoomEvent.Reconnecting, handleReconnecting).on(RoomEvent.Reconnected, () => {
        reconnected = true;
        reconnectResolver(true);
      });
      (_a = room.engine.client.ws) === null || _a === void 0 ? void 0 : _a.close();
      const onClose = room.engine.client.onClose;
      if (onClose) {
        onClose("");
      }
      yield reconnectTimeout;
      if (!reconnectingTriggered) {
        throw new Error("Did not attempt to reconnect");
      } else if (!reconnected || room.state !== ConnectionState.Connected) {
        this.appendWarning("reconnection is only possible in Redis-based configurations");
        throw new Error("Not able to reconnect");
      }
    });
  }
};
var TURNCheck = class extends Checker {
  get description() {
    return "Can connect via TURN";
  }
  perform() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const signalClient = new SignalClient();
      const joinRes = yield signalClient.join(this.url, this.token, {
        autoSubscribe: true,
        maxRetries: 0,
        e2eeEnabled: false,
        websocketTimeout: 15e3
      });
      let hasTLS = false;
      let hasTURN = false;
      let hasSTUN = false;
      for (let iceServer of joinRes.iceServers) {
        for (let url of iceServer.urls) {
          if (url.startsWith("turn:")) {
            hasTURN = true;
            hasSTUN = true;
          } else if (url.startsWith("turns:")) {
            hasTURN = true;
            hasSTUN = true;
            hasTLS = true;
          }
          if (url.startsWith("stun:")) {
            hasSTUN = true;
          }
        }
      }
      if (!hasSTUN) {
        this.appendWarning("No STUN servers configured on server side.");
      } else if (hasTURN && !hasTLS) {
        this.appendWarning("TURN is configured server side, but TURN/TLS is unavailable.");
      }
      yield signalClient.close();
      if (((_b = (_a = this.connectOptions) === null || _a === void 0 ? void 0 : _a.rtcConfig) === null || _b === void 0 ? void 0 : _b.iceServers) || hasTURN) {
        yield this.room.connect(this.url, this.token, {
          rtcConfig: {
            iceTransportPolicy: "relay"
          }
        });
      } else {
        this.appendWarning("No TURN servers configured.");
        this.skip();
        yield new Promise((resolve) => setTimeout(resolve, 0));
      }
    });
  }
};
var WebRTCCheck = class extends Checker {
  get description() {
    return "Establishing WebRTC connection";
  }
  perform() {
    return __awaiter(this, void 0, void 0, function* () {
      let hasTcp = false;
      let hasIpv4Udp = false;
      this.room.on(RoomEvent.SignalConnected, () => {
        const prevTrickle = this.room.engine.client.onTrickle;
        this.room.engine.client.onTrickle = (sd, target) => {
          if (sd.candidate) {
            const candidate = new RTCIceCandidate(sd);
            let str = "".concat(candidate.protocol, " ").concat(candidate.address, ":").concat(candidate.port, " ").concat(candidate.type);
            if (candidate.address) {
              if (isIPPrivate(candidate.address)) {
                str += " (private)";
              } else {
                if (candidate.protocol === "tcp" && candidate.tcpType === "passive") {
                  hasTcp = true;
                  str += " (passive)";
                } else if (candidate.protocol === "udp") {
                  hasIpv4Udp = true;
                }
              }
            }
            this.appendMessage(str);
          }
          if (prevTrickle) {
            prevTrickle(sd, target);
          }
        };
        if (this.room.engine.pcManager) {
          this.room.engine.pcManager.subscriber.onIceCandidateError = (ev) => {
            if (ev instanceof RTCPeerConnectionIceErrorEvent) {
              this.appendWarning("error with ICE candidate: ".concat(ev.errorCode, " ").concat(ev.errorText, " ").concat(ev.url));
            }
          };
        }
      });
      try {
        yield this.connect();
        livekitLogger.info("now the room is connected");
      } catch (err) {
        this.appendWarning("ports need to be open on firewall in order to connect.");
        throw err;
      }
      if (!hasTcp) {
        this.appendWarning("Server is not configured for ICE/TCP");
      }
      if (!hasIpv4Udp) {
        this.appendWarning("No public IPv4 UDP candidates were found. Your server is likely not configured correctly");
      }
    });
  }
};
function isIPPrivate(address) {
  const parts = address.split(".");
  if (parts.length === 4) {
    if (parts[0] === "10") {
      return true;
    } else if (parts[0] === "192" && parts[1] === "168") {
      return true;
    } else if (parts[0] === "172") {
      const second = parseInt(parts[1], 10);
      if (second >= 16 && second <= 31) {
        return true;
      }
    }
  }
  return false;
}
var WebSocketCheck = class extends Checker {
  get description() {
    return "Connecting to signal connection via WebSocket";
  }
  perform() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      if (this.url.startsWith("ws:") || this.url.startsWith("http:")) {
        this.appendWarning("Server is insecure, clients may block connections to it");
      }
      let signalClient = new SignalClient();
      const joinRes = yield signalClient.join(this.url, this.token, {
        autoSubscribe: true,
        maxRetries: 0,
        e2eeEnabled: false,
        websocketTimeout: 15e3
      });
      this.appendMessage("Connected to server, version ".concat(joinRes.serverVersion, "."));
      if (((_a = joinRes.serverInfo) === null || _a === void 0 ? void 0 : _a.edition) === ServerInfo_Edition.Cloud && ((_b = joinRes.serverInfo) === null || _b === void 0 ? void 0 : _b.region)) {
        this.appendMessage("LiveKit Cloud: ".concat((_c = joinRes.serverInfo) === null || _c === void 0 ? void 0 : _c.region));
      }
      yield signalClient.close();
    });
  }
};
var ConnectionCheck = class extends eventsExports.EventEmitter {
  constructor(url, token) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    super();
    this.options = {};
    this.checkResults = /* @__PURE__ */ new Map();
    this.url = url;
    this.token = token;
    this.options = options;
  }
  getNextCheckId() {
    const nextId = this.checkResults.size;
    this.checkResults.set(nextId, {
      logs: [],
      status: CheckStatus.IDLE,
      name: "",
      description: ""
    });
    return nextId;
  }
  updateCheck(checkId, info) {
    this.checkResults.set(checkId, info);
    this.emit("checkUpdate", checkId, info);
  }
  isSuccess() {
    return Array.from(this.checkResults.values()).every((r2) => r2.status !== CheckStatus.FAILED);
  }
  getResults() {
    return Array.from(this.checkResults.values());
  }
  createAndRunCheck(check) {
    return __awaiter(this, void 0, void 0, function* () {
      const checkId = this.getNextCheckId();
      const test = new check(this.url, this.token, this.options);
      const handleUpdate = (info) => {
        this.updateCheck(checkId, info);
      };
      test.on("update", handleUpdate);
      const result = yield test.run();
      test.off("update", handleUpdate);
      return result;
    });
  }
  checkWebsocket() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.createAndRunCheck(WebSocketCheck);
    });
  }
  checkWebRTC() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.createAndRunCheck(WebRTCCheck);
    });
  }
  checkTURN() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.createAndRunCheck(TURNCheck);
    });
  }
  checkReconnect() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.createAndRunCheck(ReconnectCheck);
    });
  }
  checkPublishAudio() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.createAndRunCheck(PublishAudioCheck);
    });
  }
  checkPublishVideo() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.createAndRunCheck(PublishVideoCheck);
    });
  }
};
function facingModeFromLocalTrack(localTrack) {
  let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _a;
  const track = isLocalTrack(localTrack) ? localTrack.mediaStreamTrack : localTrack;
  const trackSettings = track.getSettings();
  let result = {
    facingMode: (_a = options.defaultFacingMode) !== null && _a !== void 0 ? _a : "user",
    confidence: "low"
  };
  if ("facingMode" in trackSettings) {
    const rawFacingMode = trackSettings.facingMode;
    livekitLogger.trace("rawFacingMode", {
      rawFacingMode
    });
    if (rawFacingMode && typeof rawFacingMode === "string" && isFacingModeValue(rawFacingMode)) {
      result = {
        facingMode: rawFacingMode,
        confidence: "high"
      };
    }
  }
  if (["low", "medium"].includes(result.confidence)) {
    livekitLogger.trace("Try to get facing mode from device label: (".concat(track.label, ")"));
    const labelAnalysisResult = facingModeFromDeviceLabel(track.label);
    if (labelAnalysisResult !== void 0) {
      result = labelAnalysisResult;
    }
  }
  return result;
}
var knownDeviceLabels = /* @__PURE__ */ new Map([["obs virtual camera", {
  facingMode: "environment",
  confidence: "medium"
}]]);
var knownDeviceLabelSections = /* @__PURE__ */ new Map([["iphone", {
  facingMode: "environment",
  confidence: "medium"
}], ["ipad", {
  facingMode: "environment",
  confidence: "medium"
}]]);
function facingModeFromDeviceLabel(deviceLabel) {
  var _a;
  const label = deviceLabel.trim().toLowerCase();
  if (label === "") {
    return void 0;
  }
  if (knownDeviceLabels.has(label)) {
    return knownDeviceLabels.get(label);
  }
  return (_a = Array.from(knownDeviceLabelSections.entries()).find((_ref) => {
    let [section] = _ref;
    return label.includes(section);
  })) === null || _a === void 0 ? void 0 : _a[1];
}
function isFacingModeValue(item) {
  const allowedValues = ["user", "environment", "left", "right"];
  return item === void 0 || allowedValues.includes(item);
}
export {
  AudioPresets,
  BackupCodecPolicy,
  BaseKeyProvider,
  CheckStatus,
  Checker,
  ConnectionCheck,
  ConnectionError,
  ConnectionErrorReason,
  ConnectionQuality,
  ConnectionState,
  CriticalTimers,
  CryptorError,
  CryptorErrorReason,
  CryptorEvent,
  DataPacket_Kind,
  DefaultReconnectPolicy,
  DeviceUnsupportedError,
  DisconnectReason,
  EncryptionEvent,
  EngineEvent,
  ExternalE2EEKeyProvider,
  KeyHandlerEvent,
  KeyProviderEvent,
  LivekitError,
  LocalAudioTrack,
  LocalParticipant,
  LocalTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  LogLevel,
  LoggerNames,
  MediaDeviceFailure,
  _ as Mutex,
  NegotiationError,
  Participant,
  ParticipantEvent,
  ParticipantInfo_Kind as ParticipantKind,
  PublishDataError,
  RemoteAudioTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteVideoTrack,
  Room,
  RoomEvent,
  RpcError,
  ScreenSharePresets,
  SignalRequestError,
  SubscriptionError,
  Track,
  TrackEvent,
  TrackInvalidError,
  TrackPublication,
  UnexpectedConnectionState,
  UnsupportedServer,
  VideoPreset,
  VideoPresets,
  VideoPresets43,
  VideoQuality,
  attachToElement,
  compareVersions,
  createAudioAnalyser,
  createE2EEKey,
  createKeyMaterialFromBuffer,
  createKeyMaterialFromString,
  createLocalAudioTrack,
  createLocalScreenTracks,
  createLocalTracks,
  createLocalVideoTrack,
  deriveKeys,
  detachTrack,
  facingModeFromDeviceLabel,
  facingModeFromLocalTrack,
  getBrowser,
  getEmptyAudioStreamTrack,
  getEmptyVideoStreamTrack,
  getLogger,
  importKey,
  isAudioTrack,
  isBackupCodec,
  isBrowserSupported,
  isE2EESupported,
  isInsertableStreamSupported,
  isLocalParticipant,
  isLocalTrack,
  isRemoteParticipant,
  isRemoteTrack,
  isScriptTransformSupported,
  isVideoFrame,
  isVideoTrack,
  needsRbspUnescaping,
  parseRbsp,
  protocolVersion,
  ratchet,
  setLogExtension,
  setLogLevel,
  supportsAV1,
  supportsAdaptiveStream,
  supportsDynacast,
  supportsVP9,
  version,
  videoCodecs,
  writeRbsp
};
//# sourceMappingURL=livekit-client.js.map
