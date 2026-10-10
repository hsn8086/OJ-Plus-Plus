# Third-party runtime notices

The extension packages the following runtime components. Their licenses apply independently of OJ++'s GPL-3.0 source license.

| Component | Source / provenance | License reference |
| --- | --- | --- |
| Runno WASI JavaScript host | `@runno/wasi` 0.10.0, https://github.com/taybenlor/runno | `licenses/runno.txt` |
| Clang, wasm-ld and C/C++ sysroot artifacts | `taybenlor/runno` revision `3c32435e7a07a59aac3f5497040c8c6317d1cff3`, `langs/clang.wasm`, `langs/wasm-ld.wasm`, `langs/clang-fs.tar.gz` | LLVM, libc++, libc++abi and wasi-libc licenses below |
| LLVM 8.0.1 | https://github.com/llvm/llvm-project/tree/llvmorg-8.0.1 | `licenses/llvm8.txt` |
| libc++ and libc++abi | https://github.com/llvm/llvm-project/tree/llvmorg-8.0.1 | `licenses/libcxx8.txt`, `licenses/libcxxabi8.txt` |
| wasi-libc | https://github.com/WebAssembly/wasi-libc | `licenses/wasi-libc.txt` |
| CPython 3.11.3 WASI binary and standard library | Same pinned Runno revision, `langs/python-3.11.3.wasm`, `langs/python-3.11.3.tar.gz`; https://github.com/python/cpython/tree/v3.11.3 | `licenses/python311.txt` |
| PDF.js | https://github.com/mozilla/pdf.js | `licenses/pdfjs.txt` |
| KaTeX | https://github.com/KaTeX/KaTeX | `katex/LICENSE` |

The exact downloadable artifacts and SHA-256 digests are recorded in `runtimes/asset-lock.json` in the generated extension and `tools/runtime-assets.json` in the source repository. Runtime assets are verified during the build and then loaded locally; the installed extension does not download executable code from a CDN.

The `bits/stdc++.h` file supplied at runtime is an OJ++ compatibility header that includes standard C++17 headers. It is not GCC's implementation and does not provide PBDS or other GNU-only libraries.
