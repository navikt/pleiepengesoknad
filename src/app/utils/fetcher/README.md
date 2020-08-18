# Fetcher

Use fetcher to fetch stuff. 

Pass a recipe to the Fetcher describing what you want to fetch.

Also pass a function for "loading", "error" and "success", so that you can easily handle each case.

If you want to fetch two things, use Fetcher2. And for three things, use Fetcher3.

The Fetcher components uses the libraries fp-ts, io-ts, io-ts-reporters and axios.

For examples of how to use the Fetcher see ExampleView.tsx in the example-usage folder.

For an example on how to construct the recipe for a type, see exampleType.ts in the example-usage folder.

