# nodejs-streams-and-decorators

This repo holds two examples on how to implement nodejs decorators that use streams. Both examples execute the logic of decorated method before decorator logic, but this can be inversed; the decorator logic could be invoked first, then the decorated method's logic.


## Setup

```console
npm install
```

## Asynchronous

Run the following

```console
npm run async-streams-and-decorators
```

And notice the output

```
main: calling stubFunction with id (1)
MyClass.stubFunction: returning id 1
streamWrap.name: received id 1
streamWrap.name: returning id 1
main: result 1
main: calling stubFunction with id (2)
MyClass.stubFunction: returning id 2
streamWrap.name: received id 2
streamWrap.name: returning id 2
main: result 2
streamWrap.name: :-) 1
streamWrap.name: :-) 2
streamWrap.name: :-) 1
streamWrap.name: :-) 2
streamWrap.name: :-) 1
streamWrap.name: :-) 2
streamWrap.name: :-) 1
streamWrap.name: :-) 2
streamWrap.name: :-) 1
streamWrap.name: :-) 2
```

The logic that contains the stream statements, runs asynchronously relative to the decorated method's logic, meaning the logic in the decorator DOES NOT BLOCK the calling context (main).


## Synchronous

Run the following

```console
npm run sync-streams-and-decorators
```

And notice the output

```
main: calling stubFunction with id (1)
MyClass.stubFunction: returning id 1
streamWrap.name: received id 1
streamWrap.name: :-) 1
streamWrap.name: :-) 1
streamWrap.name: :-) 1
streamWrap.name: :-) 1
streamWrap.name: :-) 1
streamWrap.name: returning id 1
main: result 1
main: calling stubFunction with id (2)
MyClass.stubFunction: returning id 2
streamWrap.name: received id 2
streamWrap.name: :-) 2
streamWrap.name: :-) 2
streamWrap.name: :-) 2
streamWrap.name: :-) 2
streamWrap.name: :-) 2
streamWrap.name: returning id 2
main: result 2
```
The logic that contains the stream statements, runs synchronously relative to the decorated method's logic, meaning the logic in the decorator BLOCKS until it finishes before returning control to the calling context (main)
