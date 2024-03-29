# Next Steps
## Electron
- UI Elements for battle
	- hp, locations for sprites
- UI Elements for the interlude
	- Idk
## Warlocks
- More types
- Real AI
## Map Generation
- The ability to hit gauntlets at all
- Making a map more like StS or CotL
## Fighting
- Moves
- Status affecting moves
- Weird ID affecting moves for 
## The Interlude
- Difficulty affecting healing/when you can heal
- Choices between next rooms
- The ability to teach moves
- so say we all
## The Database
- Adding more warlock types/daemon types/moves
## Misc
- Testinggggggg
- Difficulty changing things (healing, available mons, etc.)

# Actual Presentation Notes Below
# Broad Strokes of Gameplay Idea
Kaizo Nuzlocke Pokemon run X Slay the Spire

- What is Nuzlocke run?
- What is the Kaizo nuzlocke?
- What sorts of elements of StS are being implemented?

# Walkthrough
## From Front-end Perspective
- Show a demonstration (or should I say DAEMONstration)
## From Back-end perspective
Insert drawn diagrams
# Current Implementation Level

## Electron
### Currently
-  technically using Electron for the front-end, though the extent that I'm doing so is incredibly limited. 
### To Implement
- ?? I don't know enough about Electron lol

## Warlock generation
### Currently
- can create different "tiers" of a "type" of warlock, the pokemon equivalent of Hikers, youngsters, etc.
### To Implement
- More types, actually generate different tiers
- maybe "elites" that are a tier above where they should be for bonuses?
## Map
### Currently
- a linear map with a generated "gauntlet" of runs you can't save or switch between.
	- The gauntlet becomes available in a specific room randomly determined during Map creation
	- Currently the "gauntlet" has no way in game of accessing, but it can exist in the back end
### To Implement
- Add "bosses", i.e. gym leaders 
- "level up" your current Daemon to next tier after beating bosses, like using rare candies to level up to a community decided "max level" before a gym 
## Fighting
### Currently
- Attacks and switching work the way you'd expect. There is type countering and temporary, in fight stat affecting of attack, defense, and speed. These go away when the daemon is switched (like in pokemon)
- AI move selection is completely random
### To Implement
- Better AI would be nice
- Use of items by both you and AI
## Interludes
### Currently
- between fights can currently switch out any Daemon in the party for any held
- Always counts as a heal and move restore
### To Implement
 - Would like to see a difficulty affect restoration between fights
 - A way to access a gauntlet and/or a better map like StS

# Major Refactors
And why they had to be done
## Moving class data to getters and setters
Done to have some sort of idea of "private" and "public" variables. Not strictly necessary, but it is supposed to be best practices, so /shrug
# Weird Javascript Quirks
- Javascript cannot check for class type, the best you get is 'object'
- Javascript cannot have more than one constructor per class
## Usage of Session Storage
- All data that needs* to be saved between Battle Page and Interlude Page is saved in 'sessionStorage'
	- * I was unable to figure out how to save data between pages in other ways
	- There may be a way using Electron
- Stores atlas, currentParty, newReward, previousRoomID, allHeldMons
	- Atlas - game map
	- currentParty - the currently brought party
	- newReward - holds reward JSON for processing after a fight
	- previousRoomID - updates to current roomID at the end of a fight so Interlude can see previous room and find next room
	- allHeldMons - all daemons in 'Bill's PC', i.e. the set of Daemons you have minus whatever you've brought to battle
# Coding Standards
https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/#:~:text=if%20%2C%20else%20%2C%20for%20%2C%20while,last%20statement%20of%20the%20block.
## TL;DR
- camelCase except for
	- ALL_CAPS for constants
	- SnakeCase for classes
- bools get a name like "*is*Alive" or something with is or similar
- use "get" and "set" in classes  to pretend like Javascript has private variables
	- To that end, variables within a class get an underscore before them, the setter/getter name does not, see example below
```javascript
class MyClass {
	constructor( bar ) {
		this._foo = bar;
	}
	get foo() { return this._foo; }
	set foo( baz ) { this._foo = baz; }
}
```
