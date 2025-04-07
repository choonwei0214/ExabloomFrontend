# ExabloomFrontend

This project is a React Flow based Workflow Builder, developed as part of the Exabloom Frontend Technical Test.

## Features

### Level 1: Basic Workflow
- Initialises with Start Node and End Node with Add Node connected in between them
- Add button is to insert new nodes into the workflow

### Level 2: Action Nodes
- Click Add Node to add Action Node into the workflow
- Dynamically insert Action Node and automatically connect them to surrounding nodes
- Edit Action Node name using a customised modal form
- Delete Action Nodes and auto-reconnect adjacent nodes

### Level 3: If/Else Node
- Add If/Else Node via the node selection menu
- Automatically creates 1 Branch Node and 1 Else Node
- Edit If/Else Node name, branch name and else node name using modal form
- Delete branch and If/Else Node and auto-reconnect adjacent nodes

## Tech Stack:
- React Js
- Typescript
- Tailwind CSS
- React Flow

## Getting Started:
1. Close the repo
```bash
git https://github.com/choonwei0214/ExabloomFrontend.git
```

2. Install dependencies
```bash
cd exabloom
npm install
```

3. Run
```bash
npm run start
```

## Video
https://www.loom.com/share/1e8c06a7610046a39cccf44371d3f146?sid=18f3c14e-32a7-4563-8331-66688b68f59b