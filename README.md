# Alparca
## Inspiration
Hundreds of millions of people suffer fromhorrible traffic problems and long parking times. We felt that it was a problem which desperately needs solution, a solution that can save time, money and also improve safety in the cities. With access to data from Smart Cities and Connected Cars, we felt that this was possible, and that's ho AlParca was born. 

## What it does
The current demo simulates about 1000 parked cars transmitting sensor information. We kept the readings to be very simple: each car has 2 sensors, one on the front and another one on the back, and transmits a single integer of either 0, 1 or 2 depending on how many sensors are active. From this, we can make a rough estimation of available parking space around the car. This information is then visualised onto a district in Barcelona.

## How we built it
Lots of love, coffee, coke, algorithm, programming and not enough sleep. 
We used a lot of hacking in JavaScript to make this work. We also experimented with using Node.js as the backend and mongoDB to store our data as well as the Sentilo/Thingtia API to manage the sensor information. The result is a simulation of moving cars that send information about cars parked in their vicinity as well as the ability to retrieve parking information in an area around the given coordinate.


## Challenges we ran into
Setting up database, debugging JavaScript, attempting to get the Thingtia API to work. 

## Accomplishments that we're proud of
We have simulated cars that move around in real-time, collecting data about available parking spots in Barcelona. 

## What's next for AlParca?
This proof of concept will await era of smart cars with open data.
