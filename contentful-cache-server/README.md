This server is used to cache content from Contentful and serve it to our Mobile app. The cache TTL has been initially
set to 1 day, but can be changed in the code. 

Additionally, this server compresses responses, filters the full contentful response, and strips the contentful
metadata to reduce payload size and make the data easier to deal with on the client side.
