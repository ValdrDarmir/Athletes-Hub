Game base logic:
 - A game is accessible via a route with the game's id (e.g. /game/123123-123)
 - Everybody with the url can access the game (could be changed later, to only let the players access)
 - the game's state is saved to database (id, playerIds, list of hits per player)
 - a hook encapsulates the game logic and provides functions and information, to present the game state and manipulate it 

Sample Game (Shoot the bird):
 - 2 players (for now)
 - players shoot after each other and input their points
 - after 5 rounds (for now) the game ends and shows a winner
