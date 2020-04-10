export enum Type {
  F = "function",
  N = "number",
  B = "boolean",
  S = "string",
}

const operators = {
  // Numerical Operators
  ":+": [Type.N, Type.N, Type.N],
  ":-": [Type.N, Type.N, Type.N],
  ":*": [Type.N, Type.N, Type.N],
  ":/": [Type.N, Type.N, Type.N],
  ":<": [Type.N, Type.N, Type.B],
  ":>": [Type.N, Type.N, Type.B],
  ":<=": [Type.N, Type.N, Type.B],
  ":>=": [Type.N, Type.N, Type.B],
  ":=n": [Type.N, Type.N, Type.B],
  ":=s": [Type.S, Type.S, Type.B],
  // Boolean Operators
  ":||": [Type.B, Type.B, Type.B],
  ":&&": [Type.B, Type.B, Type.B],
  // Lookup Operators
  ":.": [Type.N, Type.N],
  // cast to string
  ":s": [Type.N, Type.S],
  // Conditional Operators
  ":?n": [Type.B, Type.N, Type.N, Type.N],
  ":?s": [Type.B, Type.S, Type.S, Type.S],
  ":?b": [Type.B, Type.B, Type.B, Type.B],
  ":?f": [Type.B, Type.F, Type.F, Type.F],
};

export function validate(expr: unknown, type?: Type) {
  // Validate operator, arguments and return type
  if (Array.isArray(expr)) {
    try {
      const [op, ...cdr] = expr;
      console.log(`Checking if (${op}) exists:`, operators.hasOwnProperty(op));
      if (
        operators.hasOwnProperty(op) &&
        cdr.length === operators[op].length - 1
      ) {
        const retType = operators[op].slice(-1)[0];
        return (
          (!type || retType === type) &&
          cdr.every((item, idx) => validate(item, operators[op][idx]))
        );
      }
      console.error("unhandled operator referenced:", op);
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const typeComparison =
    type === undefined
      ? [Type.F, Type.N, Type.B, Type.S].includes(typeof expr as Type)
      : typeof expr === type;
  if (!typeComparison) {
    console.error(expr, "is not of type:", type);
  }
  return typeComparison;
}
