---
layout: layouts/post.vto
title: "Babe, wake up! Swift has module selectors"
summary: "It's like apple remembered what a language is!"
date: 2026-03-29
lastUpdated: 2026-07-05
---

If you haven't heard, as of writing this, Swift 6.3 has literally just released. It is a much-needed update, as I alluded to in the summary of this post.

## `@c` is here!

Previously, to expose something to c, you'd need to use the weird `@_cdecl` attribute that wrapped a Swift function in a C shim.

```swift
@_cdecl("mylib_greet")
func greet(_ name: UnsafeRawPointer) {
    let swiftString = String(cString: rawPtr.assumingMemoryBound(to: CChar.self))
    print("Hello, \(swiftString)!")
}
```

Ew.

Luckily, people noticed how weird this was (including me). There were still some problems to be ironed out, such as making sure types could actually be represented in C and not adding overhead when briding the two languages.

Eventually, those issues were fixed, and now we've got the newer, fancier, much cooler `@c` attribute!

```swift
@c(mylib_greet)
func greet(_ name: UnsafePointer<CChar>) {
    print("Hello, \(String(cString: name))!")
}
```

## Module Selectors

My biggest frustration with Swift frameworks is types that have the exact same name as their module (looking at you, [Drops](https://swiftpackageindex.com/omaralbeik/Drops)). No, I don't want to play compiler roulette every time I build the billionth Cookie Clicker clone.

The following snippet makes two of the exact same value.

```swift
import Drops

// implicitly from Drops
let drops = Drops(/* ... */)
// looks like you are initializing the nested type Drops.Drops when it's actually the top-level Drops type in the Drops module.
let drops = Drops.Drops(/* ... */)
```

That is very confusing. Now, it's much easier to specify exactly what type you are referring to. Below is the same thing with the new syntax.

```swift
import Drops

 // implicitly from Drops still
let drops = Drops(/* ... */)
// new way to specify that it's a module's type, not a type's nested type
let drops = Drops::Drops(/* ... */)
```

Another place this could be useful, for example, is specifying a todo-like task v.s. an asynchronous `Task` closure. Say we're building a SwiftUI app called _MyTaskTracker_. Before this, it'd be confusing to write `MyTaskTracker.Task` beacuse the app's type is supposed to be the name of the app's module by Apple's convention.

```swift
let task = MyTaskTracker::Task(self.title)  // the in-app task
Swift::Task {  // async code to execute
    self.upload(task)
}
```

The new syntax is much cleaner and easier to read. Thanks, Swift contributors!

## The Little Things

What would an update be without a billion smaller things that were barely even announced? I've listed my favorites here.

- You can use [Swift Build in SwiftPM](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/swiftbuildpreview/)
- DocC has new experiments
  - Export documentation as Markdown
  - SEO and accessibility got improved because you can have small, static HTML summaries of each page
  - Code blocks can be annotated to enable and disable additional features and styling
- Embedded Swift saw lots of small debugging improvements, and is begining to have a more usable toolset and dependency system
- [The Swift SDK for Android](https://www.swift.org/documentation/articles/swift-sdk-for-android-getting-started.html) is now available (and stable)

If you're interested in Swift, or C-like langauges, you should absolutely check out the [full article](https://www.swift.org/blog/swift-6.3-released/) on the official Swift website (especially the stuff on Embedded features).

Thanks for reading my first post! It was fun to write.
