class User {
    constructor(userId, userName) {
        this.userId = userId;
        this.userName = userName;
    }

    getUserId() {
        return this.userId;
    }

    getUserName() {
        return this.userName;
    }
}

class Call {
    constructor(callId, callerId, receiverId, startTime, endTime, status) {
        this.callId = callId;
        this.callerId = callerId;
        this.receiverId = receiverId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    getCallId() {
        return this.callId;
    }

    getCallerId() {
        return this.callerId;
    }

    getReceiverId() {
        return this.receiverId;
    }

    getStartTime() {
        return this.startTime;
    }

    getEndTime() {
        return this.endTime;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }
}

class CallManager {
    constructor() {
        this.calls = new Map();
    }

    addCall(call) {
        this.calls.set(call.getCallId(), call);
    }

    updateCall(callId, updates) {
        const call = this.calls.get(callId);
        if (call) {
            for (let key in updates) {
                if (call.hasOwnProperty(key)) {
                    call[key] = updates[key];
                }
            }
        } else {
            console.log(`Call with ID ${callId} not found.`);
        }
    }

    deleteCall(callId) {
        if (this.calls.has(callId)) {
            this.calls.delete(callId);
        } else {
            console.log(`Call with ID ${callId} not found.`);
        }
    }

    searchCalls(callId) {
        return this.calls.get(callId);
    }
}

// Example usage
const user1 = new User(1, "Alice");
const user2 = new User(2, "Bob");

const call1 = new Call(1, user1.getUserId(), user2.getUserId(), "10:00", "10:30", "ongoing");

const callManager = new CallManager();
callManager.addCall(call1);

// Update call status
callManager.updateCall(1, { status: "missed" });

// Search call
const searchedCall = callManager.searchCalls(1);
if (searchedCall) {
    console.log(`Call Status: ${searchedCall.getStatus()}`);
} else {
    console.log("Call not found.");
}

// Delete call
callManager.deleteCall(1);
