---
layout: layouts/post.vto
title: "Kernel Misadventures"
summary: "I think i took \"build a PC\" too literally..."
date: 2026-04-12
---

So i've recently gotten into low-level development. It's been really fun to learn about how computers actually *do* stuff (it's just a lot of math)! I now have opinions on weird things like calling conventions, assembly syntax, and kernel architecture. But one thing has not been so fun.

## Languages kinda suck!

Every language has its own benefits and drawbacks, and they *all* look appealing in different ways. Pair that with an indecisive developer, and you get procrastination!

### C

It's not a surprise that C is one of the languages I've tried for kernel development. It's the tried and true, "been there; done that" language. Except it has one huge, glaring issue.

```c
int *ptr = NULL;  // ✅ make a pointer to nothing
do_literally_anything(*ptr)  ✅ // dereference that pointer
// 🧨 crashes because you just accessed nothingness (which is actually 0x00 but whatever it's still invalid)
```

C has literally no safety at all. which is not good for kernel development unless you enjoy setting your computer on metaphorical fire.

### Rust

Rust is much better, because you can't HAVE null in the first place. The borrow checker will make sure all of your code is safe before it gets compiled. However, if you really need to, you can dereference a raw pointer using `unsafe`.

```rust
let bad_ptr = 0x080DF46C2 as *const u8
unsafe {
    let value: ComplexType = *bad_ptr
    // 🧨 probably crashes because *bad_ptr is probably not a valid instance of ComplexType
}
```

Rust does have its own issues too. For example, it will fight you every single step of the way while setting up a kernel, and you'll end up writing complex build scripts and fighting with rust-analyzer to get the language server working. Most Rust learning resources also assume that you have the standard library, which must be disabled with **`#[no_std]`** in kernel code.

Also, one tiny thing: Rust eventually starts to look like explicitly-typed spaghetti if you work on a project for long enough.

### (Embedded) Swift

Here's one you probably didn't expect (unless you read my [last post](/blog/swift-6.3-awesomeness)). Yes, you can build a kernel and other bare-metal projects using Swift. You just lose a lot of Swift's standout features, of course, since it's Embedded.

```swift
// 🚫 no existential any
func doSomething(with argument: any MyProtocol) { /* ... */ }
// 🚫 no classes, ARC, or allocator
// technically this would work but it has *so* many weird issues so it's better to just use value types
let myClassInstance = MyClass()
// 🚫 no using dynamic lengths on types like String or Array<Element>
var message = "Anna is my bestie!"
var friendNames = ["Robin", "Levi", "Jakob"]
// 🚫 no objective-c (obviously, because there's no runtime)
@objc
struct MyValue { /* ... */ }
// 🚫 no foundation library or os library (you are the OS)
import Foundation
import FoundationEssentials
import Darwin
import WinSDK  // who even uses windows anymore
import Glibc
import Musl
import Android  // yes, regular swift 6.3 supports android
print("this code doesn't work")

// ✅ only import swift, embedded libraries, and built-in features that don't need stack
import Swift
// ✅ StaticString isn't heap-allocated, so it's fine
let name: StaticString = "Anna"
// ✅ InlineArray<count, Element> is the same, and you can use the [count of Element] shorthand
let friendNames: [3 of String] = ["Charlie", "Levi", "Jacob"]
```

But, you still get Swift's humane syntax, along with other great features of the language. Swift additionally has near-perfect c interop (as long as everything used is marked **`@c`**):

```swift
// c types:
// - hartID: unsigned int
// - flattenedDeviceTreePointer: const unsigned char *
@c("embedded_entry")  // <-- magic annotation
func embeddedEntry(
    hartID: UInt,
    flattendDeviceTreePointer: UnsafePointer<UInt8>
) -> Never {
    // perform entry and never return
    // nothing inside the function body needs to be c-compatible
}
```

The one giant elephant here is Embedded Swift's maturity, or the lack thereof. As Embedded is a very recent addition to Swift, it's not stable and makes many assumptions about your project.

## What's the best language then?

Sadly, there is no real _best_ language. If you want to start a project, choose the one that fulfills your needs the most. Right now i'm using Rust, but I'm also paying attention to Embedded Swift's progress.

Thanks for reading my rambling! Happy hacking.
