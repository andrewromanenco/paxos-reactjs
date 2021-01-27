# Paxos example in a react js app

This is a toy application to simulate multi Paxos running on top of three virtual nodes. When consensus is reached, values are added to the append-only log.

## Installation

Since this is an react-js app, clone and run:
```bash
npm start
```
or see the live demo [here](https://www.romanenco.com/sim-reactjs/multi-paxos/). And see below for other examples and links.

## How it works

This application supports a virtual network, which connects virtual nodes together. Every node has a queue of commands to execute and every tick one command from each node is executed.

The UI shows every node's state and execution queue. The UI allows putting nodes to sleep and breaking the network to simulate partitioning.

## Examples

This app has actually four use cases. To enable a specific example, you'll have to edit App.js and pick the one you want.

The use case are:

### Ping

Two nodes. One node sends a ping and waits for a reply. [Live](https://www.romanenco.com/sim-reactjs/ping/)

### Heart beat

There are three servers and three watchers. Servers send heartbeat messages to all watchers. If a server stops sending the heartbeat, watchers mark the server as offline. [Live](https://www.romanenco.com/sim-reactjs/heartbeat/)

### Basic Paxos

If you are not familiar with Paxos, you probably want to start here. This is a "classic" implementation.

Three proposers propose their names to three acceptors. Proposers make a random delay to add a bit of variance. Eventually two learners learn which value was agreed on. [Live](https://www.romanenco.com/sim-reactjs/basic-paxos/)

### Multi-Paxos

Multi Paxos is a quite vague definition. In this case, there are three nodes, each maintaining its own append-only log. A client offers numbers to add to the log to a random (NO leader) Paxos node. The client gets the result of the operation.

Basically, every node initiates a Paxos protocol instance for the next index in the log. In case of competing requests, only one value is selected and the other is rejected. [Live](https://www.romanenco.com/sim-reactjs/multi-paxos/)
