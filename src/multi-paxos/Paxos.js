/*
One paxos insance is created for each item in log.
*/
class Paxos {
  constructor(instanceId, nodesCount) {
    this.instanceId = instanceId;
    this.majority = Math.floor(nodesCount/2) + 1;
    this.proposalNumber = 1;
    this.promisedProposalNumber = 0;
    this.promisedProposalTo = 0;
    this.promises = {};
    this.acceptedValue = {};
    this.acceptedByOthers = {};
    this.finalValue = null;
  }

  updatePromise(proposalNumber, from) {
    if (this.isBehind(proposalNumber, from)) {
      this.promisedProposalNumber = proposalNumber;
      this.promisedProposalTo = from;
    } else {
      throw new Error("Should never happen, as there is a check earlier");
    }
  }

  isBehind(proposalNumber, from) {
    if (proposalNumber > this.promisedProposalNumber) {
      return true;
    }
    if ((proposalNumber === this.promisedProposalNumber)
      && (from > this.promisedProposalTo)) {
      return true;
    }
    return false;
  }

  isSame(proposalNumber, from) {
    if ((proposalNumber === this.promisedProposalNumber)
      && (from === this.promisedProposalTo)) {
      return true;
    }
    return false;
  }

  accept(proposalNumber, from, value) {
    if (this.isBehind(proposalNumber, from) || this.isSame(proposalNumber, from)) {
      this.acceptedValue = {
        proposalNumber: proposalNumber,
        proposedBy: from,
        value: value
      };
    } else {
      throw new Error("Should never happen, as there is a check earlier");
    }
  }

  gotFinalValue(acceptedBy, value) {
    if (this.finalValue) {
      return true;
    }
    this.acceptedByOthers[acceptedBy] = value;
    var majorValue = null;
    var majorCount = 1;
    Object.entries(this.acceptedByOthers).forEach(([k,v]) => {
      if (majorValue === v) {
        majorCount++;
      } else {
        if (majorCount === 1) {
          majorValue = v;
          majorCount = 1;
        } else {
          majorCount--;
        }
      }
    });
    if (majorCount === this.majority) {
      console.assert(!this.finalValue || (this.finalValue === majorValue));
      this.finalValue = majorValue;
      return true;
    }
    return false;
  }

  pickLargestAcceptedValue() {
    var selectedValue = null;
    var maxProposalNumber = 0;
    var maxProposedBy = '';
    Object.entries(this.promises).forEach(([k,v]) => {
      if ((v.proposalNumber > maxProposalNumber)||(
        (v.proposalNumber === maxProposalNumber) &&
        (v.proposedBy > maxProposedBy)
      )) {
        selectedValue = v.value;
        maxProposalNumber = v.proposalNumber;
        maxProposedBy = v.proposedBy;
      }
    });
    return selectedValue;
  }
}

export default Paxos;
