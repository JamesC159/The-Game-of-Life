# The Game of Life with Gosper's Glider Gun\
This is a React front-end and Express.js backend API implementation of the Game of Life.\
## How to install and run
* Download or clone the repository
* Ensure you have Node.js installed (The version used in this project is 15.12.0)
* Navigate to the api directory
    * Run `npm install` to install depenedencies
    * You can now run `npm start` to start the Express.js back-end
* Navigate to the gospers-gun directory
    * Again, run `npm install` to install dependencies
    * Again, you can now run You can now run `npm start` to start the React front-end
* Open a browser and enter the URL `localhost:3000`.


## Difficulties:\
I had a lot of trouble trying to figure out how to support a world as big as 2^64 x 2^64. Javascript only supports 32 bit objects and Chrome (where my testing was done) only supports a maximum of 4GB of RAM.
This led me to ideas such as creating my own data types that allowed me to juggle around multiple arrays / buffers / chunking data to simulate a field that could possibly support that big of a configuration (even though Chrome wouldn't allow it).
Given time constraints of a few days, I decided to abaondon this idea and remain focused on more pressing issues. A point can be made here, that processing something that big that is supposed to be rendered quickly, as it is the main component of the UI/UX
is impractical, as it would take a very long time for the user to see it. Something that big to be processed should be data that isn't needed often, or can be processed asynchronously in the background with the user caring about it or knowing it is happening\
I also had trouble trying to generate the Gosper's Glider Gun into an MxN matrix, given the requirement of placing the gun in the center of the matrix and not knowing what MxN could be, it becomes an interesting issue to try to insert the gun as it looks into a matrix that has variable width and height.
One possible solution I thought of was to take the field configuration (rows, columns) and map those numbers to an NxN matrix where rows/columns were used to decide how much of the screen to render (zoom level in other words).\
I had quite a few difficulties dealing with the toroidal surface problem. Most of them were due to trying to use modulus in ways that I haven't used in quite some time, along with a new understanding of how to create toroidal surfaces. after debugging for about a day,
I decided to opt for a simpler solution by creating a wrap around function that calculated the wrap around index for the top, bottom, left, and right boundaries of the matrix. With a little bit more code, we gain a lot of readability which in turn promotes maintainability.\


## Lessons Learned:
1. I learned the limits of the javascript language when it comes to object size.
1. I learned the limitations of browser RAM, as this has never been an issue I've needed to face in the professional world.