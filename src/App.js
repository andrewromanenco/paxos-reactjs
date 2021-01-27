import './App.css';
import MessageBroker from './MessageBroker';
//import Initializer from './heartbeat/HeartBeatExample'
//import Initializer from './ping/PingExample'
import Initializer from './basic-paxos/BasicPaxosExample'
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PauseOp from './PauseOp';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.messageBroker = new MessageBroker();
    this.example = new Initializer();
    this.example.create(this.messageBroker);
    if (this.messageBroker.nodes.length === 0) {
      throw new Error("No nodes to work with");
    }
    this.state = {
      nodes: [...this.messageBroker.nodes],
      tick: 1,
      brokenLinks: "[]",
      sleepTicks: "0",
      nodeToSleep: this.messageBroker.nodes[0].name
    }
    this.tick = this.tick.bind(this);
    this.handleBrokenLinksChange = this.handleBrokenLinksChange.bind(this);
    this.handleSleepTicksChange = this.handleSleepTicksChange.bind(this);
    this.handleNodeToSleepChange = this.handleNodeToSleepChange.bind(this);
    this.addSleepToNode = this.addSleepToNode.bind(this);
  }

  /*
  The "main" method. On exec it goes over all nodes and executes one
  operation from nodes' queues.
  */
  tick() {
    if (!this.messageBroker.validateBrokenLinks()) {
      return;
    }
    console.log("Start with tick " + this.state.tick);
    const scheduledTicks = [];
    this.state.nodes.forEach(node => {
      if (node.hasScheduledOps()) {
        scheduledTicks.push(node);
      }
    });
    scheduledTicks.forEach(node => {
      console.log("Tick on " + node.name);
      node.tick(this.state.tick);
    });
    console.log("Done with tick " + this.state.tick);
    console.log("------------------------");
    const newTick = this.state.tick + 1;
    const newNodes = [...this.messageBroker.nodes];
    this.setState({
      tick: newTick,
      nodes: newNodes,
    });
  }

  /*
  Simulates a node being "frozen" for a bit.
  */
  addSleepToNode() {
    this.state.nodes.forEach(node => {
      if (node.name === this.state.nodeToSleep) {
        console.log("Added sleep to " + node.name);
        node.scheduleOpOnTop(new PauseOp(parseInt(this.state.sleepTicks)));
      }
    });
    this.setState({nodes: [...this.state.nodes]});
  }

  handleBrokenLinksChange(event) {
    this.messageBroker.setBrokenLinks(event.target.value);
    this.setState({brokenLinks: event.target.value});
  }

  handleSleepTicksChange(event) {
    this.setState({sleepTicks: event.target.value});
  }

  handleNodeToSleepChange(event) {
    this.setState({nodeToSleep: event.target.value});
  }

  render() {
    return (
      <div>
        {this.example.controlUI()}
        <Button variant="contained" onClick={this.tick}>Tick ({this.state.tick})</Button><br/>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Node name</TableCell>
                <TableCell>Incoming queue</TableCell>
                <TableCell>State</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.nodes.map((node) => (
                <TableRow key={node.name}>
                  <TableCell>
                    {node.name}
                  </TableCell>
                  <TableCell>
                    {node.queue.map((item, ind) => (<div key={node.name + item.op + ind}>{JSON.stringify(item)}</div>))}
                  </TableCell>
                  <TableCell>
                  {Object.entries(node.state).map(([k,v]) => (
                    <div><pre>{k}: {JSON.stringify(v, null, 2)}</pre></div>
                  ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TextField
        label='Json list of pairs of broken list. E.g. [["A", "B"], ["A", "C"]] messages b/n A<->B and A<->C will be dropped.'
        value={this.state.brokenLinks}
        onChange={this.handleBrokenLinksChange}
        multiline={true}
        fullWidth={true}
        rows="10" /><br/>
        <TextField
        label='Sleep length in ticks'
        value={this.state.sleepTicks}
        onChange={this.handleSleepTicksChange}
        multiline={false}
        fullWidth={false}
        rows="1" />
        <Select value={this.state.nodeToSleep} onChange={this.handleNodeToSleepChange}>
          {this.state.nodes.map(node => (
            <MenuItem value={node.name}>{node.name}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={this.addSleepToNode}>Add sleep to {this.state.nodeToSleep}</Button><br/>
      </div>
    );
  }
}

export default App;
