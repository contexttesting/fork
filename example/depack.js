#!/usr/bin/env node
             
const stream = require('stream');
const child_process = require('child_process');
const os = require('os');
const assert = require('assert');             
const {fork:t} = child_process;
const {PassThrough:y, Writable:A} = stream;
const G = (a, b = 0, f = !1) => {
  if (0 === b && !f) {
    return a;
  }
  a = a.split("\n", f ? b + 1 : void 0);
  return f ? a[a.length - 1] : a.slice(b).join("\n");
}, aa = (a, b = !1) => G(a, 2 + (b ? 1 : 0)), H = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:ba} = os;
const I = /\s+at.*(?:\(|\s)(.*)\)?/, ca = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, da = ba(), J = a => {
  const {pretty:b = !1, ignoredModules:f = ["pirates"]} = {}, g = new RegExp(ca.source.replace("IGNORED_MODULES", f.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(I);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !g.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(I, (k, e) => k.replace(e, e.replace(da, "~"))) : d).join("\n");
};
function ea(a, b, f = !1) {
  return function(g) {
    var d = H(arguments), {stack:k} = Error();
    const e = G(k, 2, !0), c = (k = g instanceof Error) ? g.message : g;
    d = [`Error: ${c}`, ...null !== d && a === d || f ? [b] : [e, b]].join("\n");
    d = J(d);
    return Object.assign(k ? g : Error(), {message:c, stack:d});
  };
}
;function K(a) {
  var {stack:b} = Error();
  const f = H(arguments);
  b = aa(b, a);
  return ea(f, b, a);
}
;const fa = (a, b) => {
  b.once("error", f => {
    a.emit("error", f);
  });
  return b;
};
class L extends A {
  constructor(a) {
    var b = a || {}, f = Object.assign({}, b);
    const g = void 0 === b.binary ? !1 : b.binary, d = void 0 === b.rs ? null : b.rs;
    b = (delete f.binary, delete f.rs, f);
    const {m:k = K(!0), proxyError:e} = a || {}, c = (h, l) => k(l);
    super(b);
    this.h = [];
    this.l = new Promise((h, l) => {
      this.on("finish", () => {
        let m;
        g ? m = Buffer.concat(this.h) : m = this.h.join("");
        h(m);
        this.h = [];
      });
      this.once("error", m => {
        if (-1 == m.stack.indexOf("\n")) {
          c`${m}`;
        } else {
          const n = J(m.stack);
          m.stack = n;
          e && c`${m}`;
        }
        l(m);
      });
      d && fa(this, d).pipe(this);
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
const M = async a => {
  var b = void 0 === b ? {} : b;
  ({promise:a} = new L(Object.assign({}, {rs:a}, b, {m:K(!0)})));
  return await a;
};
const ha = async a => {
  const [b, f, g] = await Promise.all([new Promise((d, k) => {
    a.on("error", k).on("exit", e => {
      d(e);
    });
  }), a.stdout ? M(a.stdout) : void 0, a.stderr ? M(a.stderr) : void 0]);
  return {code:b, stdout:f, stderr:g};
};
const N = (a, b, f = [], g = null) => {
  if (g) {
    a.on("data", c => g.write(c));
  }
  let [d, ...k] = f;
  if (d) {
    var e = c => {
      const [h, l] = d;
      h.test(c) && (c = `${l}\n`, g && g.write(c), b.write(c), [d, ...k] = k, d || a.removeListener("data", e));
    };
    a.on("data", e);
  }
};
const {deepStrictEqual:ia, strictEqual:ja} = assert;
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function O(a, b, f) {
  let g = a[a.length - 1];
  g && g.c === b && g.g === f ? a[a.length - 1] = {count:g.count + 1, c:b, g:f} : a.push({count:1, c:b, g:f});
}
function P(a, b, f, g, d) {
  let k = f.length, e = g.length, c = b.b;
  d = c - d;
  let h = 0;
  for (; c + 1 < k && d + 1 < e && a.equals(f[c + 1], g[d + 1]);) {
    c++, d++, h++;
  }
  h && b.f.push({count:h});
  b.b = c;
  return d;
}
function Q(a) {
  let b = [];
  for (let f = 0; f < a.length; f++) {
    a[f] && b.push(a[f]);
  }
  return b;
}
function ka(a, b) {
  var f = new la;
  a = Q(a.split(""));
  b = Q(b.split(""));
  let g = b.length, d = a.length, k = 1, e = g + d, c = [{b:-1, f:[]}];
  var h = P(f, c[0], b, a, 0);
  if (c[0].b + 1 >= g && h + 1 >= d) {
    return [{value:f.join(b), count:b.length}];
  }
  for (; k <= e;) {
    a: {
      for (h = -1 * k; h <= k; h += 2) {
        var l = c[h - 1];
        let n = c[h + 1];
        var m = (n ? n.b : 0) - h;
        l && (c[h - 1] = void 0);
        let q = l && l.b + 1 < g;
        m = n && 0 <= m && m < d;
        if (q || m) {
          !q || m && l.b < n.b ? (l = {b:n.b, f:n.f.slice(0)}, O(l.f, void 0, !0)) : (l.b++, O(l.f, !0, void 0));
          m = P(f, l, b, a, h);
          if (l.b + 1 >= g && m + 1 >= d) {
            h = ma(f, l.f, b, a);
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
class la {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function ma(a, b, f, g) {
  let d = 0, k = b.length, e = 0, c = 0;
  for (; d < k; d++) {
    var h = b[d];
    if (h.g) {
      h.value = a.join(g.slice(c, c + h.count)), c += h.count, d && b[d - 1].c && (h = b[d - 1], b[d - 1] = b[d], b[d] = h);
    } else {
      if (h.c) {
        h.value = a.join(f.slice(e, e + h.count));
      } else {
        let l = f.slice(e, e + h.count);
        l = l.map(function(m, n) {
          n = g[c + n];
          return n.length > m.length ? n : m;
        });
        h.value = a.join(l);
      }
      e += h.count;
      h.c || (c += h.count);
    }
  }
  f = b[k - 1];
  1 < k && "string" === typeof f.value && (f.c || f.g) && a.equals("", f.value) && (b[k - 2].value += f.value, b.pop());
  return b;
}
;const na = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, oa = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function R(a, b) {
  return (b = na[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function S(a) {
  return (a = oa[a]) ? `\x1b[${a}m${" "}\x1b[0m` : " ";
}
function pa(a, b) {
  return ka(a, b).map(({c:f, g, value:d}) => {
    const k = d.split(" ");
    return f ? k.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => R(e, "green")).join(S("green")) : g ? k.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => R(e, "red")).join(S("red")) : R(d, "grey");
  }).join("");
}
;const T = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function qa(a, b) {
  let f = 0;
  const g = (e, c) => {
    const h = " ".repeat(2 * f);
    c = void 0 !== c ? R("+ " + U(c), "green") : null;
    e = void 0 !== e ? R("- " + U(e), "red") : null;
    const l = [];
    e && l.push(T(h, e));
    c && l.push(T(h, c));
    return l.join("\n");
  }, d = e => {
    const c = " ".repeat(2 * f);
    return T(c, e);
  }, k = (e, c) => {
    if (e instanceof Date && c instanceof Date) {
      var h = e.getTime() != c.getTime() ? !1 : void 0;
      return h ? "" : g(e, c);
    }
    if (e instanceof Date && !(c instanceof Date) || !(e instanceof Date) && c instanceof Date || Array.isArray(e) && !Array.isArray(c) || !Array.isArray(e) && Array.isArray(c)) {
      return g(e, c);
    }
    if (Y(e) && Y(c) || !Y(e) && Y(c) || Y(e) && !Y(c)) {
      return e != c ? g(e, c) : "";
    }
    if (e.constructor && !c.constructor) {
      return g(e.constructor.name, c);
    }
    if (!e.constructor && c.constructor) {
      return g(e, c.constructor.name);
    }
    if (e.constructor && c.constructor) {
      if (e.constructor.name != c.constructor.name) {
        return g(e.constructor.name, c.constructor.name);
      }
      h = e.valueOf();
      var l = c.valueOf();
      if (Y(h) && Y(l) && h != l) {
        return g(h, l);
      }
    }
    if (Array.isArray(e) && Array.isArray(c)) {
      let m;
      h = e.map((n, q) => {
        m = q;
        (n = k(n, c[q])) && (n = `${d(`[${q}]`)}\n${n}`);
        return n;
      }).filter(Boolean);
      l = c.slice(m + 1).map((n, q) => `${d(`[${m + q + 1}]`)}\n${g(void 0, n)}`);
      return [...h, ...l].join("\n");
    }
    if ("object" == typeof e && "object" == typeof c) {
      const m = [], n = [], q = [];
      Object.keys(e).forEach(p => {
        p in c ? q.push(p) : n.push(p);
      });
      Object.keys(c).forEach(p => {
        p in e || m.push(p);
      });
      h = n.map(p => g(`${p}${`: ${U(e[p])}`}`));
      l = m.map(p => g(void 0, `${p}: ${U(c[p])}`));
      const B = q.map(p => {
        f++;
        const z = k(e[p], c[p]);
        let w = "";
        z && (w += d(Array.isArray(e[p]) && Array.isArray(c[p]) ? `${p}.Array` : p), w += "\n" + z);
        f--;
        return w;
      }).filter(Boolean);
      return [...h, ...l, ...B].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", e, c);
  };
  return k(a, b);
}
const Y = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), U = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
const ra = async(a, b, f, g) => {
  b = void 0 === b ? [] : b;
  f = void 0 === f ? [] : f;
  g = void 0 === g ? {} : g;
  const d = {stdio:"pipe", execArgv:[]};
  if ("string" == typeof a) {
    return {j:a, i:b, options:d};
  }
  const {module:k, getArgs:e, options:c, getOptions:h} = a;
  a = e ? await e.call(g, b, ...f) : b;
  b = d;
  c ? b = Object.assign({}, d, c) : h && (f = await h.call(g, ...f), b = Object.assign({}, d, f));
  return {j:k, i:a, options:b};
}, Z = (a, b, f) => {
  try {
    if ("string" == typeof b) {
      try {
        ja(a, b);
      } catch (d) {
        const k = pa(b, a);
        console.log(k);
        throw d;
      }
    } else {
      if (b) {
        var g = JSON.parse(a);
        try {
          ia(g, b, void 0);
        } catch (d) {
          const k = qa(b, g);
          d.message = [d.message, k].filter(Boolean).join("\n");
          throw d;
        }
      }
    }
  } catch (d) {
    throw f && (d.property = f), d;
  }
};
function sa(a) {
  var b = ["q", "a"];
  const f = [];
  a.replace(/(['"])?([\s\S]+?)\1(\s+|$)/g, (g, ...d) => {
    g = d.slice(0, d.length - 2).reduce((k, e, c) => {
      c = b[c];
      if (!c || void 0 === e) {
        return k;
      }
      k[c] = e;
      return k;
    }, {});
    f.push(g);
  });
  return f;
}
;const ta = a => sa(a).map(({a:b}) => b);
const ua = async a => {
  const {forkConfig:b, input:f, props:g = {}, contexts:d = []} = a;
  a = f ? ta(f) : [];
  const {j:k, i:e, options:c} = await ra(b, a, d, Object.assign({}, g, {input:f}));
  if (!k) {
    throw Error("Please specify a module to fork");
  }
  a = t(k, e, c);
  var h = ha(a);
  a.promise = h;
  a.spawnCommand = a.spawnargs.join(" ");
  const {promise:l, stdout:m, stdin:n, stderr:q} = a, {includeAnswers:B = !0, log:p, inputs:z, stderrInputs:w, stripAnsi:V = !0, preprocess:C} = b;
  a = new y;
  const D = new y;
  !0 === p ? (a.pipe(process.stdout), D.pipe(process.stderr)) : p && (p.stdout && a.pipe(p.stdout), p.stderr && D.pipe(p.stderr));
  const W = B && z;
  h = B && w;
  var u, v;
  W && (u = new L({rs:a}));
  h && (v = new L({rs:D}));
  N(m, n, z, a);
  N(q, n, w, D);
  a = await l;
  W && (u.end(), u = await u.promise, Object.assign(a, {stdout:u}));
  h && (v.end(), v = await v.promise, Object.assign(a, {stderr:v}));
  var {code:X, stdout:E, stderr:F} = a, x, r;
  "object" == typeof C ? {stdout:x, stderr:r} = C : "function" == typeof C && (x = r = C);
  E = E.replace(/\r?\n$/, "");
  F = F.replace(/\r?\n$/, "");
  u = V ? E.replace(/\033\[.*?m/g, "") : E;
  v = V ? F.replace(/\033\[.*?m/g, "") : F;
  x = x ? x(u) : u;
  r = r ? r(v) : v;
  Z(x, g.stdout, "stdout");
  Z(r, g.stderr, "stderr");
  if (g.code && X != g.code) {
    throw r = Error(`Fork exited with code ${X} != ${g.code}`), r.s = "code", r;
  }
  return a;
};
(async() => {
  const a = await ua({contexts:["CONTEXT"], forkConfig:{module:"example/fork", getArgs(b) {
    return [...b, this.o];
  }, getOptions(b) {
    return {env:{EXAMPLE:`${b} - ${this.input}`}};
  }, preprocess(b) {
    return `pre-${b}`;
  }}, input:"hello world", props:{o:"999", stdout:"pre-[ 'hello', 'world', '999' ]", stderr:"pre-CONTEXT - hello world"}});
  console.log(a);
})();


//# sourceMappingURL=depack.js.map