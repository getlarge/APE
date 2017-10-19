# Aloes Process Engine

## Requirements

- nodejs >= v8.0.0 ( why not with nvm ? )

## Infos

- Process state get saved in data directory

- Built on bpmn-engine library (#develop)

- Create or edit BPMN diagrams with Camunda modeler or bpmn.io

- Use #dev branch to commit changes


## Instructions

```
git clone git@framagit.org:getlarge/ape.git
```
In `ape` folder :
```
npm install
mkdir data
```
Edit `index.js` to chose which process to execute, then :
```
node index.js
```
Remove `data/*` to start with a fresh process 
```
rm data/*
```
 