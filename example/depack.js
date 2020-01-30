#!/usr/bin/env node
             
const stream = require('stream');
const child_process = require('child_process');
const os = require('os');
const assert = require('assert');             
const t = child_process.fork;
const v = stream.PassThrough, z = stream.Writable;
const C = (a, b = 0, f = !1) => {
  if (0 === b && !f) {
    return a;
  }
  a = a.split("\n", f ? b + 1 : void 0);
  return f ? a[a.length - 1] : a.slice(b).join("\n");
}, D = (a, b = !1) => C(a, 2 + (b ? 1 : 0)), E = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const F = os.homedir;
const G = /\s+at.*(?:\(|\s)(.*)\)?/, H = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, I = F(), J = a => {
  const {pretty:b = !1, ignoredModules:f = ["pirates"]} = {}, g = new RegExp(H.source.replace("IGNORED_MODULES", f.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(G);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !g.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(G, (k, d) => k.replace(d, d.replace(I, "~"))) : e).join("\n");
};
function K(a, b, f = !1) {
  return function(g) {
    var e = E(arguments), {stack:k} = Error();
    const d = C(k, 2, !0), c = (k = g instanceof Error) ? g.message : g;
    e = [`Error: ${c}`, ...null !== e && a === e || f ? [b] : [d, b]].join("\n");
    e = J(e);
    return Object.assign(k ? g : Error(), {message:c, stack:e});
  };
}
;function L(a) {
  var {stack:b} = Error();
  const f = E(arguments);
  b = D(b, a);
  return K(f, b, a);
}
;const M = (a, b) => {
  b.once("error", f => {
    a.emit("error", f);
  });
  return b;
};
class N extends z {
  constructor(a) {
    const {binary:b = !1, rs:f = null, ...g} = a || {}, {m:e = L(!0), proxyError:k} = a || {}, d = (c, h) => e(h);
    super(g);
    this.h = [];
    this.l = new Promise((c, h) => {
      this.on("finish", () => {
        let l;
        b ? l = Buffer.concat(this.h) : l = this.h.join("");
        c(l);
        this.h = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          d`${l}`;
        } else {
          const p = J(l.stack);
          l.stack = p;
          k && d`${l}`;
        }
        h(l);
      });
      f && M(this, f).pipe(this);
    });
  }
  _write(a, b, f) {
    this.h.push(a);
    f();
  }
  get promise() {
    return this.l;
  }
}
const O = async a => {
  ({promise:a} = new N({rs:a, m:L(!0)}));
  return await a;
};
const P = async a => {
  const [b, f, g] = await Promise.all([new Promise((e, k) => {
    a.on("error", k).on("exit", d => {
      e(d);
    });
  }), a.stdout ? O(a.stdout) : void 0, a.stderr ? O(a.stderr) : void 0]);
  return {code:b, stdout:f, stderr:g};
};
const Q = (a, b, f = [], g = null) => {
  if (g) {
    a.on("data", c => g.write(c));
  }
  let [e, ...k] = f;
  if (e) {
    var d = c => {
      const [h, l] = e;
      h.test(c) && (c = `${l}\n`, g && g.write(c), b.write(c), [e, ...k] = k, e || a.removeListener("data", d));
    };
    a.on("data", d);
  }
};
const aa = assert.deepStrictEqual, ba = assert.strictEqual;
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function R(a, b, f) {
  let g = a[a.length - 1];
  g && g.c === b && g.g === f ? a[a.length - 1] = {count:g.count + 1, c:b, g:f} : a.push({count:1, c:b, g:f});
}
function S(a, b, f, g, e) {
  let k = f.length, d = g.length, c = b.b;
  e = c - e;
  let h = 0;
  for (; c + 1 < k && e + 1 < d && a.equals(f[c + 1], g[e + 1]);) {
    c++, e++, h++;
  }
  h && b.f.push({count:h});
  b.b = c;
  return e;
}
function T(a) {
  let b = [];
  for (let f = 0; f < a.length; f++) {
    a[f] && b.push(a[f]);
  }
  return b;
}
function ca(a, b) {
  var f = new da;
  a = T(a.split(""));
  b = T(b.split(""));
  let g = b.length, e = a.length, k = 1, d = g + e, c = [{b:-1, f:[]}];
  var h = S(f, c[0], b, a, 0);
  if (c[0].b + 1 >= g && h + 1 >= e) {
    return [{value:f.join(b), count:b.length}];
  }
  for (; k <= d;) {
    a: {
      for (h = -1 * k; h <= k; h += 2) {
        var l = c[h - 1];
        let n = c[h + 1];
        var p = (n ? n.b : 0) - h;
        l && (c[h - 1] = void 0);
        let q = l && l.b + 1 < g;
        p = n && 0 <= p && p < e;
        if (q || p) {
          !q || p && l.b < n.b ? (l = {b:n.b, f:n.f.slice(0)}, R(l.f, void 0, !0)) : (l.b++, R(l.f, !0, void 0));
          p = S(f, l, b, a, h);
          if (l.b + 1 >= g && p + 1 >= e) {
            h = ea(f, l.f, b, a);
            break a;
          }
          c[h] = l;
        } else {
          c[h] = void 0;
        }
      }
      k++;
      h = void 0;
    }
    if (h) {
      return h;
    }
  }
}
class da {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function ea(a, b, f, g) {
  let e = 0, k = b.length, d = 0, c = 0;
  for (; e < k; e++) {
    var h = b[e];
    if (h.g) {
      h.value = a.join(g.slice(c, c + h.count)), c += h.count, e && b[e - 1].c && (h = b[e - 1], b[e - 1] = b[e], b[e] = h);
    } else {
      if (h.c) {
        h.value = a.join(f.slice(d, d + h.count));
      } else {
        let l = f.slice(d, d + h.count);
        l = l.map(function(p, n) {
          n = g[c + n];
          return n.length > p.length ? n : p;
        });
        h.value = a.join(l);
      }
      d += h.count;
      h.c || (c += h.count);
    }
  }
  f = b[k - 1];
  1 < k && "string" === typeof f.value && (f.c || f.g) && a.equals("", f.value) && (b[k - 2].value += f.value, b.pop());
  return b;
}
;const fa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ha = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function U(a, b) {
  return (b = fa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function V(a) {
  return (a = ha[a]) ? `\x1b[${a}m${" "}\x1b[0m` : " ";
}
function ia(a, b) {
  return ca(a, b).map(({c:f, g, value:e}) => {
    const k = e.split(" ");
    return f ? k.map(d => d.replace(/\n$/mg, "\u23ce\n")).map(d => U(d, "green")).join(V("green")) : g ? k.map(d => d.replace(/\n$/mg, "\u23ce\n")).map(d => U(d, "red")).join(V("red")) : U(e, "grey");
  }).join("");
}
;const W = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function ja(a, b) {
  let f = 0;
  const g = (d, c) => {
    const h = " ".repeat(2 * f);
    c = void 0 !== c ? U("+ " + X(c), "green") : null;
    d = void 0 !== d ? U("- " + X(d), "red") : null;
    const l = [];
    d && l.push(W(h, d));
    c && l.push(W(h, c));
    return l.join("\n");
  }, e = d => {
    const c = " ".repeat(2 * f);
    return W(c, d);
  }, k = (d, c) => {
    if (d instanceof Date && c instanceof Date) {
      var h = d.getTime() != c.getTime() ? !1 : void 0;
      return h ? "" : g(d, c);
    }
    if (d instanceof Date && !(c instanceof Date) || !(d instanceof Date) && c instanceof Date || Array.isArray(d) && !Array.isArray(c) || !Array.isArray(d) && Array.isArray(c)) {
      return g(d, c);
    }
    if (Y(d) && Y(c) || !Y(d) && Y(c) || Y(d) && !Y(c)) {
      return d != c ? g(d, c) : "";
    }
    if (d.constructor && !c.constructor) {
      return g(d.constructor.name, c);
    }
    if (!d.constructor && c.constructor) {
      return g(d, c.constructor.name);
    }
    if (d.constructor && c.constructor) {
      if (d.constructor.name != c.constructor.name) {
        return g(d.constructor.name, c.constructor.name);
      }
      h = d.valueOf();
      var l = c.valueOf();
      if (Y(h) && Y(l) && h != l) {
        return g(h, l);
      }
    }
    if (Array.isArray(d) && Array.isArray(c)) {
      let p;
      h = d.map((n, q) => {
        p = q;
        (n = k(n, c[q])) && (n = `${e(`[${q}]`)}\n${n}`);
        return n;
      }).filter(Boolean);
      l = c.slice(p + 1).map((n, q) => `${e(`[${p + q + 1}]`)}\n${g(void 0, n)}`);
      return [...h, ...l].join("\n");
    }
    if ("object" == typeof d && "object" == typeof c) {
      const p = [], n = [], q = [];
      Object.keys(d).forEach(m => {
        m in c ? q.push(m) : n.push(m);
      });
      Object.keys(c).forEach(m => {
        m in d || p.push(m);
      });
      h = n.map(m => g(`${m}${`: ${X(d[m])}`}`));
      l = p.map(m => g(void 0, `${m}: ${X(c[m])}`));
      const A = q.map(m => {
        f++;
        const w = k(d[m], c[m]);
        let u = "";
        w && (u += e(Array.isArray(d[m]) && Array.isArray(c[m]) ? `${m}.Array` : m), u += "\n" + w);
        f--;
        return u;
      }).filter(Boolean);
      return [...h, ...l, ...A].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", d, c);
  };
  return k(a, b);
}
const Y = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), X = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
const ka = async(a, b = [], f = [], g = {}) => {
  const e = {stdio:"pipe", execArgv:[]};
  if ("string" == typeof a) {
    return {j:a, i:b, options:e};
  }
  const k = a.module;
  var d = a.getArgs;
  const c = a.options;
  a = a.getOptions;
  b = d ? await d.call(g, b, ...f) : b;
  d = e;
  c ? d = {...e, ...c} : a && (f = await a.call(g, ...f), d = {...e, ...f});
  return {j:k, i:b, options:d};
}, Z = (a, b, f) => {
  try {
    if ("string" == typeof b) {
      try {
        ba(a, b);
      } catch (e) {
        const k = ia(b, a);
        console.log(k);
        throw e;
      }
    } else {
      if (b) {
        var g = JSON.parse(a);
        try {
          aa(g, b, void 0);
        } catch (e) {
          const k = ja(b, g);
          e.message = [e.message, k].filter(Boolean).join("\n");
          throw e;
        }
      }
    }
  } catch (e) {
    throw f && (e.property = f), e;
  }
};
function la(a) {
  var b = ["q", "a"];
  const f = [];
  a.replace(/(['"])?([\s\S]+?)\1(\s+|$)/g, (g, ...e) => {
    g = e.slice(0, e.length - 2).reduce((k, d, c) => {
      c = b[c];
      if (!c || void 0 === d) {
        return k;
      }
      k[c] = d;
      return k;
    }, {});
    f.push(g);
  });
  return f;
}
;const ma = a => la(a).map(({a:b}) => b);
const qa = async a => {
  const {forkConfig:b, input:f, props:g = {}, contexts:e = []} = a;
  a = f ? ma(f) : [];
  const {j:k, i:d, options:c} = await ka(b, a, e, {...g, input:f});
  if (!k) {
    throw Error("Please specify a module to fork");
  }
  a = t(k, d, c);
  var h = P(a);
  a.promise = h;
  a.spawnCommand = a.spawnargs.join(" ");
  const {promise:l, stdout:p, stdin:n, stderr:q} = a, {includeAnswers:A = !0, log:m, inputs:w, stderrInputs:u, stripAnsi:na = !0, preprocess:oa} = b;
  var r = new v;
  const B = new v;
  !0 === m ? (r.pipe(process.stdout), B.pipe(process.stderr)) : m && (m.stdout && r.pipe(m.stdout), m.stderr && B.pipe(m.stderr));
  h = A && w;
  a = A && u;
  var x, y;
  h && (x = new N({rs:r}));
  a && (y = new N({rs:B}));
  Q(p, n, w, r);
  Q(q, n, u, B);
  r = await l;
  h && (x.end(), x = await x.promise, Object.assign(r, {stdout:x}));
  a && (y.end(), y = await y.promise, Object.assign(r, {stderr:y}));
  pa(r, g, na, oa);
  return r;
}, pa = ({code:a, stdout:b, stderr:f}, g, e, k) => {
  var d, c;
  "object" == typeof k ? {stdout:d, stderr:c} = k : "function" == typeof k && (d = c = k);
  b = b.replace(/\r?\n$/, "");
  f = f.replace(/\r?\n$/, "");
  b = e ? b.replace(/\033\[.*?m/g, "") : b;
  f = e ? f.replace(/\033\[.*?m/g, "") : f;
  d = d ? d(b) : b;
  c = c ? c(f) : f;
  Z(d, g.stdout, "stdout");
  Z(c, g.stderr, "stderr");
  if (g.code && a != g.code) {
    throw a = Error(`Fork exited with code ${a} != ${g.code}`), a.s = "code", a;
  }
};
(async() => {
  const a = await qa({contexts:["CONTEXT"], forkConfig:{module:"example/fork", getArgs(b) {
    return [...b, this.o];
  }, getOptions(b) {
    return {env:{EXAMPLE:`${b} - ${this.input}`}};
  }, preprocess(b) {
    return `pre-${b}`;
  }}, input:"hello world", props:{o:"999", stdout:"pre-[ 'hello', 'world', '999' ]", stderr:"pre-CONTEXT - hello world"}});
  console.log(a);
})();


//# sourceMappingURL=depack.js.map