The algorithm is simple. 
The app uses React and Next.js.

# Objectives: [Task, Estimated Time Cost, Actual Time Cost] 
* Define App Structure and Components
* Implement Q Learning Algorithm
~7mins

# Q-Learning Algorithm
1. define parameters:
alpha: 0 < alpha < 1;
epsilon: epsilon > 0;
gamma: 0 < gamma < 1;

2. Initialize Q(s, a) for all S, a element of action_space(s) abitrarily except
that Q(terminal, a element of action_space(terminal)) = 0.
*~
3. Set starting position for episode, s=S_start.
Loop For Each Step of Episode
4. Choose A given S using epsilon-greedy policy.
5. Take action A; observe R, S';
6. Update Q(S,A) := Q(S,A) + alpha * [R + lambda argmax_a( Q(S', a) - Q(S, A) )]
7. S := S'
Exit Loop when S == S_terminal

Restart for a given number of episodes.

# App Structure and Components
Basic Design:
1. We have the app as an abstract component.
2. We have the presentational table as an abstract component 
containing the q table as apart of its' state.
3. We have a controls component to step the state back and forward during an episode.
4. We have App State Summary component to display the number of steps taken for the current episode, and the previous number of episodes.

# Understood Limitations
1. When stepping the state backward, becuase of the randomness of the greedy action selection algorithm, the forward path is changed.
2.1. Debugging the error of the client  initializing the Q Table again after it is initialized on the server.  
The client initializes the Q table a second time, after it is passed from the server where it was originally initialized. This generates an error because there is a mismatch between the data becuase the Q table initialization function uses a random number generator.
Can I keep them in sync?
I disabled server side rendering and that removed the initial Server Mismatch Error. However, the issue now is that the currentState wont update. It says "Attempting to disconect a port object." The reason could be because it tries to communicate with the server. The called state setters do not result in a state change [setQ, setQChangeStack] don't work.
Hypothesis: Passing used values may help prevent scope errors and undefined values.
Fix: it was an error due to the mismatch of action indices and the Q table indices.
Confirmation:

# New Ideas
1. A component for setting parameters pre-experiment (define Experment object).
2. Improved Experimentation / Algorithm Design Optimization.
3. Multiple success and fail states.
4. If the currentState is terminal, the next step forward resets the episode. 
5. Heatmap/Value Density Info.
6. Add a Last Action Row to the AppStateSummary
7. Mean Q of each cell in table.
8. Add Direction Icons to each Q(s, a) state value.
