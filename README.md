# Aloes Process Engine


## Infos

- Create or edit BPMN diagrams with Camunda modeler or bpmn.io

- Built on bpmn-engine library (#develop)

- Process state get saved in data directory

- Use #dev branch to commit changes


## Requirements

- nodejs >= v8.0.0 ( why not with nvm ? )

- Download APE :
```
git clone git@framagit.org:getlarge/ape.git
```
- In `ape` folder :
```
npm install
mkdir data
```
- Edit `config.sample.js` to add your custom config, then save under `config.js`

- Edit `index.js` to chose which process to execute, then :
```
npm start
```
- Remove `data/*` to start with a fresh process again :
```
rm data/*
```
 