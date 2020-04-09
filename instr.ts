enum Type {
  F = "f",
  N = "n",
  B = "b",
  S = "s"
}

const operators = {
  ":+": [Type.N, Type.N, Type.N],
  ":-": [Type.N, Type.N, Type.N],
  ":*": [Type.N, Type.N, Type.N],
  ":/": [Type.N, Type.N, Type.N],
  ":.": [Type.N, Type.N],
  ":s": [Type.N, Type.S],
  ":?n": [Type.B, Type.N, Type.N, Type.N],
  ":?s": [Type.B, Type.S, Type.S, Type.S],
  ":?b": [Type.B, Type.B, Type.B, Type.B],
  ":?f": [Type.B, Type.F, Type.F, Type.F]
};
